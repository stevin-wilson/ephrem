import {NamesToBooks, ReferenceGroup} from '../common.js';
import {BookNames} from './book-names.js';
import {Reference} from '../../reference.js';

const defaultBible = 'MAL10RO';

const getNamesToBooks = (): NamesToBooks => {
  const namesToBooks: NamesToBooks = new Map();
  for (const [book, names] of BookNames) {
    for (const name of names) {
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
