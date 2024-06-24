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
const createPassageBoundary = (book, chapter, verse) => {
    return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};
export const getPassageID = (reference) => {
    // Ensure reference is an object
    if (typeof reference !== 'object' || reference === null) {
        throw new Error('Reference must be an object');
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlZmVyZW5jZS9yZWZlcmVuY2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV2QyxPQUFPLEVBQUMsTUFBTSxFQUFnQixNQUFNLGFBQWEsQ0FBQztBQUVsRCxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRyxDQUFDLG1CQUE0QixFQUFFLEVBQUU7SUFDNUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLEdBQVksRUFBRTtJQUN6RCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLHVDQUF1QyxDQUFDO0FBRWpFLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLENBQ3RDLEtBQXlCLEVBQ2hCLEVBQUU7SUFDWCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7U0FBTSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3hDLHlEQUF5RDtRQUN6RCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7U0FBTSxDQUFDO1FBQ04sa0VBQWtFO1FBQ2xFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxPQUFPLENBQ0wsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUNuQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUNyRCxDQUFDO0lB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