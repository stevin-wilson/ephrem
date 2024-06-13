// - - - - - - - - - -

import {defaultCacheDir, writeJsonFile} from '../utils.js';
import {
  Cache,
  Passage,
  PassageOptions,
  PassageQuery,
  Passages,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {fetchPassage} from './api-bible.js';

const getPassagesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/passages.json`;
};

// - - - - - - - - - -
// serialize Passages to JSON
export const savePassages = async (
  passages: Passages,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getPassagesCachePath(cacheDir),
    JSON.stringify(passages, null, 2)
  );
};

// - - - - - - - - - -
// deserialize JSON back to a Passages
const cleanPassagesCache = (
  passages: Passages,
  maxAgeDays = 14,
  currentTimestamp?: Date
): Passages => {
  let thresholdDate = currentTimestamp;
  if (thresholdDate === undefined) {
    thresholdDate = new Date();
  }
  thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);

  const cleanedPassages: Passages = {};

  for (const [passageAndBible, Passages] of Object.entries(passages)) {
    const filteredPassages = Passages.filter(
      passage => passage.cachedOn > thresholdDate
    );
    if (filteredPassages.length === 0) {
      continue;
    }

    cleanedPassages[passageAndBible] = filteredPassages;
  }
  return cleanedPassages;
};

export const loadPassages = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number,
  currentTimestamp?: Date
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
    const passages = JSON.parse(jsonData) as Passages;

    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanPassagesCache(passages, maxAgeDays, currentTimestamp);
    } else {
      return passages;
    }
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return {} as Passages;
  }
};

// - - - - - - - - - -
const getPassageAndBible = (passageID: string, bibleAbbreviation: string) =>
  `${passageID}@${bibleAbbreviation}`;

// - - - - - - - - - -
export const passageQueriesAreEqual = (
  query1: PassageQuery,
  query2: PassageQuery
): boolean => {
  return (
    query1.passageID === query2.passageID &&
    query1.bibleID === query2.bibleID &&
    query1.contentType === query2.contentType &&
    query1.includeNotes === query2.includeNotes &&
    query1.includeTitles === query2.includeTitles &&
    query1.includeChapterNumbers === query2.includeChapterNumbers &&
    query1.includeVerseNumbers === query2.includeVerseNumbers &&
    query1.includeVerseSpans === query2.includeVerseSpans
  );
};

// - - - - - - - - - -
const getPassage = async (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {},
  timestamp?: Date
): Promise<Passage> => {
  if (timestamp === undefined) {
    timestamp = new Date();
  }

  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    passageOptions,
    config
  );

  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  return {
    query: passageQuery,
    reference: passageAndFums.data.reference,
    content: passageAndFums.data.content,
    copyright: passageAndFums.data.copyright,
    fums: passageAndFums.meta.fums,
    cachedOn: timestamp,
  };
};

// - - - - - - - - - -
export const updatePassage = async (
  passageID: string,
  bibleAbbreviation: string,
  cache: Cache,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {},
  timestamp?: Date
): Promise<void> => {
  const bibleID = cache.bibles[bibleAbbreviation]?.id;
  if (!bibleID) {
    throw Error;
  }

  const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
  const passageQuery: PassageQuery = {
    passageID,
    bibleID,
    ...passageOptions,
  };

  const passages: Passage[] | undefined = cache.passages[passageAndBible];

  if (passages === undefined || passages.length === 0) {
    const newPassage: Passage = await getPassage(
      passageID,
      bibleID,
      passageOptions,
      config,
      timestamp
    );

    cache.passages[passageAndBible] = [newPassage];
  } else {
    let addedToPassages = false;

    for (const passage of passages) {
      if (passageQueriesAreEqual(passage.query, passageQuery)) {
        addedToPassages = true;
        break;
      }
    }

    if (!addedToPassages) {
      const newPassage: Passage = await getPassage(
        passageID,
        bibleID,
        passageOptions,
        config,
        timestamp
      );

      passages.push(newPassage);

      cache.passages[passageAndBible] = passages;
    }
  }
  cache.updatedSinceLoad = true;
};
