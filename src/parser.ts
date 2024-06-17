import {BiblesCache, Reference, ReferenceGroup, ReferenceMap} from './types.js';
import {
  defaultBibles,
  defaultBiblesToExclude,
  defaultLanguages,
} from './utils.js';
import {getBookID} from './identify-book.js';
import {AxiosRequestConfig} from 'axios';
import {defaultConfig} from './bible-library/api-bible.js';
import {loadBiblesCache} from './bible-library/bibles.js';

// Examples:
//
//
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: undefined,
//   }
//
//
// Case 2
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1-2 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1-2 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1-2
// defaultBibles: [MAL10B]
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [MAL10B],
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1-2 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1-2 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1-2
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: undefined,
//   }
//
// Case 3
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1-2 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1-2 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1-2
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1-2 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1-2 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1-2
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: undefined,
//   }
//
// Case 4
//
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1-2:3 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1-2:3 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1-2:3
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1-2:3 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1-2:3 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1-2:3
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: undefined,
//   }
//
// Case 5
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: undefined,
//   }
//
// Invalid Format
// Genesis 1-2:3 (NIV, KJV)
// Genesis 1-2:3 (NIV)
// Genesis 1-2:3
//
// Genesis (NIV, KJV)
// Genesis (NIV)
// Genesis
//  */

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
  fallbackBibles: string[] = defaultBibles
): ReferenceGroup => {
  const {translations, bookChapterVerse} =
    extractTranslationsAndBookChapterVerse(input);
  // eslint-disable-next-line prefer-const
  let [bookName, chapterVerse] = bookChapterVerse.split(/\s+(?=\d)/);

  if (!bookName || !chapterVerse)
    throw new Error(`Invalid format for Reference: ${input}`);

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
    bibles: bibles ? bibles : fallbackBibles,
  };
};

// - - - - - - - - -
export const parseReference = async (
  referenceGroup: ReferenceGroup,
  biblesCache?: BiblesCache,
  languages: string[] = defaultLanguages,
  useMajorityFallback = true,
  forceUpdateCache = false,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig
): Promise<Reference[]> => {
  const references: Reference[] = [];
  for (const bible of referenceGroup.bibles) {
    const bookId = await getBookID(
      referenceGroup.bookName,
      biblesCache,
      bible,
      languages,
      useMajorityFallback,
      forceUpdateCache,
      biblesToExclude,
      config
    );

    if (!bookId) {
      continue;
    }

    const reference: Reference = {
      book: bookId,
      chapterStart: referenceGroup.chapterStart,
      chapterEnd: referenceGroup.chapterEnd,
      verseStart: referenceGroup.verseStart,
      verseEnd: referenceGroup.verseEnd,
      bible,
    };
    references.push(reference);
  }

  return references;
};

// - - - - - - - - -
export const getReferenceMap = async (
  input: string,
  biblesCache?: BiblesCache,
  delimiter = ';',
  fallbackBibles: string[] = defaultBibles,
  languages: string[] = defaultLanguages,
  useMajorityFallback = true,
  forceUpdateCache = false,
  biblesToExclude: string[] = defaultBiblesToExclude,
  config: AxiosRequestConfig = defaultConfig
): Promise<ReferenceMap> => {
  if ([',', '.', ' '].includes(delimiter)) {
    throw Error;
  }

  const referenceGrpsStrings = input
    .split(delimiter)
    .map(group => group.trim())
    .filter(group => group !== '');

  const referenceMap: ReferenceMap = new Map();

  for (const referenceGroupString of referenceGrpsStrings) {
    const referenceGroup = parseReferenceGroup(
      referenceGroupString,
      fallbackBibles
    );
    const references = await parseReference(
      referenceGroup,
      biblesCache,
      languages,
      useMajorityFallback,
      forceUpdateCache,
      biblesToExclude,
      config
    );

    referenceMap.set(referenceGroupString, references);
  }

  return referenceMap;
};
