import { loadBibles, saveBibles } from './bibles.js';
import { loadBookNames, saveBookNames, updateBiblesBooksAndChapters, } from './book-names.js';
import { getBibleAndBookString, loadBiblesToBooks, loadBooksToChapters, saveBiblesToBooks, saveBooksToChapters, } from './books-chapters.js';
import { defaultCacheDir } from '../utils.js';
import { getBibleAndChapterString, loadChaptersToVerses, saveChaptersToVerses, updateVerses, } from './verses.js';
import { getStringForPassageQuery, loadPassages, savePassages, updatePassage, } from './passages.js';
// - - - - - - - - - -
export const loadCache = async (cacheDir = defaultCacheDir, maxAgeDays = 14) => {
    const bibles = await loadBibles(cacheDir, maxAgeDays);
    const bookNames = await loadBookNames(cacheDir, maxAgeDays);
    const biblesToBooks = await loadBiblesToBooks(cacheDir, maxAgeDays);
    const booksToChapters = await loadBooksToChapters(cacheDir, maxAgeDays);
    const chaptersToVerses = await loadChaptersToVerses(cacheDir, maxAgeDays);
    const passages = await loadPassages(cacheDir, maxAgeDays);
    return {
        bibles,
        bookNames,
        biblesToBooks,
        booksToChapters,
        chaptersToVerses,
        passages,
    };
};
// - - - - - - - - - -
export const saveCache = async (cache, cacheDir = defaultCacheDir) => {
    if (cache.bibles.size > 0) {
        try {
            await saveBibles(cache.bibles, cacheDir);
        }
        catch (error) {
            console.error('Error saving bibles to cache', error);
        }
    }
    console.log([...cache.bookNames.entries()]);
    if (cache.bookNames.size > 0) {
        try {
            await saveBookNames(cache.bookNames, cacheDir);
        }
        catch (error) {
            console.error('Error saving bookNames to cache', error);
        }
    }
    if (cache.biblesToBooks.size > 0) {
        try {
            await saveBiblesToBooks(cache.biblesToBooks, cacheDir);
        }
        catch (error) {
            console.error('Error saving biblesToBooks to cache', error);
        }
    }
    if (cache.booksToChapters.size > 0) {
        try {
            await saveBooksToChapters(cache.booksToChapters, cacheDir);
        }
        catch (error) {
            console.error('Error saving booksToChapters to cache', error);
        }
    }
    if (cache.chaptersToVerses.size > 0) {
        try {
            await saveChaptersToVerses(cache.chaptersToVerses, cacheDir);
        }
        catch (error) {
            console.error('Error saving chaptersToVerses to cache', error);
        }
    }
    if (cache.passages.size > 0) {
        try {
            await savePassages(cache.passages, cacheDir);
        }
        catch (error) {
            console.error('Error saving passages to cache', error);
        }
    }
};
// - - - - - - - - - -
const clearCache = (cache) => {
    cache.bibles.clear();
    cache.biblesToBooks.clear();
    cache.booksToChapters.clear();
    cache.chaptersToVerses.clear();
    cache.passages.clear();
};
// - - - - - - - - - -
const getLanguageofBible = (bibleAbbreviation, bibles) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.language.id.toLowerCase();
};
// - - - - - - - - - -
const getScriptDirectionOfBible = (bibleAbbreviation, bibles) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.language.scriptDirection;
};
// - - - - - - - - - -
const getLocalNameOfBible = (bibleAbbreviation, bibles) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.nameLocal;
};
// - - - - - - - - - -
const isSupportedBook = (bibleAbbreviation, bookID, biblesToBooks) => {
    const booksInBible = biblesToBooks.get(bibleAbbreviation);
    if (!booksInBible) {
        throw Error;
    }
    return booksInBible.books.includes(bookID);
};
// - - - - - - - - - -
const isSupportedChapter = (bibleAbbreviation, bookID, chapterID, booksToChapters) => {
    const chaptersInBook = booksToChapters.get(getBibleAndBookString(bibleAbbreviation, bookID));
    if (!chaptersInBook) {
        throw Error;
    }
    return chaptersInBook.chapters.includes(chapterID);
};
// - - - - - - - - - -
const isSupportedVerse = (bibleAbbreviation, chapterID, verseID, chaptersToVerses) => {
    const versesInChapter = chaptersToVerses.get(getBibleAndChapterString(bibleAbbreviation, chapterID));
    if (!versesInChapter) {
        throw Error;
    }
    return versesInChapter.verses.includes(verseID);
};
// - - - - - - - - - -
const chaptersInCorrectOrder = (bibleAbbreviation, bookID, startChapterID, endChapterID, booksToChapters) => {
    const chaptersInBook = booksToChapters.get(getBibleAndBookString(bibleAbbreviation, bookID));
    if (!chaptersInBook) {
        throw Error;
    }
    return chaptersInBook.chapters
        .slice(chaptersInBook.chapters.indexOf(startChapterID))
        .includes(endChapterID);
};
// - - - - - - - - - -
const versesInCorrectOrder = (bibleAbbreviation, chapterID, startVerseID, endVerseID, chaptersToVerses) => {
    const versesInChapter = chaptersToVerses.get(getBibleAndChapterString(bibleAbbreviation, chapterID));
    if (!versesInChapter) {
        throw Error;
    }
    return versesInChapter.verses
        .slice(versesInChapter.verses.indexOf(startVerseID))
        .includes(endVerseID);
};
// - - - - - - - - - -
const getPassage = async (passageID, bibleAbbreviation, passages, bibles, passageOptions = {}, config) => {
    const passageQuery = {
        passageID,
        bibleAbbreviation,
        ...passageOptions,
    };
    const passageQueryString = getStringForPassageQuery(passageQuery);
    if (passages.get(passageQueryString) === undefined) {
        await updatePassage(passageID, bibleAbbreviation, passages, bibles, passageOptions, config);
    }
    const passage = passages.get(passageQueryString);
    if (passage === undefined) {
        throw Error;
    }
    return passage;
};
// - - - - - - - - - -
const cache = await loadCache();
await updateBiblesBooksAndChapters(['eng', 'mal'], cache.bookNames, cache.biblesToBooks, cache.booksToChapters, cache.bibles);
console.log({ ...cache.bookNames.entries() });
await saveCache(cache);
// - - - - - - - - - -
const prepareCache = async (references, languages, cache, config = {}) => {
    const biblesToCheck = Array.from(new Set(references.map(ref => ref.bible)));
    const missingBibles = [];
    biblesToCheck.forEach(bibleAbbreviation => {
        if (cache.bibles.get(bibleAbbreviation) === undefined) {
            missingBibles.push(bibleAbbreviation);
        }
    });
    if (missingBibles.length !== 0) {
        await updateBiblesBooksAndChapters(languages, cache.bookNames, cache.biblesToBooks, cache.booksToChapters, cache.bibles, true, config);
    }
    const chaptersToFetchVerses = [];
    for (const reference of references) {
        if (reference.verseStart !== undefined) {
            chaptersToFetchVerses.push({
                bibleAbbreviation: reference.bible,
                bookID: reference.book,
                chapterID: reference.chapterStart,
            });
        }
        if (reference.verseEnd !== undefined &&
            reference.chapterEnd !== undefined) {
            chaptersToFetchVerses.push({
                bibleAbbreviation: reference.bible,
                bookID: reference.book,
                chapterID: reference.chapterEnd,
            });
        }
        else if (reference.verseEnd !== undefined) {
            chaptersToFetchVerses.push({
                bibleAbbreviation: reference.bible,
                bookID: reference.book,
                chapterID: reference.chapterStart,
            });
        }
    }
    updateVerses(chaptersToFetchVerses, cache.chaptersToVerses, cache.bibles, cache.biblesToBooks, cache.booksToChapters, config);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpQkEsT0FBTyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQWUsTUFBTSxhQUFhLENBQUM7QUFDakUsT0FBTyxFQUNMLGFBQWEsRUFDYixhQUFhLEVBQ2IsNEJBQTRCLEdBQzdCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFDTCx3QkFBd0IsRUFDeEIsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNwQixZQUFZLEdBQ2IsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLHdCQUF3QixFQUN4QixZQUFZLEVBQ1osWUFBWSxFQUNaLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFDNUIsV0FBbUIsZUFBZSxFQUNsQyxVQUFVLEdBQUcsRUFBRSxFQUNDLEVBQUU7SUFDbEIsTUFBTSxNQUFNLEdBQVcsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFjLE1BQU0sYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RSxNQUFNLGFBQWEsR0FBa0IsTUFBTSxpQkFBaUIsQ0FDMUQsUUFBUSxFQUNSLFVBQVUsQ0FDWCxDQUFDO0lBQ0YsTUFBTSxlQUFlLEdBQW9CLE1BQU0sbUJBQW1CLENBQ2hFLFFBQVEsRUFDUixVQUFVLENBQ1gsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQXFC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