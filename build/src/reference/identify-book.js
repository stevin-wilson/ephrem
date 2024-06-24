import { loadBiblesCache } from '../cache/cache-use-bibles.js';
import { getDefaultUseMajorityFallback, getKeyOfMaxValue, } from './reference-utils.js';
import { BookNotFoundError, } from './reference-types.js';
import { BOOK_IDs } from './book-ids.js';
import { normalizeBookName } from '../utils.js';
import { needsBiblesCacheUpdate, updateBiblesCache, } from '../cache/cache-update-bibles.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, } from '../api-bible/api-utils.js';
import { getDefaultBiblesToExclude } from '../cache/cache-utils.js';
export const getBookID = async (options) => {
    const { bookName, bibleAbbreviation, useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZnktYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWZlcmVuY2UvaWRlbnRpZnktYm9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUNMLDZCQUE2QixFQUM3QixnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQ0wsaUJBQWlCLEdBR2xCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixpQkFBaUIsR0FDbEIsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLDZCQUE2QixFQUM3QiwwQkFBMEIsRUFDMUIsbUJBQW1CLEVBQ25CLG9CQUFvQixHQUNyQixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRWxFLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQzVCLE9BQXlCLEVBQ08sRUFBRTtJQUNsQyxNQUFNLEVBQ0osUUFBUSxFQUNSLGlCQUFpQixFQUNqQixtQkFBbUIsR0FBRyw2QkFBNkIsRUFBRSxFQUNyRCxzQkFBc0IsR0FBRyxLQUFLLEVBQzlCLFdBQVcsR0FBRyxNQUFNLGVBQWUsRUFBRSxFQUNyQyxTQUFTLEdBQUcsbUJBQW1CLEVBQUUsRUFDakMsZUFBZSxHQUFHLHlCQUF5QixFQUFFLEVBQzdDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxFQUN0QixNQUFNLEdBQUcsbUJBQW1CLEVBQUUsRUFDOUIsT0FBTyxHQUFHLG9CQUFvQixFQUFFLEVBQ2hDLGNBQWMsR0FBRyww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