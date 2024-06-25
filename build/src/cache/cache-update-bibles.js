import { BibleNotAvailableError, } from './cache-types.js';
import { normalizeLanguage } from '../utils.js';
import { fetchBibles } from '../api-bible/api-bibles.js';
import { prepareBibleData } from './cache-bibles.js';
import { languageInBiblesCache, loadBiblesCache } from './cache-use-bibles.js';
import { fetchBooks } from '../api-bible/api-book-names.js';
import { prepareBookNames } from './cache-book-names.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, } from '../api-bible/api-utils.js';
import { getDefaultBiblesToExclude } from './cache-utils.js';
export const needsBiblesCacheUpdate = (biblesCache, bibleAbbreviation, languages = getDefaultLanguages()) => {
    let needToUpdateCache = false;
    if (bibleAbbreviation && !(bibleAbbreviation in biblesCache.bibles)) {
        needToUpdateCache = true;
    }
    const languagesToUpdate = languages.filter(language => !languageInBiblesCache(normalizeLanguage(language), biblesCache));
    if (languagesToUpdate.length > 0) {
        needToUpdateCache = true;
    }
    return needToUpdateCache;
};
export const updateBibles = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    let bibleResponses = [];
    if (languages) {
        for (const language of languages) {
            const normalizedLanguage = normalizeLanguage(language);
            bibleResponses = [
                ...bibleResponses,
                ...(await fetchBibles({
                    language: normalizedLanguage,
                    config,
                    retries,
                    initialBackoff,
                    delayBetweenCalls,
                })),
            ];
        }
    }
    else {
        bibleResponses = await fetchBibles({
            language: undefined,
            config,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
    }
    bibleResponses
        .filter(bibleResponse => !biblesToExclude.includes(bibleResponse.abbreviation))
        .forEach(bibleResponse => {
        Object.assign(biblesCache.bibles, prepareBibleData(bibleResponse, timestamp));
    });
    biblesCache.updatedSinceLoad = true;
};
const bookNameDetailsMatchReference = (bookIdWithLanguage, bookNameReference) => {
    return (bookIdWithLanguage.id === bookNameReference.id &&
        bookIdWithLanguage.language === bookNameReference.language &&
        bookIdWithLanguage.isAbbreviation === bookNameReference.isAbbreviation);
};
const getUpdatedBookReferences = (bookReferences, thisBookIdWithLanguage, bibleAbbreviation, timestamp) => {
    if (bookReferences === undefined || bookReferences.length === 0) {
        return [
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
            return false;
        });
        if (!matched) {
            bookReferences.push({
                ...thisBookIdWithLanguage,
                bibles: [bibleAbbreviation],
                cachedOn: timestamp,
            });
        }
        return bookReferences;
    }
};
const handleBookReferences = async (bibleAbbreviation, bible, bookNamesFromBible, biblesCache, timestamp) => {
    for (const bookNameDetails of bookNamesFromBible) {
        const bookReferences = biblesCache.bookNames[bookNameDetails.name];
        const thisBookIdWithLanguage = {
            id: bookNameDetails.id,
            language: bible.language,
            isAbbreviation: bookNameDetails.isAbbreviation,
        };
        biblesCache.bookNames[bookNameDetails.name] = getUpdatedBookReferences(bookReferences, thisBookIdWithLanguage, bibleAbbreviation, timestamp);
    }
};
export const updateBookNames = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    // Create an array of promises to be resolved concurrently
    const updatePromises = Object.entries(biblesCache.bibles)
        .filter(([, bible]) => languages.includes(bible.language))
        .map(async ([bibleAbbreviation, bible]) => {
        const bookResponses = await fetchBooks({
            bibleID: bible.id,
            config,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
        const bookNamesFromBible = prepareBookNames(bookResponses);
        await handleBookReferences(bibleAbbreviation, bible, bookNamesFromBible, biblesCache, timestamp);
    });
    await Promise.all(updatePromises);
    biblesCache.updatedSinceLoad = true;
};
export const updateBiblesCache = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    let languagesToUpdate = languages;
    if (!forceUpdateBiblesCache) {
        languagesToUpdate = languages.filter(language => !languageInBiblesCache(language, biblesCache));
    }
    if (languagesToUpdate.length !== 0) {
        await updateBibles({
            biblesCache,
            languages: languagesToUpdate,
            biblesToExclude,
            timestamp,
            config,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
        await updateBookNames({
            biblesCache,
            languages: languagesToUpdate,
            timestamp,
            config,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
        biblesCache.updatedSinceLoad = true;
    }
};
export const getBibleID = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { bibleAbbreviation, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), forceUpdateBiblesCache = false, languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const bibleId = biblesCache.bibles[bibleAbbreviation]?.id;
    if (!bibleId) {
        await updateBiblesCache({
            forceUpdateBiblesCache,
            biblesCache,
            languages,
            biblesToExclude,
            timestamp,
            config,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
    }
    if (!bibleId) {
        throw new BibleNotAvailableError(options);
    }
    return bibleId;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXBkYXRlLWJpYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYWNoZS9jYWNoZS11cGRhdGUtYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxzQkFBc0IsR0FTdkIsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDMUQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUNMLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLG1CQUFtQixFQUNuQixvQkFBb0IsR0FDckIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUzRCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxDQUNwQyxXQUF3QixFQUN4QixpQkFBMEIsRUFDMUIsWUFBc0IsbUJBQW1CLEVBQUUsRUFDbEMsRUFBRTtJQUNYLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzlCLElBQUksaUJBQWlCLElBQUksQ0FBQyxDQUFDLGlCQUFpQixJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BFLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUN4QyxRQUFRLENBQUMsRUFBRSxD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