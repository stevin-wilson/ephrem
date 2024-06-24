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
    const { biblesCache = await loadBiblesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
    const { biblesCache = (await loadBiblesCache()), languages = getDefaultLanguages(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
    const { forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
    const { bibleAbbreviation, biblesCache = await loadBiblesCache(), forceUpdateBiblesCache = false, languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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