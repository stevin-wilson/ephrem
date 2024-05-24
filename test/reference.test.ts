import {expect, test} from 'vitest';
import {
  getReferenceGroups,
  hasValidSyntax,
  isMultiChapter,
  isSingleChapterMultipleVerses,
  isSingleVerse,
  isValidStringOrUndefined,
  Reference,
  ReferenceGroup,
  simplifyReferenceGroup,
} from '../src/reference.js';
import {Books} from '../src/books.js';

// - - - - - - - - -
// Test get Reference Groups
test('get reference groups', () => {
  const input = 'Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO)';

  expect(getReferenceGroups(input)).toStrictEqual([
    'Genesis 1:1 (NIV, KJV)',
    'John 3:16-17 (MAL10RO)',
  ]);
});

test('ignore empty reference group', () => {
  const input = 'Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO); \t \n';

  expect(getReferenceGroups(input)).toStrictEqual([
    'Genesis 1:1 (NIV, KJV)',
    'John 3:16-17 (MAL10RO)',
  ]);
});

// - - - - - - - - -
// test simplify reference group
test('simplify single verse with translations', () => {
  const expectation: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    verseStart: '1',
    bibles: ['NIV', 'KJV'],
  };

  expect(simplifyReferenceGroup('Genesis 1:1 (NIV, KJV)')).toEqual(expectation);
});

test('simplify multiple chapters without translation', () => {
  const expectation: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: '2',
  };

  expect(simplifyReferenceGroup('Genesis 1-2')).toEqual(expectation);
});

test('simplify multiple chapters with translation and book abbreviation', () => {
  const expectation: ReferenceGroup = {
    bookName: 'Gen.',
    chapterStart: '1',
    chapterEnd: '2',
    bibles: ['NIV', 'KJV'],
  };

  expect(simplifyReferenceGroup('Gen. 1-2   (NIV,KJV)')).toEqual(expectation);
});

test('simplify malayalam reference group', () => {
  const expectation: ReferenceGroup = {
    bookName: 'യോഹന്നാൻ',
    chapterStart: '3',
    verseStart: '16',
    verseEnd: '17',
    bibles: ['MAL10RO'],
  };

  expect(simplifyReferenceGroup('യോഹന്നാൻ 3:16-17 (MAL10RO)')).toEqual(
    expectation
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
    book: Books.John,
    chapterStart: '-1',
    verseStart: '1',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterStart is float', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '15.5',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterEnd <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '-1',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterEnd is float', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '156.1',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('only verseEnd is specified ', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: undefined,
    verseEnd: '16',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseStart <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '0',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseStart is float', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '177.2',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '1',
    verseEnd: '0',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd is float', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '1',
    verseEnd: '-177',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseStart specified and multi chapter', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '2',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('multi chapter', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
});

// - - - - - - - - -
// test single verse
test('reference is single verse', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '16',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
  expect(isSingleVerse(reference)).toBe(true);
  expect(isMultiChapter(reference)).toBe(false);
  expect(isSingleChapterMultipleVerses(reference)).toBe(false);
});

// - - - - - - - - -
// test single chapter multiple verses
test('reference contains multiple verses', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
  expect(isSingleVerse(reference)).toBe(false);
  expect(isMultiChapter(reference)).toBe(false);
  expect(isSingleChapterMultipleVerses(reference)).toBe(true);
});

// - - - - - - - - -
// test multiple chapters
test('reference contains multiple chapters', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
  expect(isSingleVerse(reference)).toBe(false);
  expect(isMultiChapter(reference)).toBe(true);
  expect(isSingleChapterMultipleVerses(reference)).toBe(false);
});

test('reference contains multiple chapters in full', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: '3',
    chapterEnd: '4',
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
  expect(isSingleVerse(reference)).toBe(false);
  expect(isMultiChapter(reference)).toBe(true);
  expect(isSingleChapterMultipleVerses(reference)).toBe(false);
});
