import {expect, test} from 'vitest';
import {parseReferences} from '../src/reference/simple-parser.js';
import {loadBiblesCache} from '../src/cache/cache-use-bibles.js';
import {
  hasValidReferenceInformation,
  isMultiChapterReference,
  isSingleChapterMultipleVersesReference,
  isSingleVerseReference,
  isValidStringOrUndefined,
} from '../src/reference/reference-utils.js';
import {Reference} from '../src/reference/reference-types.js';

const biblesCache = await loadBiblesCache({
  cacheDir: 'test/resources/cache',
  maxCacheAgeDays: undefined,
});

// - - - - - - - - -
// Test get Reference Groups
test('get reference groups', async () => {
  const input = 'Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO)';

  const expectedOutput = {
    'Genesis 1:1 (NIV, KJV)': [
      {
        book: 'GEN',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bible: 'NIV',
      },
      {
        book: 'GEN',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bible: 'KJV',
      },
    ],
    'John 3:16-17 (MAL10RO)': [
      {
        book: 'JHN',
        chapterStart: '3',
        chapterEnd: undefined,
        verseStart: '16',
        verseEnd: '17',
        bible: 'MAL10RO',
      },
    ],
  };

  expect(await parseReferences({input, biblesCache})).toStrictEqual(
    expectedOutput
  );
});

test('ignore empty reference group', async () => {
  const input = 'Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO); \t \n';

  const expectedOutput = {
    'Genesis 1:1 (NIV, KJV)': [
      {
        book: 'GEN',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bible: 'NIV',
      },
      {
        book: 'GEN',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bible: 'KJV',
      },
    ],
    'John 3:16-17 (MAL10RO)': [
      {
        book: 'JHN',
        chapterStart: '3',
        chapterEnd: undefined,
        verseStart: '16',
        verseEnd: '17',
        bible: 'MAL10RO',
      },
    ],
  };

  expect(await parseReferences({input, biblesCache})).toStrictEqual(
    expectedOutput
  );
});

// - - - - - - - - -
// test is Valid String Or Undefined
test('value is undefined', () => {
  expect(isValidStringOrUndefined(undefined)).toBe(true);
});

test('value is a positive integer', () => {
  expect(isValidStringOrUndefined('42')).toBe(true);
});

test('value is a negative integer', () => {
  expect(isValidStringOrUndefined('-1')).toBe(false);
});

test('value is a arbitary string', () => {
  expect(isValidStringOrUndefined('abc')).toBe(true);
});

test('value is a float', () => {
  expect(isValidStringOrUndefined('42.5')).toBe(false);
});

test('value is a negative float', () => {
  expect(isValidStringOrUndefined('-1.5')).toBe(false);
});

test('value is a character', () => {
  expect(isValidStringOrUndefined('A')).toBe(true);
});

// - - - - - - - - -
// test is valid syntax

test('chapterStart <= 0', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '-1',
    verseStart: '1',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('chapterStart is float', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '15.5',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('chapterEnd <= 0', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '-1',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('chapterEnd is float', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '156.1',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('only verseEnd is specified ', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: undefined,
    verseEnd: '16',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('verseStart <= 0', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '0',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('verseStart is float', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '177.2',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('verseEnd <= 0', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '1',
    verseEnd: '0',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('verseEnd is float', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '1',
    verseEnd: '-177',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('verseStart specified and multi chapter', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '2',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(false);
});

test('multi chapter', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(true);
});

// - - - - - - - - -
// test single verse
test('reference is single verse', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(true);
  expect(isSingleVerseReference(reference)).toBe(true);
  expect(isMultiChapterReference(reference)).toBe(false);
  expect(isSingleChapterMultipleVersesReference(reference)).toBe(false);
});

// - - - - - - - - -
// test single chapter multiple verses
test('reference contains multiple verses', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(true);
  expect(isSingleVerseReference(reference)).toBe(false);
  expect(isMultiChapterReference(reference)).toBe(false);
  expect(isSingleChapterMultipleVersesReference(reference)).toBe(true);
});

// - - - - - - - - -
// test multiple chapters
test('reference contains multiple chapters', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(true);
  expect(isSingleVerseReference(reference)).toBe(false);
  expect(isMultiChapterReference(reference)).toBe(true);
  expect(isSingleChapterMultipleVersesReference(reference)).toBe(false);
});

test('reference contains multiple chapters in full', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    bible: 'KJV',
  };

  expect(hasValidReferenceInformation(reference)).toBe(true);
  expect(isSingleVerseReference(reference)).toBe(false);
  expect(isMultiChapterReference(reference)).toBe(true);
  expect(isSingleChapterMultipleVersesReference(reference)).toBe(false);
});
