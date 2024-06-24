import {expect, test} from 'vitest';
import {
  getReferenceMap,
  parseReference,
  parseReferenceGroup,
} from '../src/parser.js';
import {Reference, ReferenceGroup} from '../src/types.js';
import {loadBiblesCache} from '../src/bibles.js';
import {getBookID} from '../src/identify-book.js';

const biblesCache = await loadBiblesCache('test/resources/cache', undefined);
// - - - - - - - - -
// Test get Reference Groups
test('single verse | multiple bibles', async () => {
  const input = '1 Kings 1:1 (OSB, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['OSB', 'KJV'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'OSB',
    },
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'KJV',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({input, biblesCache});

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('single verse | no bible', async () => {
  const input = '1 Kings 1:1';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['OSB', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'OSB',
    },
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['OSB', 'MAL10RO'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | single verse | multiple bibles', async () => {
  const input = 'التكوين 1:1 (NIV, KJV)';

  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['NIV', 'KJV'],
  };

  const references: Reference[] = [
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
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | single verse | no bible', async () => {
  const input = 'التكوين 1:1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: undefined,
    bibles: ['engKJV', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'engKJV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: undefined,
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'MAL10RO'],
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('single chapter multi verse | multiple bibles', async () => {
  const input = 'Genesis 1:1-2 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Genesis',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV', 'KJV'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'NIV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'KJV',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('single chapter multi verse | no bible', async () => {
  const input = '1 Kings 1:1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['OSB', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'OSB',
    },
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['OSB', 'MAL10RO'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | single chapter multi verse | multiple bibles', async () => {
  const input = 'التكوين 1:1-2 (NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['NIV', 'KJV'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'NIV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'KJV',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | single chapter multi verse | no bible', async () => {
  const input = 'التكوين 1:1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: '1',
    verseEnd: '2',
    bibles: ['engKJV', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'engKJV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: '1',
      verseEnd: '2',
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'MAL10RO'],
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('multi chapter | multiple bibles', async () => {
  const input = '1 Kings 1-2(NIV, OSB)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'OSB'],
  };
  const references: Reference[] = [
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'NIV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'OSB',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('multi chapter | no bible', async () => {
  const input = '1 Kings 1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['engKJV', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'engKJV',
    },
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
  });
  expect(bookID).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'MAL10RO'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | multi chapter | multiple bibles', async () => {
  const input = 'صموئيل الأول 1-2 (NIV, OSB)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['NIV', 'OSB'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'NIV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'OSB',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('1SA');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | multi chapter | no bible', async () => {
  const input = 'صموئيل الأول 1-2';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['engKJV', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'engKJV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('1SA');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'MAL10RO'],
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('multi chapter with verses | multiple bibles', async () => {
  const input = '1 ശമുവേൽ 1:1-2:3 (NIV, OSB)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV', 'OSB'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'NIV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'OSB',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['mal'],
  });
  expect(bookID).toStrictEqual('1SA');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['mal'],
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['mal'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('multi chapter with verses | no bible', async () => {
  const input = '1 ശമുവേൽ 1:1-2:3';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 ശമുവേൽ',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['engKJV', 'BSB'],
  };
  const references: Reference[] = [
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'engKJV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'BSB',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['mal'],
  });
  expect(bookID).toStrictEqual('1SA');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['mal'],
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'BSB'],
    languages: ['mal'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | multi chapter with verses | multiple bibles', async () => {
  const input = 'التكوين 1:1-2:3(NIV, KJV)';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['NIV', 'KJV'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'NIV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'KJV',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });

  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('RTL | multi chapter with verses | no bible', async () => {
  const input = 'التكوين 1:1-2:3';
  const referenceGroup: ReferenceGroup = {
    bookName: 'التكوين',
    chapterStart: '1',
    chapterEnd: '2',
    verseStart: '1',
    verseEnd: '3',
    bibles: ['engKJV', 'MAL10RO'],
  };
  const references: Reference[] = [
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'engKJV',
    },
    {
      book: 'GEN',
      chapterStart: '1',
      chapterEnd: '2',
      verseStart: '1',
      verseEnd: '3',
      bible: 'MAL10RO',
    },
  ];
  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    biblesCache,
    languages: ['arb'],
  });
  expect(bookID).toStrictEqual('GEN');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['arb'],
  });
  expect(observedReferences).toStrictEqual(references);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    defaultBibles: ['engKJV', 'MAL10RO'],
    languages: ['arb'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('single chapter | multiple bibles', async () => {
  const input = '1 Kings 1 (KJV, OSB)';
  const referenceGroup: ReferenceGroup = {
    bookName: '1 Kings',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['KJV', 'OSB'],
  };
  const references: Reference[] = [
    {
      book: '1KI',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'KJV',
    },
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'OSB',
    },
  ];

  const bookID = await getBookID({
    bookName: referenceGroup.bookName,
    bibleAbbreviation: 'KJV',
    biblesCache,
    languages: ['eng'],
    useMajorityFallback: false,
  });
  expect(bookID).toStrictEqual(undefined);

  const bookID_pass = await getBookID({
    bookName: referenceGroup.bookName,
    bibleAbbreviation: 'KJV',
    biblesCache,
    languages: ['eng'],
  });
  expect(bookID_pass).toStrictEqual('1KI');

  const observedReferences = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['eng'],
  });

  expect(observedReferences).toStrictEqual(references);

  const observedReferences_false = await parseReference({
    referenceGroup,
    biblesCache,
    languages: ['eng'],
    useMajorityFallback: false,
  });

  expect(observedReferences_false).toStrictEqual([
    {
      book: '1SA',
      chapterStart: '1',
      chapterEnd: undefined,
      verseStart: undefined,
      verseEnd: undefined,
      bible: 'OSB',
    },
  ]);

  const referenceMap = await getReferenceMap({
    input,
    biblesCache,
    languages: ['eng'],
  });

  expect(referenceMap.get(input)).toStrictEqual(references);
});

test('single chapter | multiple bibles', async () => {
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

test('single chapter | single bible | multi part book name', async () => {
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

test('single chapter | no bible', async () => {
  const input = 'Song of Three Young Men 1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'Song of Three Young Men',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['engKJV', 'MAL10RO'],
  };
  expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(
    referenceGroup
  );
});

test('RTL | single chapter | multiple bibles', async () => {
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

test('RTL | single chapter | no bible', async () => {
  const input = 'صموئيل الأول 1';
  const referenceGroup: ReferenceGroup = {
    bookName: 'صموئيل الأول',
    chapterStart: '1',
    chapterEnd: undefined,
    verseStart: undefined,
    verseEnd: undefined,
    bibles: ['KJV'],
  };
  expect(parseReferenceGroup(input, ['KJV'])).toStrictEqual(referenceGroup);
});

test('Invalid Input | multiple bibles', async () => {
  const input = 'Genesis 1-2:3 (NIV, KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError();
});

test('Invalid Input | single bible', async () => {
  const input = 'Genesis 1-2:3 (NIV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError();
});

test('Invalid Input | no bible', async () => {
  const input = 'Genesis 1-2:3';

  // Test the exact error message
  expect(() => parseReferenceGroup(input, ['KJV'])).toThrowError();
});

test('RTL | Invalid Input | multiple bibles', async () => {
  const input = 'صموئيل الأول 1-2:3(NIV, KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError();
});

test('RTL | Invalid Input | single bible', async () => {
  const input = 'صموئيل الأول 1-2:3(KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError();
});

test('RTL | Invalid Input | no bible', async () => {
  const input = 'صموئيل الأول 1-2:3';

  // Test the exact error message
  expect(() => parseReferenceGroup(input, ['KJV'])).toThrowError();
});

test('Invalid - Whole book | Multiple Bibles', async () => {
  const input = 'Genesis (NIV, KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError(
    /Invalid format for Reference/
  );
});

test('Invalid - Whole book | single bible', async () => {
  const input = 'Genesis (NIV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError(
    /Invalid format for Reference/
  );
});

test('Invalid - Whole book | no bibles', async () => {
  const input = 'Genesis';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError(
    /Invalid format for Reference/
  );
});

test('RTL | Invalid Input | multiple bibles', async () => {
  const input = 'التكوين (NIV, KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError();
});

test('RTL | Invalid - Whole book | single bible', async () => {
  const input = 'التكوين (KJV)';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError(
    /Invalid format for Reference/
  );
});

test('RTL | Invalid - Whole book | no bibles', async () => {
  const input = 'التكوين';

  // Test the exact error message
  expect(() => parseReferenceGroup(input)).toThrowError(
    /Invalid format for Reference/
  );
});
