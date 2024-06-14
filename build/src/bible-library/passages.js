import { dateReviver, defaultCacheDir, getThresholdDate, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { fetchPassage } from './api-bible.js';
/**
 * Returns the path to the cache file for passages.
 * @param [cacheDir] - The directory to store the cache file.
 * @returns - The path to the cache file for passages.
 */
const getPassagesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/passages.json`;
};
// - - - - - - - - - -
/**
 * Saves passages to a cache directory.
 * @param passages - The passages to be saved.
 * @param [cacheDir] - The directory where the passages will be saved. If not specified, the default cache directory will be used.
 * @returns - A Promise that resolves once the passages are saved.
 */
export const savePassages = async (passages, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getPassagesCachePath(cacheDir), JSON.stringify(passages, null, 2));
};
// - - - - - - - - - -
/**
 * Cleans the passages cache by removing passages that are older than a given threshold date.
 * @param passages - The passages cache to be cleaned.
 * @param [maxAgeDays] - The maximum age in days of the passages to keep. Passages older than this will be removed.
 * @param [currentTimestamp] - The current timestamp. If provided, it will be used instead of the system's current date and time.
 * @returns - The cleaned passages cache.
 */
const cleanPassagesCache = (passages, maxAgeDays = 14, currentTimestamp) => {
    const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);
    const cleanedPassages = {};
    for (const [passageAndBible, Passages] of Object.entries(passages)) {
        const filteredPassages = Passages.filter(passage => passage.cachedOn > thresholdDate);
        if (filteredPassages.length > 0) {
            cleanedPassages[passageAndBible] = filteredPassages;
        }
    }
    return cleanedPassages;
};
/**
 * Asynchronously loads passages from cache.
 * @param cacheDir - The directory where the cache file is located. Defaults to `defaultCacheDir`.
 * @param [maxAgeDays] - The maximum age (in days) of the passages to consider valid. If not provided, all passages will be returned.
 * @param [currentTimestamp] - The current timestamp used for calculating passage age. If not provided, the current date and time will be used.
 * @returns - A Promise that resolves to the loaded passages.
 */
export const loadPassages = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
        const passages = JSON.parse(jsonData, dateReviver);
        return typeof maxAgeDays === 'number' && maxAgeDays >= 0
            ? cleanPassagesCache(passages, maxAgeDays, currentTimestamp)
            : passages;
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
 * Get a string representation of a passage ID and a Bible abbreviation.
 * @param passageID - The ID of the passage to concatenate.
 * @param bibleAbbreviation - The abbreviation of the Bible to concatenate.
 * @returns - The concatenated string.
 */
const getPassageAndBible = (passageID, bibleAbbreviation) => `${passageID}@${bibleAbbreviation}`;
// - - - - - - - - - -
export const passageQueriesAreEqual = (query1, query2) => {
    return (query1.passageID === query2.passageID &&
        query1.bibleID === query2.bibleID &&
        query1.contentType === query2.contentType &&
        query1.includeNotes === query2.includeNotes &&
        query1.includeTitles === query2.includeTitles &&
        query1.includeChapterNumbers === query2.includeChapterNumbers &&
        query1.includeVerseNumbers === query2.includeVerseNumbers &&
        query1.includeVerseSpans === query2.includeVerseSpans);
};
// - - - - - - - - - -
/**
 * Retrieves a Bible passage.
 * @param passageID - The ID of the passage.
 * @param bibleID - The ID of the Bible.
 * @param [passageOptions] - The options for the passage.
 * @param [config] - The configuration options for the request.
 * @param [timestamp] - The timestamp of when the passage was retrieved.
 * @returns - A Promise that resolves with the retrieved passage.
 */
const getPassage = async (passageID, bibleID, passageOptions = {}, config = {}, timestamp = new Date()) => {
    const passageAndFums = await fetchPassage(passageID, bibleID, passageOptions, config);
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    return {
        query: passageQuery,
        ...passageAndFums.data,
        fums: passageAndFums.meta.fums,
        cachedOn: timestamp,
    };
};
// - - - - - - - - - -
/**
 * Adds a new passage to the existing list of passages.
 * @param passages - The existing list of passages.
 * @param passageID - The ID of the passage to add.
 * @param bibleID - The ID of the Bible associated with the passage.
 * @param passageOptions - The options to be applied to the passage.
 * @param config - The configuration for the HTTP request.
 * @param timestamp - The timestamp to use for the passage.
 * @param cache - The cache object.
 * @param passageAndBible - The unique key to identify the passage in the cache.
 * @returns - A promise that resolves when the passage is added successfully.
 */
const addToPassage = async (passages, passageID, bibleID, passageOptions, config, timestamp, cache, passageAndBible) => {
    const newPassage = await getPassage(passageID, bibleID, passageOptions, config, timestamp);
    passages.push(newPassage);
    cache.passages[passageAndBible] = passages;
};
/**
 * Updates the passage in the cache with the given passageID and bibleAbbreviation.
 * @param passageID - The unique identifier of the passage.
 * @param bibleAbbreviation - The abbreviation of the bible.
 * @param cache - The cache object that holds the passages and bibles.
 * @param [passageOptions] - The options to include in the passage query.
 * @param [config] - The config object for the Axios request.
 * @param [timestamp] - The timestamp of the update.
 * @throws {Error} if the bibleID cannot be found in the cache.
 * @returns - A Promise that resolves when the passage is updated in the cache.
 */
export const updatePassage = async (passageID, bibleAbbreviation, cache, passageOptions = {}, config = {}, timestamp = new Date()) => {
    const bibleID = cache.bibles[bibleAbbreviation]?.id;
    if (!bibleID) {
        throw new Error(`Bible with abbreviation "${bibleAbbreviation}" not found in cache. Please ensure the correct abbreviations are used.`);
    }
    const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    const passages = cache.passages[passageAndBible];
    if (passages === undefined || passages.length === 0) {
        try {
            await addToPassage([], passageID, bibleID, passageOptions, config, timestamp, cache, passageAndBible);
        }
        catch (error) {
            throw new Error(`Failed to add passage to cache: ${error.message}`);
        }
    }
    else {
        let addedToPassages = false;
        for (const passage of passages) {
            if (passageQueriesAreEqual(passage.query, passageQuery)) {
                addedToPassages = true;
                break;
            }
        }
        if (!addedToPassages) {
            try {
                await addToPassage(passages, passageID, bibleID, passageOptions, config, timestamp, cache, passageAndBible);
            }
            catch (error) {
                throw new Error(`Failed to add passage to existing passages in cache: ${error.message}`);
            }
        }
    }
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsV0FBVyxFQUNYLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsYUFBYSxHQUNkLE1BQU0sYUFBYSxDQUFDO0FBUXJCLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUxQixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUM7Ozs7R0FJRztBQUNILE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxXQUFtQixlQUFlLEVBQUUsRUFBRTtJQUNsRSxPQUFPLEdBQUcsUUFBUSxnQkFBZ0IsQ0FBQztBQUNyQyxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEI7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUMvQixRQUFrQixFQUNsQixXQUFtQixlQUFlLEVBQ2xDLEVBQUU7SUFDRixNQUFNLGFBQWEsQ0FDakIsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEVBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDbEMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUV0Qjs7Ozs7O0dBTUc7QUFDSCxNQUFNLGtCQUFrQixHQUFHLENBQ3pCLFFBQWtCLEVBQ2xCLFVBQVUsR0FBRyxFQUFFLEVBQ2YsZ0JBQXVCLEVBQ2IsRUFBRTtJQUNaLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztJQUNyQyxLQUFLLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25FLE1B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