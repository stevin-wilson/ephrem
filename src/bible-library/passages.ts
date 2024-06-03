// - - - - - - - - - -

const getStringForPassageQuery = (passageQuery: PassageQuery): string => {
  const sortedPassageQuery = sortObject(passageQuery);
  return JSON.stringify(sortedPassageQuery);
};

const passagesCache = `${cacheDir}/passages.json`;

const serializePassages = (map: Passages): string => {
  const arr = Array.from(map.entries()).map(([key, value]) => ({
    passageQuery: key,
    passage: value,
  }));
  return JSON.stringify(arr, null, 2);
};

const savePassages = async (
  passages: Passages,
  filePath: string = passagesCache
) => {
  await writeJsonFile(filePath, serializePassages(passages));
};

// - - - - - - - - - -
const deserializePassages = (json: string): Passages => {
  const arr = JSON.parse(json);
  const map: Passages = new Map();

  arr.forEach((item: any) => {
    const key: PassageQueryString = item.passageQuery;
    const value: Passage = {
      text: item.passage.text,
      fums: item.passage.fums,
      cachedOn: new Date(item.passage.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

// - - - - - - - - - -
const loadPassages = async (
  filePath: string = passagesCache,
  max_age_days = 14
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return cleanUpOldRecords(deserializePassages(jsonData), max_age_days);
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as Passages;
  }
};

// - - - - - - - - - -
const passages: Passages = await loadPassages();

// - - - - - - - - - -
const updatePassage = async (
  passageID: string,
  bibleAbbreviation: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes = false,
  includeTitles = false,
  includeChapterNumbers = false,
  includeVerseNumbers = false,
  includeVerseSpans = false,
  config?: AxiosRequestConfig
): Promise<void> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (passages.get(passageQueryString)?.text) {
    return;
  }

  const bibleID = bibles.get(passageQuery.bibleAbbreviation)?.id;
  if (!bibleID) {
    throw Error;
  }

  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
    config
  );

  const passage: PassageText = {
    reference: passageAndFums.data.reference,
    content: passageAndFums.data.content,
    copyright: passageAndFums.data.copyright,
  };
  const fums: Fums = passageAndFums.meta.fums;
  const cachedOn: Date = new Date();
  const passageText: Passage = {text: passage, fums: fums, cachedOn: cachedOn};
  passages.set(passageQueryString, passageText);
};
