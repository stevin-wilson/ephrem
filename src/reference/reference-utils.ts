import {Reference, ReferenceGroup, VoteTally} from './reference-types.js';
import {BOOK_IDs} from './book-ids.js';
import {DEFAULT_USE_MAJORITY_FALLBACK} from './reference-constants.js';

export const USE_MAJORITY_FALLBACK: boolean =
  process.env.EPHREM_USE_MAJORITY_FALLBACK?.toLowerCase() === 'true'
    ? true
    : DEFAULT_USE_MAJORITY_FALLBACK;

const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

export const isValidStringOrUndefined = (
  value: string | undefined
): boolean => {
  if (value === undefined) {
    return true;
  } else if (punctuationRegex.test(value)) {
    // Test if the string contains any punctuation characters
    return false;
  } else {
    // Check if the value is not a number or is a non-negative integer
    const parsedNumber = Number(value);
    return (
      isNaN(parsedNumber) ||
      (Number.isInteger(parsedNumber) && parsedNumber > 0)
    );
  }
};

const createPassageBoundary = (
  book: string,
  chapter?: string,
  verse?: string
): string => {
  return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};

export const getPassageID = (reference: Reference): string => {
  // Ensure reference is an object
  if (typeof reference !== 'object' || reference === null) {
    throw new Error('Reference must be an object');
  }

  const sections: string[] = [];

  let requiredSection = createPassageBoundary(
    reference.book,
    reference.chapterStart,
    reference.verseStart
  );
  let optionalSection: string | undefined = undefined;

  if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
    optionalSection = createPassageBoundary(
      reference.book,
      reference.chapterEnd,
      reference.verseEnd
    );
  } else if (reference.chapterEnd !== undefined) {
    optionalSection = createPassageBoundary(
      reference.book,
      reference.chapterEnd
    );
  } else if (reference.verseEnd !== undefined) {
    requiredSection = createPassageBoundary(
      reference.book,
      reference.chapterStart,
      reference.verseEnd
    );
  }

  sections.push(requiredSection);
  if (optionalSection) {
    sections.push(optionalSection);
  }

  return sections.join('-').replace(/\s+/g, '');
};

export const hasValidReferenceGroupInformation = (
  referenceGroup: any
): boolean => {
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

  if (
    referenceGroup.chapterEnd !== undefined &&
    referenceGroup.chapterEnd !== referenceGroup.chapterStart &&
    referenceGroup.verseStart !== undefined &&
    referenceGroup.verseEnd === undefined
  ) {
    return false;
  }

  return !(
    referenceGroup.verseEnd !== undefined &&
    referenceGroup.verseStart === undefined
  );
};

export const hasValidReferenceInformation = (reference: any): boolean => {
  // check if Book is a key in BOOK_IDs
  if (typeof reference.book === 'undefined' || !(reference.book in BOOK_IDs)) {
    return false;
  }

  return hasValidReferenceGroupInformation(reference);
};

export const isMultiChapterReference = (
  reference: Reference | ReferenceGroup
): boolean => {
  let output: boolean;
  if (reference.chapterEnd === undefined) {
    output = false;
  } else {
    output = reference.chapterEnd !== reference.chapterStart;
  }

  return output;
};

export const isSingleVerseReference = (
  reference: Reference | ReferenceGroup
): boolean => {
  const isDifferentChapter =
    reference.chapterEnd !== undefined &&
    reference.chapterEnd !== reference.chapterStart;
  const isDifferentVerse =
    reference.verseEnd !== undefined &&
    reference.verseEnd !== reference.verseStart;

  return !(
    isMultiChapterReference(reference) ||
    isDifferentChapter ||
    reference.verseStart === undefined ||
    isDifferentVerse
  );
};

export const isSingleChapterMultipleVersesReference = (
  reference: Reference | ReferenceGroup
): boolean => {
  return (
    !isMultiChapterReference(reference) && !isSingleVerseReference(reference)
  );
};

export const getKeyOfMaxValue = (voteTally: VoteTally): string | undefined => {
  // Ensure voteTally is an object
  if (typeof voteTally !== 'object' || voteTally === null) {
    throw new Error('voteTally must be an object');
  }

  let maxKey: string | undefined;
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
