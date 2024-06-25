import { loadBiblesCache } from '../cache/cache-use-bibles.js';
import { getDefaultUseMajorityFallback, getKeyOfMaxValue, } from './reference-utils.js';
import { BookNotFoundError, } from './reference-types.js';
import { BOOK_IDs } from './book-ids.js';
import { normalizeBookName } from '../utils.js';
import { needsBiblesCacheUpdate, updateBiblesCache, } from '../cache/cache-update-bibles.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, } from '../api-bible/api-utils.js';
import { getDefaultBiblesToExclude } from '../cache/cache-utils.js';
export const getBookID = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { bookName, bibleAbbreviation, useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const normalizedBookName = normalizeBookName(bookName);
    const haveToUseMajorityFallback = useMajorityFallback || !bibleAbbreviation;
    const needToUpdateCache = needsBiblesCacheUpdate(biblesCache, bibleAbbreviation, languages);
    if (needToUpdateCache || forceUpdateBiblesCache) {
        await updateBiblesCache({
            biblesCache,
            languages,
            biblesToExclude,
            config,
            forceUpdateBiblesCache,
            timestamp,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
    }
    const bookReferences = biblesCache.bookNames[normalizedBookName];
    if (!bookReferences) {
        throw new BookNotFoundError(bookName, options);
    }
    let bookID = undefined;
    if (bibleAbbreviation) {
        bookID = await getBookIdInBible(normalizedBookName, bibleAbbreviation, biblesCache);
    }
    if (!bookID && haveToUseMajorityFallback) {
        bookID = await getBookIdByMajority(normalizedBookName, biblesCache, languages);
    }
    if (bookID === undefined || !(bookID in BOOK_IDs)) {
        throw new BookNotFoundError(bookName, options);
    }
    return bookID;
};
const getBookIdInBible = async (bookName, bibleAbbreviation, biblesCache) => {
    try {
        const bookReferences = biblesCache.bookNames[bookName];
        if (!bookReferences) {
            return undefined;
        }
        // Iterate over bookReferences to find a match with bibleAbbreviation
        for (const bookReference of bookReferences) {
            if (bookReference.bibles.includes(bibleAbbreviation)) {
                return bookReference.id;
            }
        }
        return undefined;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
};
const getBookIdByMajority = async (bookName, biblesCache, languages) => {
    try {
        const bookReferences = biblesCache.bookNames[bookName];
        if (!bookReferences) {
            return undefined;
        }
        const voteTally = {};
        for (const bookReference of bookReferences) {
            // Skip if languages is defined and does not include the bookReference language
            if (languages.length > 0 && !languages.includes(bookReference.language)) {
                continue;
            }
            const bookID = bookReference.id;
            if (!voteTally[bookID]) {
                voteTally[bookID] = 0;
            }
            voteTally[bookID] += bookReference.bibles.length;
        }
        return getKeyOfMaxValue(voteTally);
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZnktYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWZlcmVuY2UvaWRlbnRpZnktYm9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUNMLDZCQUE2QixFQUM3QixnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQ0wsaUJBQWlCLEdBR2xCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixpQkFBaUIsR0FDbEIsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLDZCQUE2QixFQUM3QiwwQkFBMEIsRUFDMUIsbUJBQW1CLEVBQ25CLG9CQUFvQixHQUNyQixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRWxFLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQzVCLE9BQXlCLEVBQ08sRUFBRTtJQUNsQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRXJFLE1BQU0sRUFDSixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLG1CQUFtQixHQUFHLDZCQUE2QixFQUFFLEVBQ3JELHNCQUFzQixHQUFHLEtBQUssRUFDOUIsV0FBVyxHQUFHLE1BQU0sZUFBZSxDQUFDO1FBQ2xDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtRQUMxQixlQUFlLEVBQUUsT0FBTyxDQUFDLGVB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