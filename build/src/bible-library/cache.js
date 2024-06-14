import { loadBibles, saveBibles, updateBibles } from './bibles.js';
import { loadBookNames, saveBookNames, updateBookNames } from './book-names.js';
import { defaultCacheDir } from '../utils.js';
import { loadPassages, savePassages } from './passages.js';
// - - - - - - - - - -
/**
 * Loads the cache from the cache directory and returns a Promise that resolves to the Cache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data. If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded Cache object.
 */
export const loadCache = async (cacheDir = defaultCacheDir, maxAgeDays) => {
    const bibles = await loadBibles(cacheDir, maxAgeDays);
    const bookNames = await loadBookNames(cacheDir);
    const passages = await loadPassages(cacheDir, maxAgeDays);
    return {
        bibles,
        bookNames,
        passages,
        updatedSinceLoad: false,
    };
};
// - - - - - - - - - -
/**
 * Saves the cache data to the specified cache directory.
 * @param cache - The cache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export const saveCache = async (cache, cacheDir = defaultCacheDir) => {
    if (!cache.updatedSinceLoad) {
        return;
    }
    let savedAll = true;
    try {
        await saveBibles(cache.bibles, cacheDir);
    }
    catch (error) {
        savedAll = false;
        console.error('Error saving bibles to cache', error);
    }
    try {
        await saveBookNames(cache.bookNames, cacheDir);
    }
    catch (error) {
        savedAll = false;
        console.error('Error saving bookNames to cache', error);
    }
    try {
        await savePassages(cache.passages, cacheDir);
    }
    catch (error) {
        savedAll = false;
        console.error('Error saving passages to cache', error);
    }
    if (savedAll) {
        cache.updatedSinceLoad = false;
    }
};
// - - - - - - - - - -
/**
 * Clear cache by resetting all cache properties and setting `updatedSinceLoad` to `true`.
 * @param cache - The cache object to be cleared.
 */
export const clearCache = (cache) => {
    cache.bibles = {};
    cache.bookNames = {};
    cache.passages = {};
    cache.updatedSinceLoad = true;
};
// - - - - - - - - - -
/**
 * Checks if any bible in the given list has the specified language.
 * @param language - The ISO 639-3 three digit language code to be checked.
 * @param bibles - The list of bibles to search in.
 * @returns - True if any bible in the list has the specified language, false otherwise.
 */
const biblesHasLanguage = (language, bibles) => {
    return Object.values(bibles).some(bible => bible.language === language);
};
// - - - - - - - - - -
/**
 * Checks if the given book names have the specified language.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param bookNames - The book names to search through.
 * @returns - True if the book names have the specified language, false otherwise.
 */
const bookNamesHasLanguage = (language, bookNames) => {
    for (const bookReferences of Object.values(bookNames)) {
        for (const bookReference of bookReferences) {
            if (bookReference.language === language) {
                return true;
            }
        }
    }
    return false;
};
// - - - - - - - - - -
/**
 * Checks if the given language is available in the cache.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param cache - The cache object.
 * @returns - A boolean indicating if the language is available in the cache.
 */
const cacheHasLanguage = (language, cache) => {
    if (!biblesHasLanguage(language, cache.bibles)) {
        return false;
    }
    return bookNamesHasLanguage(language, cache.bookNames);
};
// - - - - - - - - - -
/**
 * Updates the cache with new data for specified languages.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param cache - The cache object to update.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @returns - A promise that resolves when the cache is updated.
 */
export const updateCache = async (languages, cache, forceUpdate = false, biblesToExclude = [], config = {}) => {
    let languagesToUpdate = languages;
    if (!forceUpdate) {
        languagesToUpdate = languages.filter(language => !cacheHasLanguage(language, cache));
    }
    if (languagesToUpdate.length !== 0) {
        const timestamp = new Date();
        await updateBibles(languagesToUpdate, cache, biblesToExclude, config, timestamp);
        await updateBookNames(languagesToUpdate, cache, config, timestamp);
    }
};
/**
 * Loads cache, updates and then saves it.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @param [cacheDir] - The cache directory to load from.
 * @returns - A promise that resolves when the cache is loaded, updated, and saved successfully.
 */
export const loadUpdateSaveCache = async (languages, forceUpdate = false, biblesToExclude = [], config = {}, cacheDir = defaultCacheDir) => {
    const cache = await loadCache(cacheDir);
    await updateCache(languages, cache, forceUpdate, biblesToExclude, config);
    await saveCache(cache, cacheDir);
};
// - - - - - - - - - -
// const cache = await loadCache();
// await updateCache(['arb'], cache);
// await saveCache(cache);
// console.log(JSON.stringify(cache, null, 2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDOUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd6RCxzQkFBc0I7QUFDdEI7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUM1QixXQUFtQixlQUFlLEVBQ2xDLFVBQW1CLEVBQ0gsRUFBRTtJQUNsQixNQUFNLE1BQU0sR0FBVyxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUQsTUFBTSxTQUFTLEdBQWMsTUFBTSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsTUFBTSxRQUFRLEdBQWEsTUFBTSxZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRXBFLE9BQU87UUFDTCxNQUFNO1FBQ04sU0FBUztRQUNULFFBQVE7UUFDUixnQkFBZ0IsRUFBRSxLQUFLO0tBQ3hCLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEI7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUM1QixLQUFZLEVBQ1osV0FBbUIsZUFBZSxFQUNuQixFQUFFO0lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM1QixPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztJQUNwQixJ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