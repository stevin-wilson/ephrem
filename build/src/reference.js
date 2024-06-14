/**
 * Regular expression pattern for matching punctuation characters.
 */
const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
// - - - - - - - - -
/**
 * Creates a passage boundary string based on the given input.
 * @param book - The name of the book.
 * @param [chapter] - The chapter number.
 * @param [verse] - The verse number.
 * @returns - The passage boundary string.
 */
const createPassageBoundary = (book, chapter, verse) => {
    return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};
/**
 * Retrieves the passage ID based on the provided reference.
 * @param reference - The reference object containing book, chapter, and verse information.
 * @returns - The passage ID generated from the reference.
 */
const getPassageID = (reference) => {
    const sections = [];
    let requiredSection = createPassageBoundary(reference.book, reference.chapterStart, reference.verseStart);
    let optionalSection = undefined;
    if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
        optionalSection = createPassageBoundary(reference.book, reference.chapterEnd, reference.verseEnd);
    }
    else if (reference.chapterEnd !== undefined) {
        optionalSection = createPassageBoundary(reference.book, reference.chapterEnd);
    }
    else if (reference.verseEnd !== undefined) {
        requiredSection = createPassageBoundary(reference.book, reference.chapterStart, reference.verseEnd);
    }
    sections.push(requiredSection);
    if (optionalSection) {
        sections.push(optionalSection);
    }
    return sections.join('-').replace(/\s+/g, '');
};
/**
 * Checks if a given value is a valid string or undefined.
 * @param value - The value to be checked.
 * @returns - True if the value is a valid string or undefined, false otherwise.
 */
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
/**
 * Checks if a given reference has a valid syntax.
 * @param reference - The reference object to check.
 * @returns - True if the reference has valid syntax, false otherwise.
 */
export const hasValidReferenceSyntax = (reference) => {
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
/**
 * Determines if a given reference refers multiple chapters in the Bible.
 * @param reference - The reference to check.
 * @returns - True if the reference is multi-chapter, otherwise false.
 */
export const isMultiChapterReference = (reference) => {
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
/**
 * Determines whether a given reference refers to a single verse in the Bible.
 * @param reference - The reference to check.
 * @returns - True if the reference is a single verse reference, false otherwise.
 */
export const isSingleVerseReference = (reference) => {
    const isDifferentChapter = reference.chapterEnd !== undefined &&
        reference.chapterEnd !== reference.chapterStart;
    const isDifferentVerse = reference.verseEnd !== undefined &&
        reference.verseEnd !== reference.verseStart;
    return !(isMultiChapterReference(reference) ||
        isDifferentChapter ||
        reference.verseStart === undefined ||
        isDifferentVerse);
};
// - - - - - - - - -
/**
 * Determines if the given reference is a single chapter with multiple verses reference.
 * @param reference - The reference to check.
 * @returns - True if the reference is a single chapter with multiple verses reference, false otherwise.
 */
export const isSingleChapterMultipleVersesReference = (reference) => {
    return (!isMultiChapterReference(reference) && !isSingleVerseReference(reference));
};
// - - - - - - - - -
const referenceGroupRegex = /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?))?\s*(?:\(([^)]+)\))?$/;
/**
 * Retrieves the list of Bibles based on a given string.
 * @param biblesPart - The string containing comma-separated Bible names or undefined if no Bible names are provided.
 * @returns - An array of Bible names or undefined if no Bible names are provided.
 */
const getBiblesList = (biblesPart) => biblesPart ? biblesPart.split(',').map(bible => bible.trim()) : undefined;
/**
 * Splits the input string by '-' character and trims the resulting substrings.
 * @param input - The string to be split and trimmed.
 * @returns - An array containing the trimmed substrings.
 */
const splitAndTrim = (input) => (input || '').split('-');
/**
 * Simplifies a reference group string into a ReferenceGroup object.
 * @param input - The input string representing the reference group.
 * @returns - The simplified reference group object.
 * @throws {Error} - If the input string is not in the correct format.
 */
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
    const match = input.match(referenceGroupRegex);
    if (!match) {
        throw new Error('Input string does not match the reference group format. Please ensure your input is in the correct format such as: "Genesis 1:1 (NIV, KJV)" or "Genesis 1-2 (NIV, KJV)".');
    }
    const [, bookName, chapterPart, versePart, biblesPart] = match;
    if (!bookName) {
        throw new Error('Book name is missing or not in the correct format. It should be a string such as "Genesis".');
    }
    const [chapterStart, chapterEnd] = splitAndTrim(chapterPart);
    if (!chapterStart) {
        throw new Error('Chapter start is missing or not in the correct format. It should be a number such as "1".');
    }
    const [verseStart, verseEnd] = splitAndTrim(versePart);
    const bibles = getBiblesList(biblesPart);
    return {
        bookName,
        chapterStart,
        chapterEnd: chapterEnd || undefined,
        verseStart: verseStart || undefined,
        verseEnd: verseEnd || undefined,
        bibles,
    };
};
// - - - - - - - - -
/**
 * Gets reference groups from the given input string.
 * @param input - The input string containing reference groups.
 * @param [groupSeparator] - The separator used to separate reference groups.
 * @returns - The map of reference groups.
 * @throws {Error} If the input is not a string.
 */
export const getReferenceGroups = (input, groupSeparator = ';') => {
    return input
        .split(groupSeparator)
        .reduce((acc, group) => {
        const trimmedGroup = group.trim();
        if (trimmedGroup !== '') {
            acc.set(trimmedGroup, simplifyReferenceGroup(trimmedGroup));
        }
        return acc;
    }, new Map());
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlZmVyZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsdUNBQXVDLENBQUM7QUFFakUsb0JBQW9CO0FBRXBCOzs7Ozs7R0FNRztBQUNILE1BQU0scUJBQXFCLEdBQUcsQ0FDNUIsSUFBWSxFQUNaLE9BQWdCLEVBQ2hCLEtBQWMsRUFDTixFQUFFO0lBQ1YsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksT0FBTyxFQUFFLENBQUM7QUFDdEUsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBb0IsRUFBVSxFQUFFO0lBQ3BELE1BQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztJQUU5QixJQUFJLGVBQWUsR0FBRyxxQkFBcUIsQ0FDekMsU0FBUyxDQUFDLElBQUksRUFDZCxTQUFTLENBQUMsWUFBWSxFQUN0QixTQUFTLENBQUMsVUFBVSxDQUNyQixDQUFDO0lBQ0YsSUFBSSxlQUFlLEdBQXVCLFNBQVMsQ0FBQztJQUVwRCxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDM0UsZUFBZSxHQUFHLHFCQUFxQixDQUNyQyxTQUFTLENBQUMsSUFBSSxFQUNkLFNBQVMsQ0FBQyxVQUFVLEVBQ3BCLFNBQVMsQ0FBQyxRQUFRLENBQ25CLENBQUM7SUFDSixDQUFDO1NBQU0sSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQzlDLGVBQWUsR0FBRyxxQkFBcUIsQ0FDckMsU0FBUyxDQUFDLElBQUksRUFDZCxTQUFTLENBQUMsVUFBVSxDQUNyQixDQUFDO0lBQ0os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