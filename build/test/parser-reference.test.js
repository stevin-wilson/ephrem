import { expect, test } from 'vitest';
import { loadBiblesCache } from '../src/cache/cache-use-bibles.js';
import { getBookID, parseReferences } from '../src/index.js';
import { parseReferenceGroup, splitReferenceGroup, } from '../src/reference/simple-parser.js';
const biblesCache = await loadBiblesCache({
    cacheDir: 'test/resources/cache',
    maxCacheAgeDays: undefined,
});
// - - - - - - - - -
// Test get Reference Groups
test('single verse | multiple bibles', async () => {
    const input = '1 Kings 1:1 (OSB, KJV)';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['OSB', 'KJV'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({ input, biblesCache });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('single verse | no bible', async () => {
    const input = '1 Kings 1:1';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['OSB', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['OSB', 'MAL10RO'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | single verse | multiple bibles', async () => {
    const input = 'التكوين 1:1 (NIV, KJV)';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['NIV', 'KJV'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | single verse | no bible', async () => {
    const input = 'التكوين 1:1';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'MAL10RO'],
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('single chapter multi verse | multiple bibles', async () => {
    const input = 'Genesis 1:1-2 (NIV, KJV)';
    const referenceGroup = {
        bookName: 'Genesis',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['NIV', 'KJV'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('single chapter multi verse | no bible', async () => {
    const input = '1 Kings 1:1-2';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['OSB', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['OSB', 'MAL10RO'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | single chapter multi verse | multiple bibles', async () => {
    const input = 'التكوين 1:1-2 (NIV, KJV)';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['NIV', 'KJV'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | single chapter multi verse | no bible', async () => {
    const input = 'التكوين 1:1-2';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['engKJV', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'MAL10RO'],
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('multi chapter | multiple bibles', async () => {
    const input = '1 Kings 1-2(NIV, OSB)';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['NIV', 'OSB'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('multi chapter | no bible', async () => {
    const input = '1 Kings 1-2';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'MAL10RO'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | multi chapter | multiple bibles', async () => {
    const input = 'صموئيل الأول 1-2 (NIV, OSB)';
    const referenceGroup = {
        bookName: 'صموئيل الأول',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['NIV', 'OSB'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | multi chapter | no bible', async () => {
    const input = 'صموئيل الأول 1-2';
    const referenceGroup = {
        bookName: 'صموئيل الأول',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'MAL10RO'],
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('multi chapter with verses | multiple bibles', async () => {
    const input = '1 ശമുവേൽ 1:1-2:3 (NIV, OSB)';
    const referenceGroup = {
        bookName: '1 ശമുവേൽ',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['NIV', 'OSB'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['mal'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['mal'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('multi chapter with verses | no bible', async () => {
    const input = '1 ശമുവേൽ 1:1-2:3';
    const referenceGroup = {
        bookName: '1 ശമുവേൽ',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['engKJV', 'BSB'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['mal'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'BSB'],
        languages: ['mal'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | multi chapter with verses | multiple bibles', async () => {
    const input = 'التكوين 1:1-2:3(NIV, KJV)';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['NIV', 'KJV'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('RTL | multi chapter with verses | no bible', async () => {
    const input = 'التكوين 1:1-2:3';
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['engKJV', 'MAL10RO'],
    };
    const references = [
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
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['arb'],
    });
    expect(observedReferences).toStrictEqual(references);
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        defaultBibles: ['engKJV', 'MAL10RO'],
        languages: ['arb'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('single chapter | multiple bibles', async () => {
    const input = '1 Kings 1 (KJV, OSB)';
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['KJV', 'OSB'],
    };
    const references = [
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
    await expect(() => getBookID({
        bookName: referenceGroup.bookName,
        bibleAbbreviation: 'KJV',
        biblesCache,
        languages: ['eng'],
        useMajorityFallback: false,
    })).rejects.toThrowError();
    const bookID_pass = await getBookID({
        bookName: referenceGroup.bookName,
        bibleAbbreviation: 'KJV',
        biblesCache,
        languages: ['eng'],
    });
    expect(bookID_pass).toStrictEqual('1KI');
    const observedReferences = await splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['eng'],
    });
    expect(observedReferences).toStrictEqual(references);
    await expect(() => splitReferenceGroup({
        referenceGroup,
        biblesCache,
        languages: ['eng'],
        useMajorityFallback: false,
    })).rejects.toThrowError();
    const referenceMap = await parseReferences({
        input,
        biblesCache,
        languages: ['eng'],
    });
    expect(referenceMap[input]).toStrictEqual(references);
});
test('single chapter | multiple bibles', async () => {
    const input = '1 ശമുവേൽ 1 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'Song of Three Young Men',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('RTL | single chapter | multiple bibles', async () => {
    const input = 'التكوين 1 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('Invalid - Whole book | single bible', async () => {
    const input = 'Genesis (NIV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('Invalid - Whole book | no bibles', async () => {
    const input = 'Genesis';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('RTL | Invalid Input | multiple bibles', async () => {
    const input = 'التكوين (NIV, KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('RTL | Invalid - Whole book | single bible', async () => {
    const input = 'التكوين (KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('RTL | Invalid - Whole book | no bibles', async () => {
    const input = 'التكوين';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLXJlZmVyZW5jZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9wYXJzZXItcmVmZXJlbmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBRWpFLE9BQU8sRUFBQyxTQUFTLEVBQUUsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDM0QsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixtQkFBbUIsR0FDcEIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQztJQUN4QyxRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLGVBQWUsRUFBRSxTQUFTO0NBQzNCLENBQUMsQ0FBQztBQUNILG9CQUFvQjtBQUNwQiw0QkFBNEI7QUFDNUIsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ2hELE1BQU0sS0FBSyxHQUFHLHdCQUF3QixDQUFDO0lBQ3ZDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsS0FBSztTQUNiO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLEtBQUs7U0FDYjtLQUNGLENBQUM7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztLQUNaLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO0tBQ1osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN6QyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUM7SUFDNUIsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztLQUMzQixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxTQUFTO1lBQ25CLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsU0FBUztTQUNqQjtLQUNGLENBQUM7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztLQUNaLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO0tBQ1osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDO1FBQ3pDLEtBQUs7UUFDTCxXQUFXO1FBQ1gsYUFBYSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztLQUNsQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFHLHdCQUF3QixDQUFDO0lBRXZDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsS0FBSztTQUNiO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLEtBQUs7U0FDYjtLQUNGLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUM7UUFDekMsS0FBSztRQUNMLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywrQkFBK0IsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMvQyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUM7SUFDNUIsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztLQUM5QixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxTQUFTO1lBQ25CLEtBQUssRUFBRSxRQUFRO1NBQ2hCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLFNBQVM7U0FDakI7S0FDRixDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUM7UUFDN0IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sbUJBQW1CLENBQUM7UUFDbkQsY0FBYztRQUNkLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDO1FBQ3pDLEtBQUs7UUFDTCxXQUFXO1FBQ1gsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztRQUNwQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtJQUM5RCxNQUFNLEtBQUssR0FBRywwQkFBMEIsQ0FBQztJQUN6QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2I7S0FDRixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUM7UUFDN0IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLFdBQVc7S0FDWixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztLQUNaLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztLQUNaLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdkQsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDO0lBQzlCLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztLQUMzQixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLFNBQVM7U0FDakI7S0FDRixDQUFDO0lBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUM7UUFDN0IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLFdBQVc7S0FDWixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztLQUNaLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLGFBQWEsRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7S0FDbEMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNwRSxNQUFNLEtBQUssR0FBRywwQkFBMEIsQ0FBQztJQUN6QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2I7S0FDRixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUM7UUFDN0IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO1FBQ2pDLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sbUJBQW1CLENBQUM7UUFDbkQsY0FBYztRQUNkLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDO1FBQ3pDLEtBQUs7UUFDTCxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDN0QsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDO0lBQzlCLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztLQUM5QixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLFFBQVE7U0FDaEI7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCO0tBQ0YsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQzdCLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7UUFDcEMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDakQsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUM7SUFDdEMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsR0FBRztZQUNmLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFFBQVEsRUFBRSxTQUFTO1lBQ25CLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQzdCLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxXQUFXO0tBQ1osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sbUJBQW1CLENBQUM7UUFDbkQsY0FBYztRQUNkLFdBQVc7S0FDWixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUM7UUFDekMsS0FBSztRQUNMLFdBQVc7S0FDWixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzFDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQztJQUM1QixNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0tBQzlCLENBQUM7SUFDRixNQUFNLFVBQVUsR0FBZ0I7UUFDOUI7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLFFBQVE7U0FDaEI7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsU0FBUztTQUNqQjtLQUNGLENBQUM7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztLQUNaLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO0tBQ1osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDO1FBQ3pDLEtBQUs7UUFDTCxXQUFXO1FBQ1gsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztLQUNyQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLDZCQUE2QixDQUFDO0lBQzVDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsY0FBYztRQUN4QixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsS0FBSztTQUNiO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLEtBQUs7U0FDYjtLQUNGLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUM7UUFDekMsS0FBSztRQUNMLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNoRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztJQUNqQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0tBQzlCLENBQUM7SUFDRixNQUFNLFVBQVUsR0FBZ0I7UUFDOUI7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLFFBQVE7U0FDaEI7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsU0FBUztTQUNqQjtLQUNGLENBQUM7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUM7UUFDekMsS0FBSztRQUNMLFdBQVc7UUFDWCxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO1FBQ3BDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzdELE1BQU0sS0FBSyxHQUFHLDZCQUE2QixDQUFDO0lBQzVDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsVUFBVTtRQUNwQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLFVBQVUsR0FBZ0I7UUFDOUI7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLEtBQUs7U0FDYjtLQUNGLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQztRQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztRQUNuRCxjQUFjO1FBQ2QsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsTUFBTSxZQUFZLEdBQUcsTUFBTSxlQUFlLENBQUM7UUFDekMsS0FBSztRQUNMLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN0RCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztJQUNqQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztLQUMxQixDQUFDO0lBQ0YsTUFBTSxVQUFVLEdBQWdCO1FBQzlCO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsR0FBRztZQUNmLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsUUFBUTtTQUNoQjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsR0FBRztZQUNmLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0YsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQzdCLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7UUFDaEMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDbkUsTUFBTSxLQUFLLEdBQUcsMkJBQTJCLENBQUM7SUFDMUMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLEdBQUc7WUFDZixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsR0FBRztZQUNmLFVBQVUsRUFBRSxHQUFHO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQzdCLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzVELE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDO0lBQ2hDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO0tBQzlCLENBQUM7SUFDRixNQUFNLFVBQVUsR0FBZ0I7UUFDOUI7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxRQUFRO1NBQ2hCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCO0tBQ0YsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQzdCLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLG1CQUFtQixDQUFDO1FBQ25ELGNBQWM7UUFDZCxXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7UUFDcEMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ25CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDbEQsTUFBTSxLQUFLLEdBQUcsc0JBQXNCLENBQUM7SUFDckMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFnQjtRQUM5QjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEdBQUc7WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsR0FBRztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsU0FBUztZQUNuQixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0YsQ0FBQztJQUVGLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNoQixTQUFTLENBQUM7UUFDUixRQUFRLEVBQUUsY0FBYyxDQUFDLFFBQVE7UUFDakMsaUJBQWlCLEVBQUUsS0FBSztRQUN4QixXQUFXO1FBQ1gsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2xCLG1CQUFtQixFQUFFLEtBQUs7S0FDM0IsQ0FBQyxDQUNILENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRXpCLE1BQU0sV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDO1FBQ2xDLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUTtRQUNqQyxpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sbUJBQW1CLENBQUM7UUFDbkQsY0FBYztRQUNkLFdBQVc7UUFDWCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNoQixtQkFBbUIsQ0FBQztRQUNsQixjQUFjO1FBQ2QsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNsQixtQkFBbUIsRUFBRSxLQUFLO0tBQzNCLENBQUMsQ0FDSCxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUV6QixNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUN6QyxLQUFLO1FBQ0wsV0FBVztRQUNYLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNuQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ2xELE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsVUFBVTtRQUNwQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdEUsTUFBTSxLQUFLLEdBQUcsaUNBQWlDLENBQUM7SUFDaEQsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDM0MsTUFBTSxLQUFLLEdBQUcsMkJBQTJCLENBQUM7SUFDMUMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztLQUM5QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUNyRSxjQUFjLENBQ2YsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3hELE1BQU0sS0FBSyxHQUFHLHNCQUFzQixDQUFDO0lBQ3JDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDakQsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7SUFDL0IsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNoQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDakQsTUFBTSxLQUFLLEdBQUcsMEJBQTBCLENBQUM7SUFFekMsK0JBQStCO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzlDLE1BQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDO0lBRXBDLCtCQUErQjtJQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxRCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMxQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7SUFFOUIsK0JBQStCO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdkQsTUFBTSxLQUFLLEdBQUcsOEJBQThCLENBQUM7SUFFN0MsK0JBQStCO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3BELE1BQU0sS0FBSyxHQUFHLHlCQUF5QixDQUFDO0lBRXhDLCtCQUErQjtJQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxRCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNoRCxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQztJQUVuQywrQkFBK0I7SUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN4RCxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQztJQUVuQywrQkFBK0I7SUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNuRCw4QkFBOEIsQ0FDL0IsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3JELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQztJQUU5QiwrQkFBK0I7SUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNuRCw4QkFBOEIsQ0FDL0IsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ2xELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUV4QiwrQkFBK0I7SUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNuRCw4QkFBOEIsQ0FDL0IsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLG9CQUFvQixDQUFDO0lBRW5DLCtCQUErQjtJQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxRCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMzRCxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7SUFFOUIsK0JBQStCO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FDbkQsOEJBQThCLENBQy9CLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN4RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7SUFFeEIsK0JBQStCO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FDbkQsOEJBQThCLENBQy9CLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyJ9