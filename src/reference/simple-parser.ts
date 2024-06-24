import {
  ParseReferencesOptions,
  Reference,
  ReferenceGroup,
  References,
  SplitReferenceGroupOptions,
} from './reference-types.js';
import {loadBiblesCache} from '../cache/cache-use-bibles.js';
import {getBookID} from './identify-book.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultLanguages,
  getDefaultMaxRetries,
} from '../api-bible/api-utils.js';
import {
  getDefaultBibles,
  getDefaultBiblesToExclude,
} from '../cache/cache-utils.js';
import {getDefaultUseMajorityFallback} from './reference-utils.js';

const extractTranslationsAndBookChapterVerse = (input: string) => {
  const translations = input.match(/\(([^)]+)\)/)?.[1];
  const bookChapterVerse = translations
    ? input.replace(`(${translations})`, '')
    : input;

  // Validate the input format
  if (bookChapterVerse.includes('-') && bookChapterVerse.includes(':')) {
    const hyphenIndex = bookChapterVerse.indexOf('-');
    const colonIndex = bookChapterVerse.indexOf(':');

    if (hyphenIndex < colonIndex) {
      throw new Error(`Invalid format for Reference: ${input}`);
    }
  }

  return {translations, bookChapterVerse};
};

const splitChapterAndVerse = (chapterVerse: string) => {
  const chapterVerseParts = chapterVerse
    .split('-')
    .map(trimPart => trimPart.trim());

  let chapterStart, chapterEnd, verseStart, verseEnd;

  if (chapterVerseParts[0]?.includes(':')) {
    [chapterStart, verseStart] = chapterVerseParts[0].split(':');
    if (chapterVerseParts[1]) {
      chapterEnd = chapterVerseParts[1].includes(':')
        ? chapterVerseParts[1].split(':')[0]
        : undefined;
      verseEnd = chapterVerseParts[1].includes(':')
        ? chapterVerseParts[1].split(':')[1]
        : chapterVerseParts[1];
    }
  } else {
    [chapterStart, chapterEnd] = chapterVerseParts;
  }
  return {chapterStart, chapterEnd, verseStart, verseEnd};
};

// - - - - - - - - -
export const parseReferenceGroup = (
  input: string,
  defaultBibles: string[] = getDefaultBibles()
): ReferenceGroup => {
  const {translations, bookChapterVerse} =
    extractTranslationsAndBookChapterVerse(input);

  // eslint-disable-next-line prefer-const
  let [bookName, chapterVerse] = bookChapterVerse.split(/\s+(?=\d)/);

  if (!bookName || !chapterVerse) {
    throw new Error(`Invalid format for Reference: ${input}`);
  }

  bookName = bookName.trim();

  const {chapterStart, chapterEnd, verseStart, verseEnd} =
    splitChapterAndVerse(chapterVerse);

  const bibles = translations?.split(',').map(bible => bible.trim());

  return {
    bookName,
    chapterStart,
    chapterEnd,
    verseStart,
    verseEnd,
    bibles: bibles || defaultBibles,
  };
};

export const splitReferenceGroup = async (
  options: SplitReferenceGroupOptions
): Promise<Reference[]> => {
  const {
    referenceGroup,
    useMajorityFallback = getDefaultUseMajorityFallback(),
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    languages = getDefaultLanguages(),
    biblesToExclude = getDefaultBiblesToExclude(),
    timestamp = new Date(),
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  const references: Reference[] = [];
  for (const bibleAbbreviation of referenceGroup.bibles) {
    const bookName = referenceGroup.bookName;
    const bookId = await getBookID({
      bookName,
      biblesCache,
      bibleAbbreviation,
      languages,
      useMajorityFallback,
      forceUpdateBiblesCache,
      biblesToExclude,
      config,
      timestamp,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });

    console.log(bookId);

    if (!bookId) {
      continue;
    }

    const reference: Reference = {
      book: bookId,
      chapterStart: referenceGroup.chapterStart,
      chapterEnd: referenceGroup.chapterEnd,
      verseStart: referenceGroup.verseStart,
      verseEnd: referenceGroup.verseEnd,
      bible: bibleAbbreviation,
    };

    references.push(reference);
  }

  return references;
};

export const parseReferences = async (
  options: ParseReferencesOptions
): Promise<References> => {
  const {
    input,
    delimiter = ';',
    defaultBibles = getDefaultBibles(),
    useMajorityFallback = getDefaultUseMajorityFallback(),
    forceUpdateBiblesCache = false,
    biblesCache = await loadBiblesCache(),
    languages = getDefaultLanguages(),
    biblesToExclude = getDefaultBiblesToExclude(),
    timestamp = new Date(),
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  if ([',', '.', ' '].includes(delimiter)) {
    throw Error;
  }

  const referenceGrpsStrings = input
    .split(delimiter)
    .map(group => group.trim())
    .filter(group => group !== '');

  const references: References = {};

  for (const referenceGroupString of referenceGrpsStrings) {
    const referenceGroup = parseReferenceGroup(
      referenceGroupString,
      defaultBibles
    );

    references[referenceGroupString] = await splitReferenceGroup({
      referenceGroup,
      biblesCache,
      languages,
      useMajorityFallback,
      forceUpdateBiblesCache,
      biblesToExclude,
      config,
      timestamp,
      retries,
      initialBackoff,
      delayBetweenCalls,
    });
  }

  return references;
};
