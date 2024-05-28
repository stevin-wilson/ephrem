import { BookNames } from './book-names.js';
const defaultBible = 'KJV';
// 2 Kings -> 2 Samuel (Samuel_2) for orthodox bible references
// 2 Kings -> 2 Kings (Kings_2) for other bible references
const getNamesToBooks = (bibleType) => {
    const namesToBooks = new Map();
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
export const simplifyReferenceGroup = (input) => {
    // From string input representing reference group, get a referenceGroup object,
    // for example, when Genesis 1:1 (NIV, KJV) is input,
    // return {bookName: Genesis, chapterStart: '1', verseStart: '1', bibles: [NIV, KJV]}
    // for example, when Genesis 1-2 is input,
    // return {bookName: Genesis, chapterStart: '1', chapterEnd: '2'}
    // for example, when Genesis 1-2 (NIV, KJV) is input,
    // return {bookName: Genesis, chapterStart: '1', chapterEnd: '2', bibles: [NIV, KJV]}
    // when യോഹന്നാൻ 3:16-17 (MAL10RO) is input,
    // return {bookName: യോഹന്നാൻ, chapterStart: '3', verseStart: '16', verseEnd: '17', bibles: [MAL10RO]}
    const regex = /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?))?\s*(?:\(([^)]+)\))?$/;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtcmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sb2NhbGUvZW5nL3BhcnNlLXJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBUSxNQUFNLGlCQUFpQixDQUFDO0FBSWpELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQztBQUUzQiwrREFBK0Q7QUFDL0QsMERBQTBEO0FBRTFELE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBZ0IsRUFBZ0IsRUFBRTtJQUN6RCxNQUFNLFlBQVksR0FBaUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUM3QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksU0FBUyxFQUFFLENBQUM7UUFDdEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsU0FBUztZQUNYLENBQUM7WUFFRCxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsU0FBUztZQUNYLENBQUM7WUFFRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDdEMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsS0FBYSxFQUFrQixFQUFFO0lBQ3RFLCtFQUErRTtJQUMvRSxxREFBcUQ7SUFDckQscUZBQXFGO0lBQ3JGLDBDQUEwQztJQUMxQyxpRUFBaUU7SUFDakUscURBQXFEO0lBQ3JELHFGQUFxRjtJQUNyRiw0Q0FBNEM7SUFDNUMsc0dBQXNHO0lBQ3RHLE1BQU0sS0FBSyxHQUNULGlFQUFpRSxDQUFDO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUVoRSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsVUFBVTtRQUN2QixDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUVkLE9BQU87UUFDTCxRQUFRLEVBQUUsUUFBUTtRQUNsQixZQUFZLEVBQUUsWUFBWTtRQUMxQixVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDL0MsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQy9DLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUN6QyxNQUFNO0tBQ1AsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixzQ0FBc0M7QUFDdEMsbUNBQW1DO0FBQ25DLHNCQUFzQjtBQUN0QixnRUFBZ0U7QUFDaEUsbUVBQW1FO0FBQ25FLHdCQUF3QjtBQUN4QixzQ0FBc0M7QUFDdEMscUVBQXFFO0FBQ3JFLHFFQUFxRTtBQUNyRSxlQUFlO0FBQ2Ysc0NBQXNDO0FBQ3RDLHdGQUF3RjtBQUN4RixlQUFlO0FBQ2YsU0FBUztBQUNULEtBQUsifQ==