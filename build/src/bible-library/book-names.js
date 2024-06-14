import { dateReviver, defaultCacheDir, getThresholdDate, removePeriod, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { books } from '../books.js';
import { fetchBooks } from './api-bible.js';
// - - - - - - - - - -
//  BookNames -> Book
/**
 * Retrieves the path to the cache file for storing book names.
 * @param [cacheDir] - The directory where the cache file is stored. Defaults to the default cache directory.
 * @returns - The full path to the cache file for storing book names.
 */
const getBookNamesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/book-names.json`;
};
// - - - - - - - - - -
// serialize the BookNames map to JSON
/**
 * Saves the book names to a cache file.
 * @param bookNames - The book names to be saved.
 * @param [cacheDir] - The directory where the cache file will be saved. Defaults to the default cache directory.
 * @returns - Resolves with no value on successful saving of the book names.
 */
export const saveBookNames = async (bookNames, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBookNamesCachePath(cacheDir), JSON.stringify(bookNames, null, 2));
};
// - - - - - - - - - -
// deserialize JSON back to a BookNames
/**
 * Removes expired book name references from the cache.
 * @param bookNames - The cache of book names and their references.
 * @param [maxAgeDays] - The maximum age of references to keep in days.
 * @param [currentTimestamp] - The current timestamp to calculate the threshold date.
 * @returns - The cleaned cache of book names without expired references.
 */
const cleanBookNamesCache = (bookNames, maxAgeDays = 14, currentTimestamp) => {
    const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);
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
/**
 * Loads the book names from the cache directory.
 * @param [cacheDir] - The cache directory path.
 * @param [maxAgeDays] - The maximum age of the cache in days. If provided,
 *    the cache will be cleaned before returning the book names.
 * @param [currentTimestamp] - The current timestamp to compare against
 *    the cache age. If not provided, the current date and time will be used.
 * @returns - A promise that resolves to the loaded book names.
 * @throws {Error} - If there is an error reading or parsing the JSON file.
 */
export const loadBookNames = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getBookNamesCachePath(cacheDir), 'utf-8');
        const bookNames = JSON.parse(jsonData, dateReviver);
        return typeof maxAgeDays === 'number' && maxAgeDays >= 0
            ? cleanBookNamesCache(bookNames, maxAgeDays, currentTimestamp)
            : bookNames;
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
/**
 * Retrieves an array of book names, based on the provided book responses.
 * @param bookResponses - An array of book responses.
 * @returns - An array of book name details.
 */
export const getBookNames = (bookResponses) => {
    const bookDetailsArray = [];
    const allowedBooks = Object.keys(books);
    for (const bookResponse of bookResponses) {
        const bookID = bookResponse.id;
        console.log(bookID);
        if (!allowedBooks.includes(bookID)) {
            continue;
        }
        const bookDetail = {
            name: removePeriod(bookResponse.name).toLowerCase(),
            isAbbreviation: false,
            id: bookID,
        };
        if (bookDetail.id !== bookDetail.name) {
            bookDetailsArray.push(bookDetail);
        }
    }
    console.log(bookDetailsArray);
    return bookDetailsArray;
};
/**
 * Checks if the book details in the given bookIdWithLanguage match the details in the bookNameReference.
 * @param bookIdWithLanguage - The book ID and language details.
 * @param bookNameReference - The book name reference details.
 * @returns - Returns true if the book details match, false otherwise.
 */
const bookNameDetailsMatchReference = (bookIdWithLanguage, bookNameReference) => {
    return (bookIdWithLanguage.id === bookNameReference.id &&
        bookIdWithLanguage.language === bookNameReference.language &&
        bookIdWithLanguage.scriptDirection === bookNameReference.scriptDirection &&
        bookIdWithLanguage.isAbbreviation === bookNameReference.isAbbreviation);
};
/**
 * Updates the book names in the cache based on the provided languages.
 * @param languages - The list of ISO 639-3 three digit language codes to update the book names for.
 * @param cache - The cache object.
 * @param [config] - The Axios request configuration.
 * @param [timestamp] - The timestamp for the cache update.
 * @returns - A Promise that resolves once the book names are updated in the cache.
 */
export const updateBookNames = async (languages, cache, config = {}, timestamp = new Date()) => {
    const handleBookReferences = async (bibleAbbreviation, bible, bookNamesFromBible) => {
        for (const bookNameDetails of bookNamesFromBible) {
            let bookReferences = cache.bookNames[bookNameDetails.name];
            const thisBookIdWithLanguage = {
                id: bookNameDetails.id,
                language: bible.language,
                scriptDirection: bible.scriptDirection,
                isAbbreviation: bookNameDetails.isAbbreviation,
            };
            if (bookReferences === undefined || bookReferences.length === 0) {
                bookReferences = [
                    {
                        ...thisBookIdWithLanguage,
                        bibles: [bibleAbbreviation],
                        cachedOn: timestamp,
                    },
                ];
            }
            else {
                const matched = bookReferences.some(bookReference => {
                    const referenceMatches = bookNameDetailsMatchReference(thisBookIdWithLanguage, bookReference);
                    if (referenceMatches ||
                        bookReference.bibles.includes(bibleAbbreviation)) {
                        if (referenceMatches)
                            bookReference.bibles.push(bibleAbbreviation);
                        return true;
                    }
                    // If no condition matches, return false
                    return false;
                });
                if (!matched) {
                    bookReferences.push({
                        ...thisBookIdWithLanguage,
                        bibles: [bibleAbbreviation],
                        cachedOn: timestamp,
                    });
                }
            }
            cache.bookNames[bookNameDetails.name] = bookReferences;
        }
    };
    // Create an array of promises to be resolved concurrently
    const updatePromises = Object.entries(cache.bibles)
        .filter(([, bible]) => languages.includes(bible.language))
        .map(async ([bibleAbbreviation, bible]) => {
        const bookResponses = await fetchBooks(bible.id, config);
        const bookNamesFromBible = getBookNames(bookResponses);
        await handleBookReferences(bibleAbbreviation, bible, bookNamesFromBible);
    });
    await Promise.all(updatePromises);
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vay1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iaWJsZS1saWJyYXJ5L2Jvb2stbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFdBQVcsRUFDWCxlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixhQUFhLEdBQ2QsTUFBTSxhQUFhLENBQUM7QUFVckIsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFbEMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTFDLHNCQUFzQjtBQUN0QixxQkFBcUI7QUFDckI7Ozs7R0FJRztBQUNILE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxXQUFtQixlQUFlLEVBQUUsRUFBRTtJQUNuRSxPQUFPLEdBQUcsUUFBUSxrQkFBa0IsQ0FBQztBQUN2QyxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsc0NBQXNDO0FBQ3RDOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEtBQUssRUFDaEMsU0FBb0IsRUFDcEIsV0FBbUIsZUFBZSxFQUNsQyxFQUFFO0lBQ0YsTUFBTSxhQUFhLENBQ2pCLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxFQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ25DLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsdUNBQXVDO0FBQ3ZDOzs7Ozs7R0FNRztBQUNILE1BQU0sbUJBQW1CLEdBQUcsQ0FDMUIsU0FBb0IsRUFDcEIsVUFBVSxHQUFHLEVBQUUsRUFDZixnQkFBdUIsRUFDWixFQUFFO0lBQ2IsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFFckUsTUFBTSxnQkFBZ0Is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