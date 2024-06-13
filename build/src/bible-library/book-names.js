import { defaultCacheDir, removePeriod, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
import { books } from '../books.js';
import { fetchBooks } from './api-bible.js';
// - - - - - - - - - -
//  BookNames -> Book
const getBookNamesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/book-names.json`;
};
// - - - - - - - - - -
// serialize the BookNames map to JSON
export const saveBookNames = async (bookNames, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBookNamesCachePath(cacheDir), JSON.stringify(bookNames, null, 2));
};
// - - - - - - - - - -
// deserialize JSON back to a BookNames
const cleanBookNamesCache = (bookNames, maxAgeDays = 14, currentTimestamp) => {
    let thresholdDate = currentTimestamp;
    if (thresholdDate === undefined) {
        thresholdDate = new Date();
    }
    thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
    const cleanedBookNames = {};
    for (const [bookName, bookNameReferences] of Object.entries(bookNames)) {
        const updatedBookNameReferences = bookNameReferences.filter(bookNameReference => bookNameReference.cachedOn > thresholdDate);
        if (updatedBookNameReferences.length === 0) {
            continue;
        }
        cleanedBookNames[bookName] = updatedBookNameReferences;
    }
    return cleanedBookNames;
};
export const loadBookNames = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getBookNamesCachePath(cacheDir), 'utf-8');
        const bookNames = JSON.parse(jsonData);
        if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
            return cleanBookNamesCache(bookNames, maxAgeDays, currentTimestamp);
        }
        else {
            return bookNames;
        }
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return {};
    }
};
// - - - - - - - - - -
export const getBookNames = (bookResponses) => {
    const bookNames = [];
    const allowedBooks = Object.keys(books);
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
            },
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
const bookNameDetailsMatchReference = (bookIdWithLanguage, bookNameReference) => {
    let output = true;
    if (bookIdWithLanguage.id !== bookNameReference.id) {
        output = false;
    }
    if (bookIdWithLanguage.language !== bookNameReference.language) {
        output = false;
    }
    if (bookIdWithLanguage.scriptDirection !== bookNameReference.scriptDirection) {
        output = false;
    }
    if (bookIdWithLanguage.isAbbreviation !== bookNameReference.isAbbreviation) {
        output = false;
    }
    return output;
};
export const updateBookNames = async (languages, cache, config = {}, timestamp) => {
    if (timestamp === undefined) {
        timestamp = new Date();
    }
    for (const [bibleAbbreviation, bible] of Object.entries(cache.bibles)) {
        if (!languages.includes(bible.language)) {
            continue;
        }
        const bookResponses = await fetchBooks(bible.id, config);
        const bookNamesFromBible = getBookNames(bookResponses);
        for (const bookNameDetails of bookNamesFromBible) {
            const bookReferences = cache.bookNames[bookNameDetails.name];
            if (bookReferences === undefined || bookReferences.length === 0) {
                cache.bookNames[bookNameDetails.name] = [
                    {
                        id: bookNameDetails.id,
                        isAbbreviation: bookNameDetails.isAbbreviation,
                        language: bible.language,
                        scriptDirection: bible.scriptDirection,
                        bibles: [bibleAbbreviation],
                        cachedOn: timestamp,
                    },
                ];
            }
            else {
                const thisBookIdWithLanguage = {
                    id: bookNameDetails.id,
                    language: bible.language,
                    scriptDirection: bible.scriptDirection,
                    isAbbreviation: bookNameDetails.isAbbreviation,
                };
                let addedToBookNames = false;
                for (const bookReference of bookReferences) {
                    if (bookReference.bibles.includes(bibleAbbreviation)) {
                        addedToBookNames = true;
                        break;
                    }
                    if (bookNameDetailsMatchReference(thisBookIdWithLanguage, bookReference)) {
                        bookReference.bibles.push(bibleAbbreviation);
                        addedToBookNames = true;
                        break;
                    }
                }
                if (!addedToBookNames) {
                    bookReferences.push({
                        ...thisBookIdWithLanguage,
                        bibles: [bibleAbbreviation],
                        cachedOn: timestamp,
                    });
                }
                cache.bookNames[bookNameDetails.name] = bookReferences;
            }
        }
    }
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5L2Jvb2stbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBU3pFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxQixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRWxDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxXQUFtQixlQUFlLEVBQUUsRUFBRTtJQUNuRSxPQUFPLEdBQUcsUUFBUSxrQkFBa0IsQ0FBQztBQUN2QyxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsc0NBQXNDO0FBQ3RDLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQ2hDLFNBQW9CLEVBQ3BCLFdBQW1CLGVBQWUsRUFDbEMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQixxQkFBcUIsQ0FBQyxRQUFRLENBQUMsRUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNuQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLHVDQUF1QztBQUN2QyxNQUFNLG1CQUFtQixHQUFHLENBQzFCLFNBQW9CLEVBQ3BCLFVBQVUsR0FBRyxFQUFFLEVBQ2YsZ0JBQXVCLEVBQ1osRUFBRTtJQUNiLElBQUksYUFBYSxHQUFHLGdCQUFnQixDQUFDO0lBQ3JDLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLGFBQWEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDRCxhQUFhLENBQUMsT0FBTyxDQUFDLGFB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