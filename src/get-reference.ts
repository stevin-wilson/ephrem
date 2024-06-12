import {ReferenceGroup} from './types.js';

// - - - - - - - - -
/**
 *
 * @param input
 */
function isLTR(input: string): boolean {
  const ltrPattern = /^\s*[^\d\s]+.*\d/; // Matches references with book name at the beginning
  return ltrPattern.test(input);
}

// - - - - - - - - -
/**
 *
 * @param input
 */
function parseLTRReference(input: string): ReferenceGroup {
  // Extract Bible versions if present
  const bibleVersionsMatch = input.match(/\((?<bibles>[^)]+)\)$/);
  let bibles: string[] | undefined;
  let reference = input;

  if (bibleVersionsMatch && bibleVersionsMatch.groups) {
    bibles = bibleVersionsMatch.groups.bibles.split(',').map(b => b.trim());
    reference = input.slice(0, bibleVersionsMatch.index).trim();
  }

  // Extract book name, chapter, and verse information
  const bookNameMatch = reference.match(
    /^(?<bookName>.+?)\s+(?<chapterVersePart>\d+(:\d+(-\d+)?)?(-\d+(:\d+(-\d+)?)?)?)$/
  );
  if (!bookNameMatch || !bookNameMatch.groups) {
    throw new Error('Invalid reference format');
  }

  const {bookName, chapterVersePart} = bookNameMatch.groups;

  let chapterStart: string, chapterEnd: string | undefined;
  let verseStart: string | undefined, verseEnd: string | undefined;

  // Handle different chapter and verse formats
  const chapterVerseMatch = chapterVersePart.match(
    /^(?<chapterStart>\d+)(:(?<verseStart>\d+))?(?:-(?<chapterEnd>\d+)(:(?<verseEnd>\d+))?)?(?:-(?<additionalChapterEnd>\d+)(:(?<additionalVerseEnd>\d+))?)?$/
  );
  if (chapterVerseMatch && chapterVerseMatch.groups) {
    chapterStart = chapterVerseMatch.groups.chapterStart;
    verseStart = chapterVerseMatch.groups.verseStart;

    if (chapterVerseMatch.groups.chapterEnd) {
      chapterEnd = chapterVerseMatch.groups.chapterEnd;
      verseEnd = chapterVerseMatch.groups.verseEnd;
    } else if (chapterVerseMatch.groups.additionalChapterEnd) {
      chapterEnd = chapterVerseMatch.groups.additionalChapterEnd;
      verseEnd = chapterVerseMatch.groups.additionalVerseEnd;
    } else if (chapterVerseMatch.groups.verseEnd) {
      verseEnd = chapterVerseMatch.groups.verseEnd;
    }
  } else {
    throw new Error('Invalid chapter and verse format');
  }

  // Construct and return the ReferenceGroup object
  const referenceGroup: ReferenceGroup = {
    bookName,
    chapterStart,
    ...(chapterEnd && {chapterEnd}),
    ...(verseStart && {verseStart}),
    ...(verseEnd && {verseEnd}),
    ...(bibles && {bibles}),
  };

  return referenceGroup;
}

// - - - - - - - - -
/**
 *
 * @param input
 */
function parseRTLReference(input: string): ReferenceGroup {
  // Extract Bible versions if present
  const bibleVersionsMatch = input.match(/^\((?<bibles>[^)]+)\)/);
  let bibles: string[] | undefined;
  let reference = input;

  if (bibleVersionsMatch && bibleVersionsMatch.groups) {
    bibles = bibleVersionsMatch.groups.bibles.split(',').map(b => b.trim());
    reference = input.slice(bibleVersionsMatch[0].length).trim();
  }

  // Extract chapter and verse information and book name at the end
  const chapterVerseMatch = reference.match(
    /^(?<chapterVersePart>\d+(:\d+(-\d+)?)?(-\d+(:\d+(-\d+)?)?)?)\s+(?<bookName>.+?)$/
  );
  if (!chapterVerseMatch || !chapterVerseMatch.groups) {
    throw new Error('Invalid reference format');
  }

  const {chapterVersePart, bookName} = chapterVerseMatch.groups;

  let chapterStart: string, chapterEnd: string | undefined;
  let verseStart: string | undefined, verseEnd: string | undefined;

  // Handle different chapter and verse formats
  const match = chapterVersePart.match(
    /^(?<chapterStart>\d+)(:(?<verseStart>\d+))?(?:-(?<chapterEnd>\d+)(:(?<verseEnd>\d+))?)?(?:-(?<additionalChapterEnd>\d+)(:(?<additionalVerseEnd>\d+))?)?$/
  );
  if (match && match.groups) {
    chapterStart = match.groups.chapterStart;
    verseStart = match.groups.verseStart;

    if (match.groups.chapterEnd) {
      chapterEnd = match.groups.chapterEnd;
      verseEnd = match.groups.verseEnd;
    } else if (match.groups.additionalChapterEnd) {
      chapterEnd = match.groups.additionalChapterEnd;
      verseEnd = match.groups.additionalVerseEnd;
    } else if (match.groups.verseEnd) {
      verseEnd = match.groups.verseEnd;
    }
  } else {
    throw new Error('Invalid chapter and verse format');
  }

  // Construct and return the ReferenceGroup object
  const referenceGroup: ReferenceGroup = {
    bookName,
    chapterStart,
    ...(chapterEnd && {chapterEnd}),
    ...(verseStart && {verseStart}),
    ...(verseEnd && {verseEnd}),
    ...(bibles && {bibles}),
  };

  return referenceGroup;
}

// - - - - - - - - -
/**
 *
 * @param input
 */
function parseReference(input: string): ReferenceGroup {
  return isLTR(input) ? parseLTRReference(input) : parseRTLReference(input);
}
