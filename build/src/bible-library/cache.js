import { loadBibles, saveBibles, updateBibles } from './bibles.js';
import { getBookNames, loadBookNames, saveBookNames } from './book-names.js';
import { getBibleAndBookString, getBookIDs, getChapterIDs, loadBiblesToBooks, loadBooksToChapters, saveBiblesToBooks, saveBooksToChapters, } from './books-chapters.js';
import { defaultCacheDir } from '../utils.js';
import { getBibleAndChapterString, loadChaptersToVerses, saveChaptersToVerses, updateVerses, } from './verses.js';
import { getStringForPassageQuery, loadPassages, savePassages, updatePassage, } from './passages.js';
import { fetchBooksAndChapters } from './api-bible.js';
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
export const prepareCacheForReferenceSearch = async (languages, bookNames, biblesToBooks, booksToChapters, bibles, updateBiblesFromAPI = false, skipIfLessThanNDays = 14, config = {}) => {
    const languagesToUpdate = [];
    const latestUpdate = new Map();
    languages.forEach(language => latestUpdate.set(language, new Date(2000, 0, 0, 0, 0, 0, 0)));
    for (const bookNameDetails of bookNames.values()) {
        if (!languages.includes(bookNameDetails.language)) {
            continue;
        }
        if (bookNameDetails.cachedOn > latestUpdate.get(bookNameDetails.language)) {
            latestUpdate.set(bookNameDetails.language, bookNameDetails.cachedOn);
        }
    }
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - skipIfLessThanNDays);
    for (const [language, languageLatestUpdate] of latestUpdate) {
        if (languageLatestUpdate < thresholdDate) {
            languagesToUpdate.push(language);
        }
    }
    if (updateBiblesFromAPI || languagesToUpdate.length !== 0) {
        await updateBibles(languagesToUpdate, bibles, config);
        for (const [bibleAbbreviation, bible] of bibles.entries()) {
            if (!languagesToUpdate.includes(bible.language.id)) {
                continue;
            }
            if (biblesToBooks.get(bibleAbbreviation) !== undefined) {
                continue;
            }
            const bibleID = bible.id;
            const language = bible.language.id;
            const scriptDirection = bible.language.scriptDirection;
            const booksAndChaptersResponses = await fetchBooksAndChapters(bibleID, config);
            const booksInBible = getBookIDs(booksAndChaptersResponses);
            biblesToBooks.set(bibleAbbreviation, booksInBible);
            const bookNameDetailsArr = getBookNames(booksAndChaptersResponses);
            console.log(bookNameDetailsArr);
            for (const bookNameDetails of bookNameDetailsArr) {
                const bookName = bookNameDetails.name;
                const bookNameDetailsWithDirection = {
                    id: bookNameDetails.id,
                    isAbbreviation: bookNameDetails.isAbbreviation,
                    language: language,
                    scriptDirection: scriptDirection,
                    cachedOn: bookNameDetails.cachedOn,
                };
                bookNames.set(bookName, bookNameDetailsWithDirection);
            }
            for (const bookResponse of booksAndChaptersResponses) {
                const bookID = bookResponse.id;
                const chaptersInBook = getChapterIDs(bookResponse.chapters);
                booksToChapters.set(getBibleAndBookString(bibleAbbreviation, bookID), chaptersInBook);
            }
        }
    }
};
// - - - - - - - - - -
export const updateBooksAndChapters = async (bibleAbbreviations, bookNames, biblesToBooks, booksToChapters, bibles, config = {}) => {
    for (const bibleAbbreviation of bibleAbbreviations) {
        const bible = bibles.get(bibleAbbreviation);
        if (bible === undefined) {
            throw Error;
        }
        const bibleID = bible.id;
        const language = bible.language.id;
        const scriptDirection = bible.language.scriptDirection;
        const booksAndChaptersResponses = await fetchBooksAndChapters(bibleID, config);
        const booksInBible = getBookIDs(booksAndChaptersResponses);
        biblesToBooks.set(bibleAbbreviation, booksInBible);
        const bookNameDetailsArr = getBookNames(booksAndChaptersResponses);
        console.log(bookNameDetailsArr);
        for (const bookNameDetails of bookNameDetailsArr) {
            const bookName = bookNameDetails.name;
            const bookNameDetailsWithDirection = {
                id: bookNameDetails.id,
                isAbbreviation: bookNameDetails.isAbbreviation,
                language: language,
                scriptDirection: scriptDirection,
                cachedOn: bookNameDetails.cachedOn,
            };
            bookNames.set(bookName, bookNameDetailsWithDirection);
        }
        for (const bookResponse of booksAndChaptersResponses) {
            const bookID = bookResponse.id;
            const chaptersInBook = getChapterIDs(bookResponse.chapters);
            booksToChapters.set(getBibleAndBookString(bibleAbbreviation, bookID), chaptersInBook);
        }
    }
};
// - - - - - - - - - -
const prepareCacheForValidation = async (references, cache, config = {}) => {
    const biblesToCheck = Array.from(new Set(references.map(ref => ref.bible)));
    const missingBibles = [];
    biblesToCheck.forEach(bibleAbbreviation => {
        if (cache.bibles.get(bibleAbbreviation) === undefined) {
            missingBibles.push(bibleAbbreviation);
        }
    });
    if (missingBibles.length !== 0) {
        await updateBooksAndChapters(missingBibles, cache.bookNames, cache.biblesToBooks, cache.booksToChapters, cache.bibles, config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFzQkEsT0FBTyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzNFLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsVUFBVSxFQUNWLGFBQWEsRUFDYixpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFDTCx3QkFBd0IsRUFDeEIsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNwQixZQUFZLEdBQ2IsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLHdCQUF3QixFQUN4QixZQUFZLEVBQ1osWUFBWSxFQUNaLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyRCxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFDNUIsV0FBbUIsZUFBZSxFQUNsQyxVQUFVLEdBQUcsRUFBRSxFQUNDLEVBQUU7SUFDbEIsTUFBTSxNQUFNLEdBQVcsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFjLE1BQU0sYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RSxNQUFNLGFBQWEsR0FBa0IsTUFBTSxpQkFBaUIsQ0FDMUQsUUFBUSxFQUNSLFVBQVUsQ0FDWCxDQUFDO0lBQ0YsTUFBTSxlQUFl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