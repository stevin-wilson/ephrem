import { expect, test } from 'vitest';
import { parseReferences } from '../src/reference/simple-parser.js';
import { loadBiblesCache } from '../src/cache/cache-use-bibles.js';
import { hasValidReferenceInformation, isMultiChapterReference, isSingleChapterMultipleVersesReference, isSingleVerseReference, isValidStringOrUndefined, } from '../src/reference/reference-utils.js';
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
    expect(await parseReferences({ input, biblesCache })).toStrictEqual(expectedOutput);
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
    expect(await parseReferences({ input, biblesCache })).toStrictEqual(expectedOutput);
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
    const reference = {
        book: 'JHN',
        chapterStart: '-1',
        verseStart: '1',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('chapterStart is float', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '15.5',
        verseStart: '16',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('chapterEnd <= 0', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        chapterEnd: '-1',
        verseStart: '16',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('chapterEnd is float', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        chapterEnd: '156.1',
        verseStart: '16',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('only verseEnd is specified ', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        verseStart: undefined,
        verseEnd: '16',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('verseStart <= 0', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        verseStart: '0',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('verseStart is float', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        verseStart: '177.2',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('verseEnd <= 0', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        verseStart: '1',
        verseEnd: '0',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('verseEnd is float', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        verseStart: '1',
        verseEnd: '-177',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('verseStart specified and multi chapter', () => {
    const reference = {
        book: 'JHN',
        chapterStart: '3',
        chapterEnd: '4',
        verseStart: '2',
        bible: 'KJV',
    };
    expect(hasValidReferenceInformation(reference)).toBe(false);
});
test('multi chapter', () => {
    const reference = {
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
    const reference = {
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
    const reference = {
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
    const reference = {
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
    const reference = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3JlZmVyZW5jZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qix1QkFBdUIsRUFDdkIsc0NBQXNDLEVBQ3RDLHNCQUFzQixFQUN0Qix3QkFBd0IsR0FDekIsTUFBTSxxQ0FBcUMsQ0FBQztBQUc3QyxNQUFNLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQztJQUN4QyxRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLGVBQWUsRUFBRSxTQUFTO0NBQzNCLENBQUMsQ0FBQztBQUVILG9CQUFvQjtBQUNwQiw0QkFBNEI7QUFDNUIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLGdEQUFnRCxDQUFDO0lBRS9ELE1BQU0sY0FBYyxHQUFHO1FBQ3JCLHdCQUF3QixFQUFFO1lBQ3hCO2dCQUNFLElBQUksRUFBRSxLQUFLO2dCQUNYLFlBQVksRUFBRSxHQUFHO2dCQUNqQixVQUFVLEVBQUUsU0FBUztnQkFDckIsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsS0FBSztnQkFDWCxZQUFZLEVBQUUsR0FBRztnQkFDakIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLFVBQVUsRUFBRSxHQUFHO2dCQUNmLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0Y7UUFDRCx3QkFBd0IsRUFBRTtZQUN4Qjtn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