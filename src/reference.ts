import {Reference} from './types.js';

const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

// - - - - - - - - -
const getPassageID = (reference: Reference): string => {
  const sections: string[] = [];

  let requiredSection =
    reference.verseStart !== undefined
      ? `${reference.book}.${reference.chapterStart}.${reference.verseStart}`
      : `${reference.book}.${reference.chapterStart}`;

  let optionalSection: string | undefined = undefined;

  if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
    optionalSection = `${reference.book}.${reference.chapterEnd}.${reference.verseEnd}`;
  } else if (reference.chapterEnd !== undefined) {
    optionalSection = `${reference.book}.${reference.chapterEnd}`;
  } else if (reference.verseEnd !== undefined) {
    requiredSection += `.${reference.verseEnd}`;
  }

  sections.push(requiredSection);
  if (optionalSection) {
    sections.push(optionalSection);
  }

  return sections.join('-').replace(/\s+/g, '');
};
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
export const hasValidSyntax = (reference: Reference): boolean => {
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
export const isMultiChapter = (reference: Reference): boolean => {
  let output: boolean;
  if (reference.chapterEnd === undefined) {
    output = false;
  } else {
    output = reference.chapterEnd !== reference.chapterStart;
  }

  return output;
};

// - - - - - - - - -
export const isSingleChapter = (reference: Reference): boolean => {
  let output: boolean;

  if (isMultiChapter(reference)) {
    output = false;
  } else {
    output = true;
  }

  return output;
};

// - - - - - - - - -
export const isSingleVerse = (reference: Reference): boolean => {
  if (isMultiChapter(reference)) {
    return false;
  }

  if (
    reference.chapterEnd !== undefined &&
    reference.chapterEnd !== reference.chapterStart
  ) {
    return false;
  }

  if (reference.verseStart === undefined) {
    return false;
  }

  if (
    reference.verseEnd !== undefined &&
    reference.verseEnd !== reference.verseStart
  ) {
    return false;
  }

  return true;
};

// - - - - - - - - -
export const isSingleChapterMultipleVerses = (
  reference: Reference
): boolean => {
  let output: boolean;

  if (!isSingleChapter(reference)) {
    output = false;
  } else output = !isSingleVerse(reference);

  return output;
};
