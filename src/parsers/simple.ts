import {ReferenceGroup} from '../types.js';

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

export const parseReferenceGroup = (input: string): ReferenceGroup => {
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
    bibles,
  };
};
