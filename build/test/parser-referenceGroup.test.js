import { expect, test } from 'vitest';
import { parseReferenceGroup } from '../src/reference/simple-parser.js';
// - - - - - - - - -
// Test get Reference Groups
test('single verse | multiple bibles', () => {
    const input = 'Genesis 1:1 (NIV, KJV)';
    const referenceGroup = {
        bookName: 'Genesis',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['NIV', 'KJV'],
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});
test('single verse | lower case book name | multiple bibles', () => {
    const input = 'genesis 1:1 (NIV, KJV)';
    const referenceGroup = {
        bookName: 'genesis',
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'Genesis',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('RTL | single verse | multiple bibles', () => {
    const input = 'التكوين 1:1 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('single chapter multi verse | multiple bibles', () => {
    const input = 'Genesis 1:1-2 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'Genesis',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('RTL | single chapter multi verse | multiple bibles', () => {
    const input = 'التكوين 1:1-2 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: '1',
        verseEnd: '2',
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('multi chapter | multiple bibles', () => {
    const input = '1 Kings 1-2(NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: '1 Kings',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('RTL | multi chapter | multiple bibles', () => {
    const input = 'صموئيل الأول 1-2 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'صموئيل الأول',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('multi chapter with verses | multiple bibles', () => {
    const input = '1 ശമുവേൽ 1:1-2:3 (NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: '1 ശമുവേൽ',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('RTL | multi chapter with verses | multiple bibles', () => {
    const input = 'التكوين 1:1-2:3(NIV, KJV)';
    const referenceGroup = {
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
    const referenceGroup = {
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
    const referenceGroup = {
        bookName: 'التكوين',
        chapterStart: '1',
        chapterEnd: '2',
        verseStart: '1',
        verseEnd: '3',
        bibles: ['engKJV', 'MAL10RO'],
    };
    expect(parseReferenceGroup(input, ['engKJV', 'MAL10RO'])).toStrictEqual(referenceGroup);
});
test('single chapter | multiple bibles', () => {
    const input = '1 Kings 1 (NIV, KJV)';
    const referenceGroup = {
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
test('single chapter | single bible', () => {
    const input = 'Revelation 1 (NIV)';
    const referenceGroup = {
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
test('single chapter | no bible', () => {
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
test('RTL | single chapter | multiple bibles', () => {
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
test('RTL | single chapter | single bible', () => {
    const input = 'صموئيل الأول 1 (NIV)';
    const referenceGroup = {
        bookName: 'صموئيل الأول',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: undefined,
        verseEnd: undefined,
        bibles: ['NIV'],
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});
test('RTL | single chapter | no bible', () => {
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
test('Invalid Input | multiple bibles', () => {
    const input = 'Genesis 1-2:3 (NIV, KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('Invalid Input | single bible', () => {
    const input = 'Genesis 1-2:3 (NIV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('Invalid Input | no bible', () => {
    const input = 'Genesis 1-2:3';
    // Test the exact error message
    expect(() => parseReferenceGroup(input, ['KJV'])).toThrowError();
});
test('RTL | Invalid Input | multiple bibles', () => {
    const input = 'صموئيل الأول 1-2:3(NIV, KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('RTL | Invalid Input | single bible', () => {
    const input = 'صموئيل الأول 1-2:3(KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('RTL | Invalid Input | no bible', () => {
    const input = 'صموئيل الأول 1-2:3';
    // Test the exact error message
    expect(() => parseReferenceGroup(input, ['KJV'])).toThrowError();
});
test('Invalid - Whole book | Multiple Bibles', () => {
    const input = 'Genesis (NIV, KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('Invalid - Whole book | single bible', () => {
    const input = 'Genesis (NIV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('Invalid - Whole book | no bibles', () => {
    const input = 'Genesis';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('RTL | Invalid Input | multiple bibles', () => {
    const input = 'التكوين (NIV, KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError();
});
test('RTL | Invalid - Whole book | single bible', () => {
    const input = 'التكوين (KJV)';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
test('RTL | Invalid - Whole book | no bibles', () => {
    const input = 'التكوين';
    // Test the exact error message
    expect(() => parseReferenceGroup(input)).toThrowError(/Invalid format for Reference/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLXJlZmVyZW5jZUdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3BhcnNlci1yZWZlcmVuY2VHcm91cC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBR3RFLG9CQUFvQjtBQUNwQiw0QkFBNEI7QUFDNUIsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxNQUFNLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztJQUN2QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO0lBQ2pFLE1BQU0sS0FBSyxHQUFHLHdCQUF3QixDQUFDO0lBQ3ZDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxD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