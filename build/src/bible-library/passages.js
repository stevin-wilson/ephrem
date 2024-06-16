import { dateReviver, defaultCacheDir, getThresholdDate, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { fetchPassage } from './api-bible.js';
import { initializeBiblesCache, initializePassagesCache, needsBiblesCacheUpdate, updateBiblesCache, } from './cache.js';
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
const getPassage = async (passageID, bibleAbbreviation, passageOptions = {}, biblesCache = initializeBiblesCache(), passagesCache = initializePassagesCache(), config = {}, languages = [], biblesToExclude = [], forceApiCall = false) => {
    // if already present in cache, return PassageAndFumsResponse from cache
    // else, fetch from API and return response and update PassageCache
    const needToUpdateCache = needsBiblesCacheUpdate(bibleAbbreviation, languages, biblesCache);
    if (needToUpdateCache) {
        await updateBiblesCache(languages, biblesCache, false, biblesToExclude, config);
    }
    const bibleID = biblesCache.bibles[bibleAbbreviation]?.id;
    if (!bibleID) {
        throw new Error(`Bible with abbreviation "${bibleAbbreviation}" not found in cache. Please ensure the correct abbreviations are used.`);
    }
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
    if (!forceApiCall) {
        const passages = passagesCache.passages[passageAndBible];
        if (passages !== undefined) {
            for (const passage of passages) {
                if (passageQueriesAreEqual(passage.query, passageQuery)) {
                    return passage.response;
                }
            }
        }
    }
    const passageAndFums = await fetchPassage(passageID, bibleID, passageOptions, config);
    const passage = {
        query: passageQuery,
        response: passageAndFums,
        cachedOn: new Date(),
    };
    if (!(passageAndBible in passagesCache.passages)) {
        passagesCache.passages[passageAndBible] = [];
    }
    passagesCache.passages[passageAndBible].push(passage);
    passagesCache.updatedSinceLoad = true;
    return passageAndFums;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsV0FBVyxFQUNYLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsYUFBYSxHQUNkLE1BQU0sYUFBYSxDQUFDO0FBVXJCLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUxQixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLGlCQUFpQixHQUNsQixNQUFNLFlBQVksQ0FBQztBQUVwQjs7OztHQUlHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFdBQW1CLGVBQWUsRUFBRSxFQUFFO0lBQ2xFLE9BQU8sR0FBRyxRQUFRLGdCQUFnQixDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0Qjs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxLQUFLLEVBQy9CLFFBQWtCLEVBQ2xCLFdBQW1CLGVBQWUsRUFDbEMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQixvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNsQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBRXRCOzs7Ozs7R0FNRztBQUNILE1BQU0sa0JBQWtCLEdBQUcsQ0FDekIsUUFBa0IsRUFDbEIsVUFBVSxHQUFHLEVBQUUsRUFDZixnQkFBdUIsRUFDYixFQUFFO0lBQ1osTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDckUsTUFBTSxlQUFlLEdBQWEsRUFBRSxDQUFDO0lBQ3JDLEtBQUss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