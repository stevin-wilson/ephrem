// - - - - - - - - - -
import { fetchBibles, fetchBooksAndChapters, fetchVerses, } from './fetch-bible.js';
// - - - - - - - - - -
const getVerseIDs = (verseResponses) => {
    const versesIDs = [];
    for (const verseResponse of verseResponses) {
        versesIDs.push(verseResponse.id);
    }
    return versesIDs;
};
const getBooksAndChapters = (booksAndChaptersResponses) => {
    const books = new Map();
    for (const bookResponse of booksAndChaptersResponses) {
        const bookID = bookResponse.id;
        const bookChapters = new Map();
        for (const chapter of bookResponse.chapters) {
            if (chapter.number === 'intro') {
                continue;
            }
            const chapterID = chapter.id;
            bookChapters.set(chapterID, undefined);
        }
        const bookObj = {
            chapters: bookChapters,
            cachedOn: new Date(),
        };
        books.set(bookID, bookObj);
    }
    return books;
};
const getBibles = (bibleResponses) => {
    const bibleLibrary = new Map();
    for (const bibleResponse of bibleResponses) {
        const bibleObj = {
            id: bibleResponse.id,
            dblId: bibleResponse.dblId,
            name: bibleResponse.name,
            nameLocal: bibleResponse.nameLocal,
            language: bibleResponse.language,
            cachedOn: new Date(),
        };
        bibleLibrary.set(bibleResponse.abbreviation, bibleObj);
    }
    return bibleLibrary;
};
async function buildBibleLibrary(languages, config) {
    let bibleLibrary = new Map();
    for (const language of languages) {
        const biblesInLanguage = await fetchBibles(language, config);
        const bibleLibraryInLang = getBibles(biblesInLanguage);
        bibleLibrary = new Map([
            ...bibleLibrary.entries(),
            ...bibleLibraryInLang.entries(),
        ]);
    }
    return bibleLibrary;
}
async function addBooksAndChapters(bibleLibrary, bibleAbbreviations, config) {
    for (const abbreviation of bibleAbbreviations) {
        const bibleID = bibleLibrary.get(abbreviation)?.id;
        console.log(`bibleID: ${bibleID}`);
        if (bibleID === undefined) {
            throw Error;
        }
        const booksAndChapters = await fetchBooksAndChapters(bibleID, config);
        bibleLibrary.get(abbreviation).books =
            getBooksAndChapters(booksAndChapters);
    }
}
async function addVerses(bibleLibrary, chapters, config) {
    for (const chapter of chapters) {
        console.log(chapter.bible);
        const bible = bibleLibrary.get(chapter.bible);
        if (bible === undefined) {
            throw Error;
        }
        const book = bible.books?.get(chapter.book);
        if (book === undefined) {
            throw Error;
        }
        const verseResponses = await fetchVerses(chapter.chapter, bible.id, config);
        const verseIDs = getVerseIDs(verseResponses);
        console.log(bibleLibrary.get(chapter.bible).books.get(chapter.book).chapters);
        console.log(bibleLibrary
            .get(chapter.bible)
            .books.get(chapter.book)
            .chapters.get(chapter.chapter));
        const chapterAndVerses = {
            verses: verseIDs,
            cachedOn: new Date(),
        };
        bibleLibrary
            .get(chapter.bible)
            .books.get(chapter.book)
            .chapters.set(chapter.chapter, chapterAndVerses);
    }
}
const bibleLibrary = await buildBibleLibrary(['eng', 'mal']);
await addBooksAndChapters(bibleLibrary, ['MAL10RO']);
await addVerses(bibleLibrary, [
    {
        bible: 'MAL10RO',
        book: 'GEN',
        chapter: 'GEN.1',
    },
]);
console.log(bibleLibrary.get('MAL10RO')?.books?.get('GEN')?.chapters.get('GEN.1'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlibGUtbGlicmFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUN0QixPQUFPLEVBR0wsV0FBVyxFQUNYLHFCQUFxQixFQUNyQixXQUFXLEdBR1osTUFBTSxrQkFBa0IsQ0FBQztBQW9DMUIsc0JBQXNCO0FBQ3RCLE1BQU0sV0FBVyxHQUFHLENBQUMsY0FBK0IsRUFBVyxFQUFFO0lBQy9ELE1BQU0sU0FBUyxHQUFZLEVBQUUsQ0FBQztJQUU5QixLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUM7QUFFRixNQUFNLG1CQUFtQixHQUFHLENBQzFCLHlCQUF5QyxFQUNsQyxFQUFFO0lBQ1QsTUFBTSxLQUFLLEdBQVUsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUUvQixLQUFLLE1BQU0sWUFBWSxJQUFJLHlCQUF5QixFQUFFLENBQUM7UUFDckQsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQztRQUMvQixNQUFNLFlBQVksR0FBYSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLEtBQUssTUFBTSxPQUFPLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzVDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUUsQ0FBQztnQkFDL0IsU0FBUztZQUNYLENBQUM7WUFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzdCLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxNQUFNLE9BQU8sR0FBUztZQUNwQixRQUFRLEVBQUUsWUFBWTtZQUN0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