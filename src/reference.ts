import {Reference, ReferenceGroup} from './types.js';

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
const createPassageBoundary = (
  book: string,
  chapter?: string,
  verse?: string
): string => {
  return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};

/**
 * Retrieves the passage ID based on the provided reference.
 * @param reference - The reference object containing book, chapter, and verse information.
 * @returns - The passage ID generated from the reference.
 */
export const getPassageID = (reference: Reference): string => {
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

/**
 * Checks if a given value is a valid string or undefined.
 * @param value - The value to be checked.
 * @returns - True if the value is a valid string or undefined, false otherwise.
 */
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

// - - - - - - - - -
/**
 * Checks if a given reference has a valid syntax.
 * @param reference - The reference object to check.
 * @returns - True if the reference has valid syntax, false otherwise.
 */
export const hasValidReferenceSyntax = (reference: Reference): boolean => {
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

  if (
    reference.chapterEnd !== undefined &&
    reference.chapterEnd !== reference.chapterStart &&
    reference.verseStart !== undefined &&
    reference.verseEnd === undefined
  ) {
    return false;
  }

  return !(
    reference.verseEnd !== undefined && reference.verseStart === undefined
  );
};

// - - - - - - - - -
/**
 * Determines if a given reference refers multiple chapters in the Bible.
 * @param reference - The reference to check.
 * @returns - True if the reference is multi-chapter, otherwise false.
 */
export const isMultiChapterReference = (reference: Reference): boolean => {
  let output: boolean;
  if (reference.chapterEnd === undefined) {
    output = false;
  } else {
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
export const isSingleVerseReference = (reference: Reference): boolean => {
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

// - - - - - - - - -
/**
 * Determines if the given reference is a single chapter with multiple verses reference.
 * @param reference - The reference to check.
 * @returns - True if the reference is a single chapter with multiple verses reference, false otherwise.
 */
export const isSingleChapterMultipleVersesReference = (
  reference: Reference
): boolean => {
  return (
    !isMultiChapterReference(reference) && !isSingleVerseReference(reference)
  );
};
