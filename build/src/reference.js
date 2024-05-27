const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
// - - - - - - - - -
const getPassageID = (reference) => {
    const sections = [];
    let requiredSection = reference.verseStart !== undefined
        ? `${reference.book}.${reference.chapterStart}.${reference.verseStart}`
        : `${reference.book}.${reference.chapterStart}`;
    let optionalSection = undefined;
    if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
        optionalSection = `${reference.book}.${reference.chapterEnd}.${reference.verseEnd}`;
    }
    else if (reference.chapterEnd !== undefined) {
        optionalSection = `${reference.book}.${reference.chapterEnd}`;
    }
    else if (reference.verseEnd !== undefined) {
        requiredSection += `.${reference.verseEnd}`;
    }
    sections.push(requiredSection);
    if (optionalSection) {
        sections.push(optionalSection);
    }
    return sections.join('-');
};
export const isValidStringOrUndefined = (value) => {
    if (value === undefined) {
        return true;
    }
    else if (punctuationRegex.test(value)) {
        // Test if the string contains any punctuation characters
        return false;
    }
    else {
        // Check if the value is not a number or is a non-negative integer
        const parsedNumber = Number(value);
        return (isNaN(parsedNumber) ||
            (Number.isInteger(parsedNumber) && parsedNumber > 0));
    }
};
// - - - - - - - - -
export const hasValidSyntax = (reference) => {
    for (const attribute of [
        reference.chapterStart,
        reference.chapterEnd,
        reference.verseStart,
        reference.verseEnd,
    ]) {
        if (!isValidStringOrUndefined(attribute)) {
            return false;
        }
    }
    if (reference.chapterEnd !== undefined &&
        reference.chapterEnd !== reference.chapterStart &&
        reference.verseStart !== undefined &&
        reference.verseEnd === undefined) {
        return false;
    }
    return !(reference.verseEnd !== undefined && reference.verseStart === undefined);
};
// - - - - - - - - -
export const isMultiChapter = (reference) => {
    let output;
    if (reference.chapterEnd === undefined) {
        output = false;
    }
    else {
        output = reference.chapterEnd !== reference.chapterStart;
    }
    return output;
};
// - - - - - - - - -
export const isSingleChapter = (reference) => {
    let output;
    if (isMultiChapter(reference)) {
        output = false;
    }
    else {
        output = true;
    }
    return output;
};
// - - - - - - - - -
export const isSingleVerse = (reference) => {
    if (isMultiChapter(reference)) {
        return false;
    }
    if (reference.chapterEnd !== undefined &&
        reference.chapterEnd !== reference.chapterStart) {
        return false;
    }
    if (reference.verseStart === undefined) {
        return false;
    }
    if (reference.verseEnd !== undefined &&
        reference.verseEnd !== reference.verseStart) {
        return false;
    }
    return true;
};
// - - - - - - - - -
export const isSingleChapterMultipleVerses = (reference) => {
    let output;
    if (!isSingleChapter(reference)) {
        output = false;
    }
    else
        output = !isSingleVerse(reference);
    return output;
};
// - - - - - - - - -
export const getReferenceGroups = (input) => input
    .split(';')
    .map(group => group.trim())
    .filter(group => group !== '');
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
// const getReferences = (
//   input: string,
//   languages: string[]
// ): Map<string, Reference[]> => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlZmVyZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLGdCQUFnQixHQUFHLHVDQUF1QyxDQUFDO0FBWWpFLG9CQUFvQjtBQUNwQixNQUFNLFlBQVksR0FBRyxDQUFDLFNBQW9CLEVBQVUsRUFBRTtJQUNwRCxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFFOUIsSUFBSSxlQUFlLEdBQ2pCLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNoQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN2RSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVwRCxJQUFJLGVBQWUsR0FBdUIsU0FBUyxDQUFDO0lBRXBELElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUMzRSxlQUFlLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RGLENBQUM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDOUMsZUFBZSxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDaEUsQ0FBQztTQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUM1QyxlQUFlLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsQ0FDdEMsS0FBeUIsRUFDaEIsRUFBRTtJQUNYLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztTQUFNLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEMseURBQXlEO1FBQ3pELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztTQUFNLENBQUM7UUFDTixrRUFBa0U7UUFDbEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FDTCxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ25CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQ3JELENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQW9CLEVBQVcsRUFBRTtJQUM5RCxLQUFLLE1BQU0sU0FBUyxJQUFJO1FBQ3RCLFNBQVMsQ0FBQyxZQUFZO1FBQ3RCLFNBQVMsQ0FBQyxVQUFVO1FBQ3BCLFNBQVMsQ0FBQyxVQUFVO1FBQ3BCLFNBQVMsQ0FBQyxRQUFRO0tBQ25CLEVBQUUsQ0FBQztRQUNGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3pDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7SUFFRCxJQUNFLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNsQyxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxZQUFZO1FBQy9DLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNsQyxTQUFTLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFDaEMsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUNOLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUN2RSxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQW9CLEVBQVcsRUFBRTtJQUM5RCxJQUFJLE1BQWUsQ0FBQztJQUNwQixJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNqQixDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sR0FBRyxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxZQUFZLENBQUM7SUFDM0QsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxTQUFvQixFQUFXLEVBQUU7SUFDL0QsSUFBSSxNQUFlLENBQUM7SUFFcEIsSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxHQUFHLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxDQUFDLFNBQW9CLEVBQVcsRUFBRTtJQUM3RCxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQzlCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQ0UsU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTO1FBQ2xDLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLFlBQVksRUFDL0MsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxJQUNFLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUztRQUNoQyxTQUFTLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQzNDLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRyxDQUMzQyxTQUFvQixFQUNYLEVBQUU7SUFDWCxJQUFJLE1BQWUsQ0FBQztJQUVwQixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDaEMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNqQixDQUFDOztRQUFNLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUUxQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFhLEVBQVksRUFBRSxDQUM1RCxLQUFLO0tBQ0YsS0FBSyxDQUFDLEdBQUcsQ0FBQztLQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7QUFZbkMsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsS0FBYSxFQUFrQixFQUFFO0lBQ3RFLCtFQUErRTtJQUMvRSxxREFBcUQ7SUFDckQscUZBQXFGO0lBQ3JGLDBDQUEwQztJQUMxQyxpRUFBaUU7SUFDakUscURBQXFEO0lBQ3JELHFGQUFxRjtJQUNyRiw0Q0FBNEM7SUFDNUMsc0dBQXNHO0lBQ3RHLE1BQU0sS0FBSyxHQUNULGlFQUFpRSxDQUFDO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUVoRSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsVUFBVTtRQUN2QixDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUVkLE9BQU87UUFDTCxRQUFRLEVBQUUsUUFBUTtRQUNsQixZQUFZLEVBQUUsWUFBWTtRQUMxQixVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDL0MsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQy9DLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUN6QyxNQUFNO0tBQ1AsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQiwwQkFBMEI7QUFDMUIsbUJBQW1CO0FBQ25CLHdCQUF3QjtBQUN4QixtQ0FBbUM7QUFDbkMsZ0VBQWdFO0FBQ2hFLG1FQUFtRTtBQUNuRSx3QkFBd0I7QUFDeEIsc0NBQXNDO0FBQ3RDLHFFQUFxRTtBQUNyRSxxRUFBcUU7QUFDckUsZUFBZTtBQUNmLHNDQUFzQztBQUN0Qyx3RkFBd0Y7QUFDeEYsZUFBZTtBQUNmLFNBQVM7QUFDVCxLQUFLIn0=