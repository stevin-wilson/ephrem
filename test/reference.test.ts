import {expect, test} from 'vitest';
import {
  hasValidSyntax,
  isMultiChapter,
  isSingleChapterMultipleVerses,
  isSingleVerse,
  Reference,
} from '../src/reference.js';
import {Books} from '../src/books.js';

// - - - - - - - - -
// test is valid syntax

test('chapterStart <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 0,
    verseStart: 16,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterStart > max', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 156,
    verseStart: 16,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterEnd <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    chapterEnd: 0,
    verseStart: 16,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterEnd > max', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    chapterEnd: 156,
    verseStart: 16,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('chapterEnd < chapterStart', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    chapterEnd: 2,
    verseStart: 16,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseStart <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 0,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseStart > max', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 177,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd <= 0', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 1,
    verseEnd: 0,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd > max', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 1,
    verseEnd: 177,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd < verseStart', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 16,
    verseEnd: 15,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

test('verseEnd defined but not verseStart', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseEnd: 15,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(false);
});

// - - - - - - - - -
// test single verse
test('reference is single verse', () => {
  const reference: Reference = {
    book: Books.John,
    chapterStart: 3,
    verseStart: 16,
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
    chapterStart: 3,
    verseStart: 16,
    verseEnd: 18,
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
    chapterStart: 3,
    chapterEnd: 4,
    verseStart: 16,
    verseEnd: 18,
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
    chapterStart: 3,
    chapterEnd: 4,
    bible: 'KJV',
  };

  expect(hasValidSyntax(reference)).toBe(true);
  expect(isSingleVerse(reference)).toBe(false);
  expect(isMultiChapter(reference)).toBe(true);
  expect(isSingleChapterMultipleVerses(reference)).toBe(false);
});
