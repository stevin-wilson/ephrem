import { fetchBibles } from './api-bible.js';
import { dateReviver, defaultCacheDir, getThresholdDate, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
// - - - - - - - - - -
//  Abbreviation -> Bible
/**
 * Returns the cache path for bibles.
 * @param cacheDir - The directory where the cache is stored. Defaults to defaultCacheDir if not specified.
 * @returns - The cache path for bibles.
 */
const getBiblesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/bibles.json`;
};
// - - - - - - - - - -
/**
 * Saves the Bibles object to the specified cache directory in JSON format.
 * If no cache directory is provided, the default cache directory will be used.
 * @param bibles - The Bibles object to be saved.
 * @param [cacheDir] - The cache directory path.
 * @returns - A Promise that resolves when the Bibles object is successfully saved.
 */
export const saveBibles = async (bibles, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBiblesCachePath(cacheDir), JSON.stringify(bibles, null, 2));
};
// - - - - - - - - - -
/**
 * Cleans the bibles cache by removing entries that are older than the specified maximum age.
 * @param bibles - The bibles cache object.
 * @param [maxAgeDays] - The maximum age of entries to keep in days.
 * @param [currentTimestamp] - The current timestamp.
 * If not provided, the current date will be used.
 * @returns - The cleaned bibles cache object.
 */
const cleanBiblesCache = (bibles, maxAgeDays = 14, currentTimestamp) => {
    const thresholdDate = getThresholdDate(maxAgeDays, currentTimestamp);
    const cleanedBibles = {};
    for (const abbreviation of Object.keys(bibles)) {
        const bible = bibles[abbreviation];
        if (bible.cachedOn > thresholdDate) {
            cleanedBibles[abbreviation] = bible;
        }
    }
    return cleanedBibles;
};
// - - - - - - - - - -
/**
 * Loads the Bibles from the cache directory.
 * @param cacheDir - The cache directory path. Default value is defaultCacheDir.
 * @param [maxAgeDays] - The maximum age of the cached Bibles in days.
 * @param [currentTimestamp] - The current timestamp.
 * @returns - A promise that resolves to the loaded Bibles.
 */
export const loadBibles = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
        const bibles = JSON.parse(jsonData, dateReviver);
        return typeof maxAgeDays === 'number' && maxAgeDays >= 0
            ? cleanBiblesCache(bibles, maxAgeDays, currentTimestamp)
            : bibles;
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
 * Prepares bible data for caching.
 * @param bibleResponse - The response from the bible API.
 * @param timestamp - The current timestamp.
 * @returns The prepared bible data for caching.
 */
const prepareBibleData = (bibleResponse, timestamp) => {
    const { id, abbreviation, language } = bibleResponse;
    return {
        [abbreviation]: {
            id,
            language: language.id,
            scriptDirection: language.scriptDirection,
            cachedOn: timestamp,
        },
    };
};
/**
 * Updates bibles in the cache for the specified languages.
 * @param languages - The ISO 639-3 three digit language codes for which to update the bibles.
 * @param cache - The cache object where the bibles will be updated.
 * @param [biblesToExclude] - The list of bible abbreviations to exclude from the update.
 * @param [config] - The Axios request configuration options.
 * @param [timestamp] - The timestamp for the bible update.
 * @returns - A promise that resolves once the bibles have been updated.
 */
export const updateBibles = async (languages, cache, biblesToExclude = [], config = {}, timestamp = new Date()) => {
    for (const language of languages) {
        const bibleResponses = await fetchBibles(language, config);
        bibleResponses
            .filter(bibleResponse => !biblesToExclude.includes(bibleResponse.abbreviation))
            .forEach(bibleResponse => {
            Object.assign(cache.bibles, prepareBibleData(bibleResponse, timestamp));
        });
    }
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQ0wsV0FBVyxFQUNYLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsYUFBYSxHQUNkLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUcxQixzQkFBc0I7QUFDdEIseUJBQXlCO0FBRXpCOzs7O0dBSUc7QUFDSCxNQUFNLGtCQUFrQixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDaEUsT0FBTyxHQUFHLFFBQVEsY0FBYyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0Qjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixNQUFjLEVBQ2QsV0FBbUIsZUFBZSxFQUNsQyxFQUFFO0lBQ0YsTUFBTSxhQUFhLENBQ2pCLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxFQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ2hDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEI7Ozs7Ozs7R0FPRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsTUFBYyxFQUNkLFVBQVUsR0FBRyxFQUFFLEVBQ2YsZ0JBQXVCLEVBQ2YsRUFBRTtJQUNWLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRXJFLE1BQU0sYUFBYSxHQUFXLEVBQUUsQ0FBQztJQUVqQyxLQUFLLE1BQU0sWUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMvQyxNQUFN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