import {expect, test} from 'vitest';
import {parseReferenceGroup} from '../src/parser.js';
import {ReferenceGroup} from '../src/types.js';

// - - - - - - - - -
// Test get Reference Groups
test('single verse | multiple bibles', () => {
  const input = 'Genesis 1:1 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single verse | single bible', () => {
  const input = 'Genesis 1:1 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single verse | no bible', () => {
  const input = 'Genesis 1:1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single verse | multiple bibles', () => {
  const input = 'التكوين 1:1 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single verse | single bible', () => {
  const input = 'التكوين 1:1 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single verse | no bible', () => {
  const input = 'التكوين 1:1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter multi verse | multiple bibles', () => {
  const input = 'Genesis 1:1-2 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter multi verse | single bible', () => {
  const input = 'Genesis 1:1-2 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter multi verse | no bible', () => {
  const input = 'Genesis 1:1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter multi verse | multiple bibles', () => {
  const input = 'التكوين 1:1-2 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter multi verse | single bible', () => {
  const input = 'التكوين 1:1-2 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter multi verse | no bible', () => {
  const input = 'التكوين 1:1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter | multiple bibles', () => {
  const input = '1 Kings 1-2(NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter | single bible', () => {
  const input = '1 Kings 1-2(NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter | no bible', () => {
  const input = '1 Kings 1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter | multiple bibles', () => {
  const input = 'صموئيل الأول 1-2 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter | single bible', () => {
  const input = 'صموئيل الأول 1-2(NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter | no bible', () => {
  const input = 'صموئيل الأول 1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter with verses | multiple bibles', () => {
  const input = '1 ശമുവേൽ 1:1-2:3 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter with verses | single bible', () => {
  const input = '1 ശമുവേൽ 1:1-2:3(NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('multi chapter with verses | no bible', () => {
  const input = '1 ശമുവേൽ 1:1-2:3';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter with verses | multiple bibles', () => {
  const input = 'التكوين 1:1-2:3(NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter with verses | single bible', () => {
  const input = 'التكوين 1:1-2:3 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | multi chapter with verses | no bible', () => {
  const input = 'التكوين 1:1-2:3';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter | multiple bibles', () => {
  const input = '1 Kings 1 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter | multiple bibles', () => {
  const input = '1 ശമുവേൽ 1 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter | single bible', () => {
  const input = 'Revelation 1 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Revelation',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter | single bible | multi part book name', () => {
  const input = 'Song of Three Young Men 1 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Song of Three Young Men',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('single chapter | no bible', () => {
  const input = 'Song of Three Young Men 1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Song of Three Young Men',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter | multiple bibles', () => {
  const input = 'التكوين 1 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter | single bible', () => {
  const input = 'صموئيل الأول 1 (NIV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV'],
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});

test('RTL | single chapter | single bible', () => {
  const input = 'صموئيل الأول 1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: undefined,
  };
  expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});
