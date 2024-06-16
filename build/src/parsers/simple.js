// Examples:
//
//
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     bibles: undefined,
//   }
//
//
// Case 2
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1-2 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1-2 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1-2
// defaultBibles: [MAL10B]
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [MAL10B],
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1-2 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1-2 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1-2
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     verseStart: 1,
//     verseEnd: 2,
//     bibles: undefined,
//   }
//
// Case 3
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1-2 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1-2 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1-2
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1-2 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1-2 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1-2
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2
//     bibles: undefined,
//   }
//
// Case 4
//
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1:1-2:3 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1:1-2:3 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1:1-2:3
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1:1-2:3 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1:1-2:3 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1:1-2:3
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     chapterEnd: 2,
//     verseStart: 1,
//     verseEnd: 3,
//     bibles: undefined,
//   }
//
// Case 5
// Left-to-Right languages (LTR)
//
// Input
// Genesis 1 (NIV, KJV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// Genesis 1 (NIV)
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// Genesis 1
// Output
// {
//     bookName: Genesis,
//     chapterStart: 1,
//     bibles: undefined,
//   }
//
// Right-to-Left languages (RTL)
//
// Input
// التكوين 1 (NIV, KJV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: [NIV, KJV],
//   }
//
// Input
// التكوين 1 (NIV)
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: [NIV],
//   }
//
// Input
// التكوين 1
// Output
// {
//     bookName: التكوين,
//     chapterStart: 1,
//     bibles: undefined,
//   }
//
// Invalid Format
// Genesis 1-2:3 (NIV, KJV)
// Genesis 1-2:3 (NIV)
// Genesis 1-2:3
//
// Genesis (NIV, KJV)
// Genesis (NIV)
// Genesis
//  */
const extractTranslationsAndBookChapterVerse = (input) => {
    const translations = input.match(/\(([^)]+)\)/)?.[1];
    const bookChapterVerse = translations
        ? input.replace(`(${translations})`, '')
        : input;
    return { translations, bookChapterVerse };
};
const splitChapterAndVerse = (chapterVerse) => {
    const chapterVerseParts = chapterVerse
        .split('-')
        .map(trimPart => trimPart.trim());
    let chapterStart, chapterEnd, verseStart, verseEnd;
    if (chapterVerseParts[0]?.includes(':')) {
        [chapterStart, verseStart] = chapterVerseParts[0].split(':');
        if (chapterVerseParts[1]) {
            chapterEnd = chapterVerseParts[1].includes(':')
                ? chapterVerseParts[1].split(':')[0]
                : undefined;
            verseEnd = chapterVerseParts[1].includes(':')
                ? chapterVerseParts[1].split(':')[1]
                : chapterVerseParts[1];
        }
    }
    else {
        [chapterStart, chapterEnd] = chapterVerseParts;
    }
    return { chapterStart, chapterEnd, verseStart, verseEnd };
};
export const parseReferenceGroup = (input) => {
    const { translations, bookChapterVerse } = extractTranslationsAndBookChapterVerse(input);
    // eslint-disable-next-line prefer-const
    let [bookName, chapterVerse] = bookChapterVerse.split(/\s+(?=\d)/);
    if (!bookName || !chapterVerse)
        throw new Error(`Invalid format for Reference: ${input}`);
    bookName = bookName.trim();
    const { chapterStart, chapterEnd, verseStart, verseEnd } = splitChapterAndVerse(chapterVerse);
    const bibles = translations?.split(',').map(bible => bible.trim());
    return {
        bookName,
        chapterStart,
        chapterEnd,
        verseStart,
        verseEnd,
        bibles,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhcnNlcnMvc2ltcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLFlBQVk7QUFDWixFQUFFO0FBQ0YsRUFBRTtBQUNGLGdDQUFnQztBQUNoQyxFQUFFO0FBQ0YsUUFBUTtBQUNSLHlCQUF5QjtBQUN6QixTQUFTO0FBQ1QsSUFBSTtBQUNKLHlCQUF5QjtBQUN6Qix1QkFBdUI7QUFDdkIscUJBQXFCO0FBQ3JCLDBCQUEwQjtBQUMxQixNQUFNO0FBQ04sRUFBRTtBQUNGLFFBQVE7QUFDUixvQkFBb0I7QUFDcEIsU0FBUztBQUNULElBQUk7QUFDSix5QkFBeUI7QUFDekIsdUJBQXVCO0FBQ3ZCLHFCQUFxQjtBQUNyQixxQkFBcUI7QUFDckIsTUFBTTtBQUNOLEVBQUU7QUFDRixRQUFRO0FBQ1IsY0FBYztBQUNkLFNBQVM7QUFDVCxJQUFJO0FBQ0oseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QixxQkFBcUI7QUFDckIseUJBQXlCO0FBQ3pCLE1BQU07QUFDTixFQUFFO0FBQ0YsZ0NBQWdDO0FBQ2hDLEVBQUU7QUFDRixRQUFRO0FBQ1IseUJBQXlCO0FBQ3pCLFNBQVM7QUFDVCxJQUFJO0FBQ0oseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QixxQkFBcUI7QUFDckIsMEJBQTBCO0FBQzFCLE1BQU07QUFDTixFQUFFO0FBQ0YsUUFBUTtBQUNSLG9CQUFvQjtBQUNwQixTQUFTO0FBQ1QsSUFBSTtBQUNKLHlCQUF5QjtBQUN6Qix1QkFBdUI7QUFDdkIscUJBQXFCO0FBQ3JCLHFCQUFxQjtBQUNyQixNQUFNO0FBQ04sRUFBRTtBQUNGLFFBQVE7QUFDUixjQUFjO0FBQ2QsU0FBUztBQUNULElBQUk7QUFDSix5QkFBeUI7QUFDekIsdUJBQXVCO0FBQ3ZCLHFCQUFxQjtBQUNyQix5QkFBeUI7QUFDekIsTUFBTTtBQUNOLEVBQUU7QUFDRixFQUFFO0FBQ0YsU0FBUztBQUNU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