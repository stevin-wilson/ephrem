import {BookNames, Usage} from './book-names.js';
import {Reference} from '../../reference.js';
import {NamesToBooks, ReferenceGroup} from '../common.js';

const defaultBible = 'KJV';

// 2 Kings -> 2 Samuel (Samuel_2) for orthodox bible references
// 2 Kings -> 2 Kings (Kings_2) for other bible references

const getNamesToBooks = (bibleType: Usage): NamesToBooks => {
  const namesToBooks: NamesToBooks = new Map();
  for (const [book, names] of BookNames) {
    for (const name of names) {
      if (!name.usage.includes(bibleType)) {
        continue;
      }

      namesToBooks.set(name.name, book);

      if (!name.abbreviations) {
        continue;
      }

      for (const abbr of name.abbreviations) {
        namesToBooks.set(abbr, book);
      }
    }
  }

  return namesToBooks;
};

// - - - - - - - - -
export const simplifyReferenceGroup = (input: string): ReferenceGroup => {
  // From string input representing reference group, get a referenceGroup object,
  // for example, when Genesis 1:1 (NIV, KJV) is input,
  // return {bookName: Genesis, chapterStart: '1', verseStart: '1', bibles: [NIV, KJV]}
  // for example, when Genesis 1-2 is input,
  // return {bookName: Genesis, chapterStart: '1', chapterEnd: '2'}
  // for example, when Genesis 1-2 (NIV, KJV) is input,
  // return {bookName: Genesis, chapterStart: '1', chapterEnd: '2', bibles: [NIV, KJV]}
  // when യോഹന്നാൻ 3:16-17 (MAL10RO) is input,
  // return {bookName: യോഹന്നാൻ, chapterStart: '3', verseStart: '16', verseEnd: '17', bibles: [MAL10RO]}
  const regex =
    /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?))?\s*(?:\(([^)]+)\))?$/;
  const match = input.match(regex);

  if (!match) {
    throw new Error('Input string is not in the correct format');
  }

  const [_, bookName, chapterPart, versePart, biblesPart] = match;

  const [chapterStart, chapterEnd] = chapterPart.split('-');
  const [verseStart, verseEnd] = (versePart || '').split('-');
  const bibles = biblesPart
    ? biblesPart.split(',').map(bible => bible.trim())
    : undefined;

  return {
    bookName: bookName,
    chapterStart: chapterStart,
    chapterEnd: chapterEnd ? chapterEnd : undefined,
    verseStart: verseStart ? verseStart : undefined,
    verseEnd: verseEnd ? verseEnd : undefined,
    bibles,
  };
};

// - - - - - - - - -
// const deconstructReferenceGroup = (
//   referenceGroup: ReferenceGroup
// ): Reference[] => {
//   // From string input, get a map from strings to References,
//   // for example, Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO)
//   // would generate {
//   //      Genesis 1:1 (NIV, KJV): [
//   //      {book: GEN, chapterStart: 1, verseStart: 1, bible: NIV},
//   //      {book: GEN, chapterStart: 1, verseStart: 1, bible: KJV},
//   //      ],
//   //      John 3:16-17 (MAL10RO): [
//   //      {book: JHN, chapterStart: 3, verseStart: 16, verseEnd: 17, bible: MAL10RO},
//   //      ],
//   // }
// };
