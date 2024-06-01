// - - - - - - - - - -
import { fetchBibles, fetchBooksAndChapters, fetchPassage, fetchVerses, } from './fetch-bible.js';
import { expandHomeDir, sortObject, writeJsonFile } from './utils.js';
import fs from 'fs-extra';
const cacheDir = expandHomeDir(process.env.CACHE_PATH || '~/ephrem/cache');
const cleanUpOldRecords = (map, max_age_days = 14) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - max_age_days);
    const cleanedMap = new Map();
    map.forEach((value, key) => {
        if (value.cachedOn > thresholdDate) {
            cleanedMap.set(key, value);
        }
    });
    return cleanedMap;
};
const getBibleAndChapterString = (bibleAbbreviation, chapterID) => `${bibleAbbreviation}@${chapterID}`;
const chaptersToVersesCache = `${cacheDir}/chapters-to-verses.json`;
// serialize the ChaptersToVerses map to JSON
const serializeChaptersToVerses = (chaptersToVerses) => {
    const obj = Array.from(chaptersToVerses.entries()).map(([bibleAndChapter, value]) => ({
        bibleAndChapter: bibleAndChapter,
        verses: value.verses,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
const saveChaptersToVerses = async (chaptersToVerses, filePath = chaptersToVersesCache) => {
    await writeJsonFile(filePath, serializeChaptersToVerses(chaptersToVerses));
};
// deserialize JSON back to a ChaptersToVerses map
const deserializeChaptersToVerses = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAndChapter;
        const value = {
            verses: item.verses,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
const loadChaptersToVerses = async (filePath = chaptersToVersesCache, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return cleanUpOldRecords(deserializeChaptersToVerses(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
const chaptersToVerses = await loadChaptersToVerses();
const getBibleAndBookString = (bibleAbbreviation, bookID) => `${bibleAbbreviation}@${bookID}`;
const booksToChaptersCache = `${cacheDir}/books-to-chapters.json`;
// serialize the BooksToChapters map to JSON
const serializeBooksToChapters = (booksToChapters) => {
    const obj = Array.from(booksToChapters.entries()).map(([bibleAndBook, value]) => ({
        bibleAndBook: bibleAndBook,
        chapters: value.chapters,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
const saveBooksToChapters = async (booksToChapters, filePath = booksToChaptersCache) => {
    await writeJsonFile(filePath, serializeBooksToChapters(booksToChapters));
};
// deserialize JSON back to a BooksToChapters map
const deserializeBooksToChapters = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAndBook;
        const value = {
            chapters: item.chapters,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
const loadBooksToChapters = async (filePath = booksToChaptersCache, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return cleanUpOldRecords(deserializeBooksToChapters(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
const booksToChapters = await loadBooksToChapters();
const biblesToBooksCache = `${cacheDir}/bibles-to-books.json`;
// serialize the BooksToChapters map to JSON
const serializeBiblesToBooks = (biblesToBooks) => {
    const obj = Array.from(biblesToBooks.entries()).map(([bibleAbbreviation, value]) => ({
        bibleAbbreviation: bibleAbbreviation,
        books: value.books,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
const saveBiblesToBooks = async (biblesToBooks, filePath = biblesToBooksCache) => {
    await writeJsonFile(filePath, serializeBiblesToBooks(biblesToBooks));
};
// deserialize JSON back to a BooksToChapters map
const deserializeBiblesToBooks = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAbbreviation;
        const value = {
            books: item.books,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
const loadBiblesToBooks = async (filePath = biblesToBooksCache, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return cleanUpOldRecords(deserializeBiblesToBooks(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
const biblesToBooks = await loadBiblesToBooks();
const biblesCache = `${cacheDir}/bibles.json`;
// serialize the BooksToChapters map to JSON
const serializeBibles = (bibles) => {
    const obj = Array.from(bibles.entries()).map(([bibleAbbreviation, value]) => ({
        bibleAbbreviation: bibleAbbreviation,
        id: value.id,
        dblId: value.dblId,
        name: value.name,
        nameLocal: value.nameLocal,
        language: value.language,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
const saveBibles = async (bibles, filePath = biblesCache) => {
    await writeJsonFile(filePath, serializeBibles(bibles));
};
// deserialize JSON back to a BooksToChapters map
const deserializeBibles = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAbbreviation;
        const value = {
            id: item.id,
            dblId: item.dblId,
            name: item.name,
            nameLocal: item.nameLocal,
            language: item.language,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
const loadBibles = async (filePath = biblesCache, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return cleanUpOldRecords(deserializeBibles(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
const bibles = await loadBibles();
// - - - - - - - - - -
const getVerseIDs = (verseResponses) => {
    const versesIDs = [];
    for (const verseResponse of verseResponses) {
        versesIDs.push(verseResponse.id);
    }
    return { verses: versesIDs, cachedOn: new Date() };
};
// - - - - - - - - - -
const getChapterIDs = (chapterResponses) => {
    const chapters = [];
    for (const chapterResponse of chapterResponses) {
        if (chapterResponse.number === 'intro') {
            continue;
        }
        chapters.push(chapterResponse.id);
    }
    return { chapters, cachedOn: new Date() };
};
// - - - - - - - - - -
const getBookIDs = (bookResponses) => {
    const books = [];
    for (const bookResponse of bookResponses) {
        books.push(bookResponse.id);
    }
    return { books, cachedOn: new Date() };
};
// - - - - - - - - - -
const clearCache = () => {
    bibles.clear();
    biblesToBooks.clear();
    booksToChapters.clear();
    chaptersToVerses.clear();
    passages.clear();
};
// - - - - - - - - - -
async function updateBibles(languages, config) {
    for (const language of languages) {
        const bibleResponses = await fetchBibles(language, config);
        for (const bibleResponse of bibleResponses) {
            const bibleObj = {
                id: bibleResponse.id,
                dblId: bibleResponse.dblId,
                name: bibleResponse.name,
                nameLocal: bibleResponse.nameLocal,
                language: bibleResponse.language,
                cachedOn: new Date(),
            };
            bibles.set(bibleResponse.abbreviation, bibleObj);
        }
    }
}
// - - - - - - - - - -
async function updateBooksAndChapters(bibleAbbreviations, config) {
    for (const bibleAbbreviation of bibleAbbreviations) {
        const bibleID = bibles.get(bibleAbbreviation)?.id;
        if (!bibleID) {
            console.log(bibles.keys());
            throw Error;
        }
        const booksAndChaptersResponses = await fetchBooksAndChapters(bibleID, config);
        const booksInBible = getBookIDs(booksAndChaptersResponses);
        biblesToBooks.set(bibleAbbreviation, booksInBible);
        for (const bookResponse of booksAndChaptersResponses) {
            const bookID = bookResponse.id;
            const chaptersInBook = getChapterIDs(bookResponse.chapters);
            booksToChapters.set(getBibleAndBookString(bibleAbbreviation, bookID), chaptersInBook);
        }
    }
}
async function updateVerses(chaptersToFetchVerses, config) {
    for (const chapterToFetchVerses of chaptersToFetchVerses) {
        const bibleAbbreviation = chapterToFetchVerses.bibleAbbreviation;
        const bibleAndChapter = getBibleAndChapterString(bibleAbbreviation, chapterToFetchVerses.chapterID);
        console.log([...chaptersToVerses]);
        if (chaptersToVerses.get(bibleAndChapter)?.verses) {
            continue;
        }
        const bibleID = bibles.get(bibleAbbreviation)?.id;
        if (!bibleID) {
            throw Error;
        }
        if (!biblesToBooks.has(bibleAbbreviation)) {
            console.log(biblesToBooks.keys());
            throw Error;
        }
        const booksInBible = biblesToBooks.get(bibleAbbreviation);
        if (booksInBible === undefined) {
            console.log(biblesToBooks.keys());
            throw Error;
        }
        if (!booksInBible.books.includes(chapterToFetchVerses.bookID)) {
            console.log(biblesToBooks.keys());
            throw Error;
        }
        const bibleAndBook = getBibleAndBookString(bibleAbbreviation, chapterToFetchVerses.bookID);
        const chaptersInBook = booksToChapters.get(bibleAndBook);
        if (chaptersInBook === undefined) {
            console.log(`bibleAndBook: ${JSON.stringify(bibleAndBook)}`);
            console.log(`chaptersInBook: ${chaptersInBook}`);
            console.log(typeof booksToChapters);
            console.log(booksToChapters.entries());
            throw Error;
        }
        if (!chaptersInBook.chapters.includes(chapterToFetchVerses.chapterID)) {
            console.log(chaptersInBook.chapters);
            throw Error;
        }
        const versesInChapter = getVerseIDs(await fetchVerses(chapterToFetchVerses.chapterID, bibleID, config));
        console.log(`versesInChapter: ${versesInChapter}`);
        chaptersToVerses.set(bibleAndChapter, versesInChapter);
    }
    console.log([...chaptersToVerses]);
}
// - - - - - - - - - -
const getLanguageofBible = (bibleAbbreviation) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.language.id.toLowerCase();
};
// - - - - - - - - - -
const getScriptDirectionOfBible = (bibleAbbreviation) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.language.scriptDirection;
};
// - - - - - - - - - -
const getLocalNameOfBible = (bibleAbbreviation) => {
    const bible = bibles.get(bibleAbbreviation);
    if (!bible) {
        throw Error;
    }
    return bible.nameLocal;
};
// - - - - - - - - - -
const isSupportedBible = (bibleAbbreviation, languages) => {
    if (!bibles.has(bibleAbbreviation)) {
        return false;
    }
    for (const [bibleAbbreviationSupported, bibleDetails] of bibles) {
        if (bibleAbbreviation === bibleAbbreviationSupported &&
            languages.includes(bibleDetails.language.id)) {
            return true;
        }
    }
    return false;
};
// - - - - - - - - - -
const isSupportedBook = (bibleAbbreviation, bookID) => {
    const booksInBible = biblesToBooks.get(bibleAbbreviation);
    if (!booksInBible) {
        throw Error;
    }
    return booksInBible.books.includes(bookID);
};
// - - - - - - - - - -
const isSupportedChapter = (bibleAbbreviation, bookID, chapterID) => {
    const chaptersInBook = booksToChapters.get(getBibleAndBookString(bibleAbbreviation, bookID));
    if (!chaptersInBook) {
        throw Error;
    }
    return chaptersInBook.chapters.includes(chapterID);
};
// - - - - - - - - - -
const isSupportedVerse = (bibleAbbreviation, chapterID, verseID) => {
    const versesInChapter = chaptersToVerses.get(getBibleAndChapterString(bibleAbbreviation, chapterID));
    if (!versesInChapter) {
        throw Error;
    }
    return versesInChapter.verses.includes(verseID);
};
// - - - - - - - - - -
const chaptersInCorrectOrder = (bibleAbbreviation, bookID, startChapterID, endChapterID) => {
    const chaptersInBook = booksToChapters.get(getBibleAndBookString(bibleAbbreviation, bookID));
    if (!chaptersInBook) {
        throw Error;
    }
    return chaptersInBook.chapters
        .slice(chaptersInBook.chapters.indexOf(startChapterID))
        .includes(endChapterID);
};
// - - - - - - - - - -
const versesInCorrectOrder = (bibleAbbreviation, chapterID, startVerseID, endVerseID) => {
    const versesInChapter = chaptersToVerses.get(getBibleAndChapterString(bibleAbbreviation, chapterID));
    if (!versesInChapter) {
        throw Error;
    }
    return versesInChapter.verses
        .slice(versesInChapter.verses.indexOf(startVerseID))
        .includes(endVerseID);
};
const getStringForPassageQuery = (passageQuery) => {
    const sortedPassageQuery = sortObject(passageQuery);
    return JSON.stringify(sortedPassageQuery);
};
const passagesCache = `${cacheDir}/passages.json`;
const serializePassages = (map) => {
    const arr = Array.from(map.entries()).map(([key, value]) => ({
        passageQuery: key,
        passage: value,
    }));
    return JSON.stringify(arr, null, 2);
};
const savePassages = async (passages, filePath = passagesCache) => {
    await writeJsonFile(filePath, serializePassages(passages));
};
// - - - - - - - - - -
const deserializePassages = (json) => {
    const arr = JSON.parse(json);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.passageQuery;
        const value = {
            text: item.passage.text,
            fums: item.passage.fums,
            cachedOn: new Date(item.passage.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
// - - - - - - - - - -
const loadPassages = async (filePath = passagesCache, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return cleanUpOldRecords(deserializePassages(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
// - - - - - - - - - -
const passages = await loadPassages();
// - - - - - - - - - -
const updatePassage = async (passageID, bibleAbbreviation, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, config) => {
    const passageQuery = {
        passageID,
        bibleAbbreviation,
        contentType,
        includeNotes,
        includeTitles,
        includeChapterNumbers,
        includeVerseNumbers,
        includeVerseSpans,
    };
    const passageQueryString = getStringForPassageQuery(passageQuery);
    if (passages.get(passageQueryString)?.text) {
        return;
    }
    const bibleID = bibles.get(passageQuery.bibleAbbreviation)?.id;
    if (!bibleID) {
        throw Error;
    }
    const passageAndFums = await fetchPassage(passageID, bibleID, contentType, includeNotes, includeTitles, includeChapterNumbers, includeVerseNumbers, includeVerseSpans, config);
    const passage = {
        reference: passageAndFums.data.reference,
        content: passageAndFums.data.content,
        copyright: passageAndFums.data.copyright,
    };
    const fums = passageAndFums.meta.fums;
    const cachedOn = new Date();
    const passageText = { text: passage, fums: fums, cachedOn: cachedOn };
    passages.set(passageQueryString, passageText);
};
// - - - - - - - - - -
const getPassage = async (passageID, bibleAbbreviation, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, config) => {
    const passageQuery = {
        passageID,
        bibleAbbreviation,
        contentType,
        includeNotes,
        includeTitles,
        includeChapterNumbers,
        includeVerseNumbers,
        includeVerseSpans,
    };
    const passageQueryString = getStringForPassageQuery(passageQuery);
    if (passages.get(passageQueryString) === undefined) {
        await updatePassage(passageID, bibleAbbreviation, contentType, includeNotes, includeTitles, includeChapterNumbers, includeVerseNumbers, includeVerseSpans, config);
    }
    const passage = passages.get(passageQueryString);
    if (passage === undefined) {
        throw Error;
    }
    return passage;
};
// - - - - - - - - - -
const saveCache = async () => {
    if (booksToChapters.size > 0) {
        try {
            await saveBooksToChapters(booksToChapters, booksToChaptersCache);
        }
        catch (error) {
            console.error('Error saving booksToChapters to cache', error);
        }
    }
    if (bibles.size > 0) {
        try {
            await saveBibles(bibles, biblesCache);
        }
        catch (error) {
            console.error('Error saving bibles to cache', error);
        }
    }
    if (passages.size > 0) {
        try {
            await savePassages(passages, passagesCache);
        }
        catch (error) {
            console.error('Error saving passages to cache', error);
        }
    }
    if (biblesToBooks.size > 0) {
        try {
            await saveBiblesToBooks(biblesToBooks, biblesToBooksCache);
        }
        catch (error) {
            console.error('Error saving biblesToBooks to cache', error);
        }
    }
    if (chaptersToVerses.size > 0) {
        try {
            await saveChaptersToVerses(chaptersToVerses, chaptersToVersesCache);
        }
        catch (error) {
            console.error('Error saving chaptersToVerses to cache', error);
        }
    }
};
// - - - - - - - - - -
await updateBibles(['ENG', 'mal']);
await updateBooksAndChapters(['BSB']);
console.log(booksToChapters.keys());
console.log(booksToChapters.get(getBibleAndBookString('BSB', 'GEN')));
await updateVerses([
    { bibleAbbreviation: 'BSB', bookID: 'GEN', chapterID: 'GEN.1' },
]);
await getPassage('DAN.1.2', 'BSB', 'text', false, false, false, false, false);
console.log([...passages]);
saveCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlibGUtbGlicmFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUN0QixPQUFPLEVBSUwsV0FBVyxFQUNYLHFCQUFxQixFQUNyQixZQUFZLEVBQ1osV0FBVyxHQUlaLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUxQixNQUFNLFFBQVEsR0FBVyxhQUFhLENBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGdCQUFnQixDQUMzQyxDQUFDO0FBT0YsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixHQUFjLEVBQ2QsWUFBWSxHQUFHLEVBQUUsRUFDTixFQUFFO0lBQ2IsTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNqQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQztJQUU5RCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBUSxDQUFDO0lBRW5DLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDekIsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLGFBQWEsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUtGLE1BQU0sd0JBQXdCLEdBQUcsQ0FDL0IsaUJBQXlCLEVBQ3pCLFNBQWlCLEVBQ2pCLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixJQUFJLFNBQVMsRUFBRSxD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