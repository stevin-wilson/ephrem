import {expect, test} from 'vitest';
import {Reference} from '../src/reference/reference-types.js';
import {getPassageID} from '../src/passage/passage-utils.js';

// single verse
test('multi chapter with verses', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: undefined,
    verseStart: '16',
    verseEnd: undefined,
    bible: 'KJV',
  };

  expect(getPassageID(reference)).toBe('JHN.3.16');
});

// single chapter multi verse
test('single chapter multiple verses', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '3',
    bible: 'KJV',
  };

  expect(getPassageID(reference)).toBe('JHN.3.1-JHN.3.3');
});

// multi chapter
test('multi chapter without verses', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: undefined,
    verseEnd: undefined,
    bible: 'KJV',
  };

  expect(getPassageID(reference)).toBe('JHN.3-JHN.4');
});

// multi chapter with verses
test('multi chapter with verses', () => {
  const reference: Reference = {
    book: 'JHN',
    chapterStart: '3',
    chapterEnd: '4',
    verseStart: '16',
    verseEnd: '18',
    bible: 'KJV',
  };

  expect(getPassageID(reference)).toBe('JHN.3.16-JHN.4.18');
});
