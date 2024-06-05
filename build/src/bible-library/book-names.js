import { cleanUpOldRecords, defaultCacheDir, removePeriod, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
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
        language: book.language,
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
            language: item.language,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5L2Jvb2stbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsWUFBWSxFQUNaLGFBQWEsR0FDZCxNQUFNLGFBQWEsQ0FBQztBQWFyQixPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFTMUIsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsQyxzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxXQUFtQixlQUFlLEVBQUUsRUFBRTtJQUNuRSxPQUFPLEdBQUcsUUFBUSxrQkFBa0IsQ0FBQztBQUN2QyxDQUFDLENBQUM7QUFFRixzQ0FBc0M7QUFDdEMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQVUsRUFBRTtJQUMxRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksRUFBRSxRQUFRO1FBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ1gsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1FBQ25DLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtRQUN2QixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7UUFDckMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO0tBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sYUFB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