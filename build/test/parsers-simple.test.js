import { expect, test } from 'vitest';
import { parseReferenceGroup } from '../src/parsers/simple.js';
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
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
test('RTL | single chapter | single bible', () => {
    const input = 'صموئيل الأول 1';
    const referenceGroup = {
        bookName: 'صموئيل الأول',
        chapterStart: '1',
        chapterEnd: undefined,
        verseStart: undefined,
        verseEnd: undefined,
        bibles: undefined,
    };
    expect(parseReferenceGroup(input)).toStrictEqual(referenceGroup);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2Vycy1zaW1wbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvcGFyc2Vycy1zaW1wbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNwQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUc3RCxvQkFBb0I7QUFDcEIsNEJBQTRCO0FBQzVCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFDMUMsTUFBTSxLQUFLLEdBQUcsd0JBQXdCLENBQUM7SUFDdkMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxNQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQztJQUNsQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDaEIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQzVCLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELE1BQU0sS0FBSyxHQUFHLHdCQUF3QixDQUFDO0lBQ3ZDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUM7SUFDbEMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQztJQUM1QixNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtJQUN4RCxNQUFNLEtBQUssR0FBRywwQkFBMEIsQ0FBQztJQUN6QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7SUFDckQsTUFBTSxLQUFLLEdBQUcscUJBQXFCLENBQUM7SUFDcEMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDaEIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7SUFDakQsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDO0lBQzlCLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLFNBQVM7S0FDbEIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7SUFDOUQsTUFBTSxLQUFLLEdBQUcsMEJBQTBCLENBQUM7SUFDekMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO0lBQzNELE1BQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDO0lBQ3BDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQztJQUM5QixNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLEdBQUc7UUFDZixRQUFRLEVBQUUsR0FBRztRQUNiLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO0lBQzNDLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDdkIsQ0FBQztJQUNGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFDakMsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQztJQUM1QixNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNqRCxNQUFNLEtBQUssR0FBRyw2QkFBNkIsQ0FBQztJQUM1QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQ3ZCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO0lBQzlDLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO0lBQ3RDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsY0FBYztRQUN4QixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNoQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztJQUNqQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUN2RCxNQUFNLEtBQUssR0FBRyw2QkFBNkIsQ0FBQztJQUM1QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO0lBQ2pDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsVUFBVTtRQUNwQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtJQUM3RCxNQUFNLEtBQUssR0FBRywyQkFBMkIsQ0FBQztJQUMxQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtJQUMxRCxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLEdBQUc7UUFDZixVQUFVLEVBQUUsR0FBRztRQUNmLFFBQVEsRUFBRSxHQUFHO1FBQ2IsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDO0lBQ2hDLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsR0FBRztRQUNmLFVBQVUsRUFBRSxHQUFHO1FBQ2YsUUFBUSxFQUFFLEdBQUc7UUFDYixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtJQUM1QyxNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztJQUNyQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtJQUM1QyxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQztJQUNuQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFlBQVk7UUFDdEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO0lBQ2hFLE1BQU0sS0FBSyxHQUFHLGlDQUFpQyxDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUseUJBQXlCO1FBQ25DLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRSxTQUFTO1FBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNoQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUNyQyxNQUFNLEtBQUssR0FBRywyQkFBMkIsQ0FBQztJQUMxQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztJQUNyQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUN2QixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtJQUMvQyxNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztJQUNyQyxNQUFNLGNBQWMsR0FBbUI7UUFDckMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ2hCLENBQUM7SUFDRixNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO0lBQy9DLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDO0lBQy9CLE1BQU0sY0FBYyxHQUFtQjtRQUNyQyxRQUFRLEVBQUUsY0FBYztRQUN4QixZQUFZLEVBQUUsR0FBRztRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0lBQ0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQyxDQUFDIn0=