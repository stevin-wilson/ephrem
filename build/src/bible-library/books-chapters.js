import { cleanUpOldRecords, defaultCacheDir, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
// - - - - - - - - - -
//  Bible Abbreviation -> Book Names
const getBiblesToBooksCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/bibles-to-books.json`;
};
// serialize the BooksToChapters map to JSON
const serializeBiblesToBooks = (biblesToBooks) => {
    const obj = Array.from(biblesToBooks.entries()).map(([bibleAbbreviation, value]) => ({
        bibleAbbreviation: bibleAbbreviation,
        books: value.books,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveBiblesToBooks = async (biblesToBooks, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBiblesToBooksCachePath(cacheDir), serializeBiblesToBooks(biblesToBooks));
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
export const loadBiblesToBooks = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBiblesToBooksCachePath(cacheDir), 'utf-8');
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
// - - - - - - - - - -
// Bibles and Books -> Chapter
export const getBibleAndBookString = (bibleAbbreviation, bookID) => `${bibleAbbreviation}@${bookID}`;
const getBooksToChaptersCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/books-to-chapters.json`;
};
// serialize the BooksToChapters map to JSON
const serializeBooksToChapters = (booksToChapters) => {
    const obj = Array.from(booksToChapters.entries()).map(([bibleAndBook, value]) => ({
        bibleAndBook: bibleAndBook,
        chapters: value.chapters,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveBooksToChapters = async (booksToChapters, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBooksToChaptersCachePath(cacheDir), serializeBooksToChapters(booksToChapters));
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
export const loadBooksToChapters = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBooksToChaptersCachePath(cacheDir), 'utf-8');
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
// - - - - - - - - - -
export const getBookIDs = (bookResponses) => {
    const books = [];
    for (const bookResponse of bookResponses) {
        books.push(bookResponse.id);
    }
    return { books, cachedOn: new Date() };
};
// - - - - - - - - - -
export const getChapterIDs = (chapterResponses) => {
    const chapters = [];
    for (const chapterResponse of chapterResponses) {
        if (chapterResponse.number === 'intro') {
            continue;
        }
        chapters.push(chapterResponse.id);
    }
    return { chapters, cachedOn: new Date() };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va3MtY2hhcHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9ib29rcy1jaGFwdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQWE5RSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUIsc0JBQXNCO0FBQ3RCLG9DQUFvQztBQUNwQyxNQUFNLHlCQUF5QixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDdkUsT0FBTyxHQUFHLFFBQVEsdUJBQXVCLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsNENBQTRDO0FBQzVDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxhQUE0QixFQUFVLEVBQUU7SUFDdEUsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQ2pELENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQixpQkFBaUIsRUFBRSxpQkFBaUI7UUFDcEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtLQUN2QyxDQUFDLENBQ0gsQ0FBQztJQUNGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFDcEMsYUFBNEIsRUFDNUIsV0FBbUIsZUFBZSxFQUNsQyxFQUFFO0lBQ0YsTUFBTSxhQUFhLENBQ2pCLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxFQUNuQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FD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