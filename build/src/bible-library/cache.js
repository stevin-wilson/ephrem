import { loadBibles, saveBibles, updateBibles } from './bibles.js';
import { loadBookNames, saveBookNames, updateBookNames } from './book-names.js';
import { defaultCacheDir } from '../utils.js';
import { loadPassages, savePassages } from './passages.js';
// - - - - - - - - - -
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
export const clearCache = (cache) => {
    cache.bibles = {};
    cache.bookNames = {};
    cache.passages = {};
    cache.updatedSinceLoad = true;
};
// - - - - - - - - - -
const biblesHasLanguage = (language, bibles) => {
    return Object.values(bibles).some(bible => bible.language === language);
};
// - - - - - - - - - -
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
const cacheHasLanguage = (language, cache) => {
    if (!biblesHasLanguage(language, cache.bibles)) {
        return false;
    }
    return bookNamesHasLanguage(language, cache.bookNames);
};
// - - - - - - - - - -
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
// - - - - - - - - - -
// const cache = await loadCache();
// await updateCache(['arb'], cache);
// await saveCache(cache);
// console.log(JSON.stringify(cache, null, 2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDOUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd6RCxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFDNUIsV0FBbUIsZUFBZSxFQUNsQyxVQUFtQixFQUNILEVBQUU7SUFDbEIsTUFBTSxNQUFNLEdBQVcsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFjLE1BQU0sYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNELE1BQU0sUUFBUSxHQUFhLE1BQU0sWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUVwRSxPQUFPO1FBQ0wsTUFBTTtRQUNOLFNBQVM7UUFDVCxRQUFRO1FBQ1IsZ0JBQWdCLEVBQUUsS0FBSztLQUN4QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQzVCLEtBQVksRUFDWixXQUFtQixlQUFlLEVBQ25CLEVBQUU7SUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzVCLE9BQU87SUFDVCxDQUFDO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQztRQUNILE1BQU0sVUFBVSxDQUFD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