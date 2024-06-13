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
    return sections.join('-').replace(/\s+/g, '');
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
export const getReferenceGroups = (input, groupSeparator = ';') => {
    const referenceGrpsStrings = input
        .split(groupSeparator)
        .map(group => group.trim())
        .filter(group => group !== '');
    const output = new Map();
    for (const referenceGrpsString of referenceGrpsStrings) {
        output.set(referenceGrpsString, simplifyReferenceGroup(referenceGrpsString));
    }
    return output;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlZmVyZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLGdCQUFnQixHQUFHLHVDQUF1QyxDQUFDO0FBRWpFLG9CQUFvQjtBQUNwQixNQUFNLFlBQVksR0FBRyxDQUFDLFNBQW9CLEVBQVUsRUFBRTtJQUNwRCxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFFOUIsSUFBSSxlQUFlLEdBQ2pCLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNoQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN2RSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVwRCxJQUFJLGVBQWUsR0FBdUIsU0FBUyxDQUFDO0lBRXBELElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUMzRSxlQUFlLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RGLENBQUM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDOUMsZUFBZSxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDaEUsQ0FBQztTQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUM1QyxlQUFlLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0Is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