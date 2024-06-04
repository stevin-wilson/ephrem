import {Reference, ReferenceGroup} from './types.js';

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

// - - - - - - - - -
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
  const regex =
    /^(.+?)\s+(\d+(?:-\d+)?)(?::(\d+(?:-\d+)?))?\s*(?:\(([^)]+)\))?$/;
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
export const getReferenceGroups = (
  input: string,
  groupSeparator = ';'
): Map<string, ReferenceGroup> => {
  const referenceGrpsStrings = input
    .split(groupSeparator)
    .map(group => group.trim())
    .filter(group => group !== '');

  const output: Map<string, ReferenceGroup> = new Map();

  for (const referenceGrpsString of referenceGrpsStrings) {
    output.set(
      referenceGrpsString,
      simplifyReferenceGroup(referenceGrpsString)
    );
  }

  return output;
};
