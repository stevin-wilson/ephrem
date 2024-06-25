import { BOOK_IDs } from './book-ids.js';
import { config } from '../utils.js';
export const setDefaultUseMajorityFallback = (useMajorityFallback) => {
    config.set('USE_MAJORITY_FALLBACK', useMajorityFallback);
};
export const getDefaultUseMajorityFallback = () => {
    return Boolean(config.get('USE_MAJORITY_FALLBACK'));
};
const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
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
export const hasValidReferenceGroupInformation = (referenceGroup) => {
    for (const attribute of [
        referenceGroup.chapterStart,
        referenceGroup.chapterEnd,
        referenceGroup.verseStart,
        referenceGroup.verseEnd,
    ]) {
        if (!isValidStringOrUndefined(attribute)) {
            return false;
        }
    }
    if (referenceGroup.chapterEnd !== undefined &&
        referenceGroup.chapterEnd !== referenceGroup.chapterStart &&
        referenceGroup.verseStart !== undefined &&
        referenceGroup.verseEnd === undefined) {
        return false;
    }
    return !(referenceGroup.verseEnd !== undefined &&
        referenceGroup.verseStart === undefined);
};
export const hasValidReferenceInformation = (reference) => {
    // check if Book is a key in BOOK_IDs
    if (typeof reference.book === 'undefined' || !(reference.book in BOOK_IDs)) {
        return false;
    }
    return hasValidReferenceGroupInformation(reference);
};
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
export const isSingleChapterMultipleVersesReference = (reference) => {
    return (!isMultiChapterReference(reference) && !isSingleVerseReference(reference));
};
export const getKeyOfMaxValue = (voteTally) => {
    // Ensure voteTally is an object
    if (typeof voteTally !== 'object' || voteTally === null) {
        throw new Error('voteTally must be an object');
    }
    let maxKey;
    let maxValue = -Infinity;
    // Iterate over each key-value pair in the voteTally object
    Object.entries(voteTally).forEach(([key, value]) => {
        // Ensure value is a number
        if (typeof value !== 'number') {
            throw new Error('All values in voteTally must be numbers');
        }
        // Update maxKey and maxValue if current value is greater than maxValue
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    });
    return maxKey;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlZmVyZW5jZS9yZWZlcmVuY2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRW5DLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLENBQUMsbUJBQTRCLEVBQUUsRUFBRTtJQUM1RSxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsR0FBWSxFQUFFO0lBQ3pELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsdUNBQXVDLENBQUM7QUFFakUsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsQ0FDdEMsS0FBeUIsRUFDaEIsRUFBRTtJQUNYLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztTQUFNLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEMseURBQXlEO1FBQ3pELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztTQUFNLENBQUM7UUFDTixrRUFBa0U7UUFDbEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FDTCxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ25CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQ3JELENBQUM7SUFD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