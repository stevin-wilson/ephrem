// - - - - - - - - - -
// Bibles and Chapter -> Verses
import { cleanUpOldRecords, defaultCacheDir, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
import { getBibleAndBookString } from './books-chapters.js';
import { fetchVerses } from './api-bible.js';
export const getBibleAndChapterString = (bibleAbbreviation, chapterID) => `${bibleAbbreviation}@${chapterID}`;
const getChaptersToVersesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/chapters-to-verses.json`;
};
// serialize the ChaptersToVerses map to JSON
const serializeChaptersToVerses = (chaptersToVerses) => {
    const obj = Array.from(chaptersToVerses.entries()).map(([bibleAndChapter, value]) => ({
        bibleAndChapter: bibleAndChapter,
        verses: value.verses,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveChaptersToVerses = async (chaptersToVerses, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getChaptersToVersesCachePath(cacheDir), serializeChaptersToVerses(chaptersToVerses));
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
export const loadChaptersToVerses = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getChaptersToVersesCachePath(cacheDir), 'utf-8');
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
// - - - - - - - - - -
const getVerseIDs = (verseResponses) => {
    const versesIDs = [];
    for (const verseResponse of verseResponses) {
        versesIDs.push(verseResponse.id);
    }
    return { verses: versesIDs, cachedOn: new Date() };
};
// - - - - - - - - - -
export const updateVerses = async (chaptersToFetchVerses, chaptersToVerses, bibles, biblesToBooks, booksToChapters, config = {}) => {
    for (const chapterToFetchVerses of chaptersToFetchVerses) {
        const bibleAbbreviation = chapterToFetchVerses.bibleAbbreviation;
        const bibleAndChapter = getBibleAndChapterString(bibleAbbreviation, chapterToFetchVerses.chapterID);
        if (chaptersToVerses.get(bibleAndChapter)?.verses) {
            continue;
        }
        const bibleID = bibles.get(bibleAbbreviation)?.id;
        if (!bibleID) {
            throw Error;
        }
        if (!biblesToBooks.has(bibleAbbreviation)) {
            throw Error;
        }
        const booksInBible = biblesToBooks.get(bibleAbbreviation);
        if (booksInBible === undefined) {
            throw Error;
        }
        if (!booksInBible.books.includes(chapterToFetchVerses.bookID)) {
            throw Error;
        }
        const bibleAndBook = getBibleAndBookString(bibleAbbreviation, chapterToFetchVerses.bookID);
        const chaptersInBook = booksToChapters.get(bibleAndBook);
        if (chaptersInBook === undefined) {
            throw Error;
        }
        if (!chaptersInBook.chapters.includes(chapterToFetchVerses.chapterID)) {
            throw Error;
        }
        const versesInChapter = getVerseIDs(await fetchVerses(chapterToFetchVerses.chapterID, bibleID, config));
        chaptersToVerses.set(bibleAndChapter, versesInChapter);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvdmVyc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNCQUFzQjtBQUN0QiwrQkFBK0I7QUFFL0IsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFlOUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTFCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxDQUN0QyxpQkFBeUIsRUFDekIsU0FBaUIsRUFDakIsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLElBQUksU0FBUyxFQUFFLENBQUM7QUFFekMsTUFBTSw0QkFBNEIsR0FBRyxDQUFDLFdBQW1CLGVBQWUsRUFBRSxFQUFFO0lBQzFFLE9BQU8sR0FBRyxRQUFRLDBCQUEwQixDQUFDO0FBQy9DLENBQUMsQ0FBQztBQUVGLDZDQUE2QztBQUM3QyxNQUFNLHlCQUF5QixHQUFHLENBQ2hDLGdCQUFrQyxFQUMxQixFQUFFO0lBQ1YsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDcEQsQ0FBQyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QixlQUFlLEVBQUUsZUFBZTtRQUNoQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07UUFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO0tBQ3ZDLENBQUMsQ0FDSCxDQUFDO0lBQ0YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxD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