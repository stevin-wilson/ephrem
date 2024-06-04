import { cleanUpOldRecords, defaultCacheDir, removePeriod, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { fetchBooksAndChapters } from './api-bible.js';
import { updateBibles } from './bibles.js';
import { getBibleAndBookString, getBookIDs, getChapterIDs, } from './books-chapters.js';
import { books } from '../books.js';
// - - - - - - - - - -
//  BookNames -> Book
const getBookNamesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/book-names.json`;
};
// serialize the BookNames map to JSON
const serializeBookNames = (bookNames) => {
    const obj = Array.from(bookNames.entries()).map(([bookName, book]) => ({
        name: bookName,
        id: book.id,
        isAbbreviation: book.isAbbreviation,
        scriptDirection: book.scriptDirection,
        cachedOn: book.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveBookNames = async (bookNames, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBookNamesCachePath(cacheDir), serializeBookNames(bookNames));
};
// deserialize JSON back to a ChaptersToVerses map
const deserializeBookNames = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.name;
        const value = {
            id: item.id,
            isAbbreviation: item.isAbbreviation,
            scriptDirection: item.scriptDirection,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
export const loadBookNames = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBookNamesCachePath(cacheDir), 'utf-8');
        return cleanUpOldRecords(deserializeBookNames(jsonData), max_age_days);
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
export const getBookNames = (bookResponses) => {
    const bookNames = [];
    const allowedBooks = Object.keys(books);
    const datetime = new Date();
    for (const bookResponse of bookResponses) {
        const bookID = bookResponse.id;
        console.log(bookID);
        if (!allowedBooks.includes(bookID)) {
            continue;
        }
        const newNames = [
            {
                name: removePeriod(bookResponse.name).toLowerCase(),
                isAbbreviation: false,
                id: bookID,
                cachedOn: datetime,
            },
            {
                name: removePeriod(bookResponse.nameLong).toLowerCase(),
                isAbbreviation: false,
                id: bookID,
                cachedOn: datetime,
            },
            // {
            //   name: bookResponse.abbreviation,
            //   isAbbreviation: true,
            //   id: bookID,
            //   cachedOn: datetime,
            // },
        ];
        for (let i = 0; i < newNames.length; i++) {
            if (newNames[i].id === newNames[i].name) {
                continue;
            }
            bookNames.push(newNames[i]);
        }
    }
    console.log(bookNames);
    return bookNames;
};
export const updateBiblesBooksAndChapters = async (languages, bookNames, biblesToBooks, booksToChapters, bibles, updateBiblesFromAPI = false, config = {}) => {
    if (updateBiblesFromAPI) {
        await updateBibles(languages, bibles, config);
    }
    for (const [bibleAbbreviation, bible] of bibles.entries()) {
        if (!languages.includes(bible.language.id)) {
            continue;
        }
        if (biblesToBooks.get(bibleAbbreviation) !== undefined) {
            continue;
        }
        const bibleID = bible.id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5L2Jvb2stbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsWUFBWSxFQUNaLGFBQWEsR0FDZCxNQUFNLGFBQWEsQ0FBQztBQWFyQixPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLFVBQVUsRUFDVixhQUFhLEdBQ2QsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRWxDLHNCQUFzQjtBQUN0QixxQkFBcUI7QUFDckIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFdBQW1CLGVBQWUsRUFBRSxFQUFFO0lBQ25FLE9BQU8sR0FBRyxRQUFRLGtCQUFrQixDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQUVGLHNDQUFzQztBQUN0QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBb0IsRUFBVSxFQUFFO0lBQzFELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckUsSUFBSSxFQUFFLFFBQVE7UUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDWCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7UUFDbkMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1FBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtLQUN0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