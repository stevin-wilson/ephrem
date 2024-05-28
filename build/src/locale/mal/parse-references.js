import { BookNames } from './book-names.js';
const defaultBible = 'MAL10RO';
const getNamesToBooks = () => {
    const namesToBooks = new Map();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtcmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sb2NhbGUvbWFsL3BhcnNlLXJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRzFDLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUUvQixNQUFNLGVBQWUsR0FBRyxHQUFpQixFQUFFO0lBQ3pDLE1BQU0sWUFBWSxHQUFpQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzdDLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUN0QyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3pCLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVsQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixTQUFTO1lBQ1gsQ0FBQztZQUVELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN0QyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsc0NBQXNDO0FBQ3RDLG1DQUFtQztBQUNuQyxzQkFBc0I7QUFDdEIsZ0VBQWdFO0FBQ2hFLG1FQUFtRTtBQUNuRSx3QkFBd0I7QUFDeEIsc0NBQXNDO0FBQ3RDLHFFQUFxRTtBQUNyRSxxRUFBcUU7QUFDckUsZUFBZTtBQUNmLHNDQUFzQztBQUN0Qyx3RkFBd0Y7QUFDeEYsZUFBZTtBQUNmLFNBQVM7QUFDVCxLQUFLIn0=