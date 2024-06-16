import { loadBibles, saveBibles, updateBibles } from './bibles.js';
import { loadBookNames, saveBookNames, updateBookNames } from './book-names.js';
import { defaultCacheDir } from '../utils.js';
import { loadPassages, savePassages } from './passages.js';
// - - - - - - - - - -
export const initializeBiblesCache = () => ({
    bibles: {},
    bookNames: {},
    updatedSinceLoad: false,
});
// - - - - - - - - - -
/**
 * Loads the cache of bibles and book name information from the cache directory and
 * returns a Promise that resolves to the BiblesCache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data.
 * If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded BiblesCache object.
 */
export const loadBiblesCache = async (cacheDir = defaultCacheDir, maxAgeDays) => {
    const bibles = await loadBibles(cacheDir, maxAgeDays);
    const bookNames = await loadBookNames(cacheDir);
    return {
        bibles,
        bookNames,
        updatedSinceLoad: false,
    };
};
// - - - - - - - - - -
export const initializePassagesCache = () => ({
    passages: {},
    updatedSinceLoad: false,
});
// - - - - - - - - - -
/**
 * Loads the cache of passages from the cache directory and
 * returns a Promise that resolves to the PassagesCache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data.
 * If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded PassagesCache object.
 */
export const loadPassagesCache = async (cacheDir = defaultCacheDir, maxAgeDays) => {
    const passages = await loadPassages(cacheDir, maxAgeDays);
    return {
        passages,
        updatedSinceLoad: false,
    };
};
// - - - - - - - - - -
/**
 * Saves the BiblesCache data to the specified cache directory.
 * @param cache - The BiblesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export const saveBiblesCache = async (cache, cacheDir = defaultCacheDir) => {
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
    if (savedAll) {
        cache.updatedSinceLoad = false;
    }
};
// - - - - - - - - - -
/**
 * Saves the PassagesCache data to the specified cache directory.
 * @param cache - The PassagesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export const savePassagesCache = async (cache, cacheDir = defaultCacheDir) => {
    if (!cache.updatedSinceLoad) {
        return;
    }
    try {
        await savePassages(cache.passages, cacheDir);
        cache.updatedSinceLoad = false;
    }
    catch (error) {
        console.error('Error saving passages to cache', error);
    }
};
// - - - - - - - - - -
/**
 * Checks if any bible in the given list has the specified language.
 * @param language - The ISO 639-3 three digit language code to be checked.
 * @param bibles - The list of bibles to search in.
 * @returns - True if any bible in the list has the specified language, false otherwise.
 */
const languageInBibles = (language, bibles) => {
    return Object.values(bibles).some(bible => bible.language === language);
};
// - - - - - - - - - -
/**
 * Checks if the given book names have the specified language.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param bookNames - The book names to search through.
 * @returns - True if the book names have the specified language, false otherwise.
 */
const languageInBookNames = (language, bookNames) => {
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
export const languageInBiblesCache = (language, cache) => {
    if (!languageInBibles(language, cache.bibles)) {
        return false;
    }
    return languageInBookNames(language, cache.bookNames);
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
export const updateBiblesCache = async (languages, cache, forceUpdate = false, biblesToExclude = [], config = {}) => {
    let languagesToUpdate = languages;
    if (!forceUpdate) {
        languagesToUpdate = languages.filter(language => !languageInBiblesCache(language, cache));
    }
    if (languagesToUpdate.length !== 0) {
        const timestamp = new Date();
        await updateBibles(languagesToUpdate, cache, biblesToExclude, config, timestamp);
        await updateBookNames(languagesToUpdate, cache, config, timestamp);
        cache.updatedSinceLoad = true;
    }
};
export const needsBiblesCacheUpdate = (bibleAbbreviation, languages, cache) => {
    let needToUpdateCache = false;
    if (bibleAbbreviation && !(bibleAbbreviation in cache.bibles)) {
        needToUpdateCache = true;
    }
    const languagesToUpdate = languages.filter(language => !languageInBiblesCache(language, cache));
    if (languagesToUpdate.length > 0) {
        needToUpdateCache = true;
    }
    return needToUpdateCache;
};
// - - - - - - - - - -
// const cache = await loadCache();
// await updateCache(['arb'], cache);
// await saveCache(cache);
// console.log(JSON.stringify(cache, null, 2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDOUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd6RCxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsR0FBZ0IsRUFBRSxDQUFDLENBQUM7SUFDdkQsTUFBTSxFQUFFLEVBQUU7SUFDVixTQUFTLEVBQUUsRUFBRTtJQUNiLGdCQUFnQixFQUFFLEtBQUs7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsc0JBQXNCO0FBQ3RCOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUNsQyxXQUFtQixlQUFlLEVBQ2xDLFVBQW1CLEVBQ0csRUFBRTtJQUN4QixNQUFNLE1BQU0sR0FBVyxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUQsTUFBTSxTQUFTLEdBQWMsTUFBTSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0QsT0FBTztRQUNMLE1BQU07UUFDTixTQUFTO1FBQ1QsZ0JBQWdCLEVBQUUsS0FBSztLQUN4QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLEdBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQzNELFFBQVEsRUFBRSxFQUFFO0lBQ1osZ0JBQWdCLEVBQUUsS0FBSztDQUN4QixDQUFDLENBQUM7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