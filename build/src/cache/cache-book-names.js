import { dateReviver, getThresholdDate, normalizeBookName, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { BOOK_IDs } from '../reference/book-ids.js';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
const getBookNamesCachePath = (cacheDir = getDefaultCacheDir()) => {
    return `${cacheDir}/book-names.json`;
};
export const saveBookNames = async (bookNames, cacheDir = getDefaultCacheDir()) => {
    await writeJsonFile(getBookNamesCachePath(cacheDir), JSON.stringify(bookNames, null, 2));
};
export const cleanBookNamesCache = (bookNames, currentTimestamp, maxCacheAgeDays = getDefaultMaxCacheAgeDays()) => {
    if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
        return [bookNames, false];
    }
    const thresholdDate = getThresholdDate(maxCacheAgeDays, currentTimestamp);
    const cleanedBookNames = {};
    let removedRecords = false;
    for (const [bookName, bookNameReferences] of Object.entries(bookNames)) {
        const updatedBookNameReferences = bookNameReferences.filter(bookNameReference => bookNameReference.cachedOn > thresholdDate);
        if (updatedBookNameReferences.length === 0) {
            removedRecords = true;
            continue;
        }
        cleanedBookNames[bookName] = updatedBookNameReferences;
    }
    return [cleanedBookNames, removedRecords];
};
export const loadBookNames = async (cacheDir = getDefaultCacheDir()) => {
    try {
        const jsonData = await fs.readFile(getBookNamesCachePath(cacheDir), 'utf-8');
        return JSON.parse(jsonData, dateReviver);
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
export const prepareBookNames = (bookResponses) => {
    const bookDetailsArray = [];
    const allowedBooks = Object.keys(BOOK_IDs);
    for (const bookResponse of bookResponses) {
        const bookID = bookResponse.id;
        if (!allowedBooks.includes(bookID)) {
            continue;
        }
        const bookDetail = {
            name: normalizeBookName(bookResponse.name),
            isAbbreviation: false,
            id: bookID,
        };
        if (bookDetail.id !== bookDetail.name) {
            bookDetailsArray.push(bookDetail);
        }
    }
    return bookDetailsArray;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtYm9vay1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYWNoZS9jYWNoZS1ib29rLW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixhQUFhLEdBQ2QsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVsRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUvRSxNQUFNLHFCQUFxQixHQUFHLENBQUMsV0FBbUIsa0JBQWtCLEVBQUUsRUFBRSxFQUFFO0lBQ3hFLE9BQU8sR0FBRyxRQUFRLGtCQUFrQixDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQ2hDLFNBQW9CLEVBQ3BCLFdBQW1CLGtCQUFrQixFQUFFLEVBQ3ZDLEVBQUU7SUFDRixNQUFNLGFBQWEsQ0FDakIscUJBQXFCLENBQUMsUUFBUSxDQUFDLEVBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDbkMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLENBQ2pDLFNBQW9CLEVBQ3BCLGdCQUF1QixFQUN2QixlQUFlLEdBQUcseUJBQXlCLEVBQUUsRUFDdkIsRUFBRTtJQUN4QixJQUFJLENBQUMsZUFBZSxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdC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