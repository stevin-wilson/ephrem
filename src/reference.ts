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
const getPassageID = (reference: Reference): string => {
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

// - - - - - - - - -
const referenceGroupRegex =
  /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?))?\s*(?:\(([^)]+)\))?$/;

/**
 * Retrieves the list of Bibles based on a given string.
 * @param biblesPart - The string containing comma-separated Bible names or undefined if no Bible names are provided.
 * @returns - An array of Bible names or undefined if no Bible names are provided.
 */
const getBiblesList = (biblesPart: string | undefined): string[] | undefined =>
  biblesPart ? biblesPart.split(',').map(bible => bible.trim()) : undefined;

/**
 * Splits the input string by '-' character and trims the resulting substrings.
 * @param input - The string to be split and trimmed.
 * @returns - An array containing the trimmed substrings.
 */
const splitAndTrim = (input: string | undefined): string[] =>
  (input || '').split('-');

/**
 * Simplifies a reference group string into a ReferenceGroup object.
 * @param input - The input string representing the reference group.
 * @returns - The simplified reference group object.
 * @throws {Error} - If the input string is not in the correct format.
 */
export const simplifyReferenceGroup = (input: string): ReferenceGroup => {
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
    throw new Error(
      'Input string does not match the reference group format. Please ensure your input is in the correct format such as: "Genesis 1:1 (NIV, KJV)" or "Genesis 1-2 (NIV, KJV)".'
    );
  }
  const [, bookName, chapterPart, versePart, biblesPart] = match;

  if (!bookName) {
    throw new Error(
      'Book name is missing or not in the correct format. It should be a string such as "Genesis".'
    );
  }

  const [chapterStart, chapterEnd] = splitAndTrim(chapterPart);
  if (!chapterStart) {
    throw new Error(
      'Chapter start is missing or not in the correct format. It should be a number such as "1".'
    );
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
export const getReferenceGroups = (
  input: string,
  groupSeparator = ';'
): Map<string, ReferenceGroup> => {
  return input
    .split(groupSeparator)
    .reduce((acc: Map<string, ReferenceGroup>, group: string) => {
      const trimmedGroup = group.trim();
      if (trimmedGroup !== '') {
        acc.set(trimmedGroup, simplifyReferenceGroup(trimmedGroup));
      }
      return acc;
    }, new Map());
};
