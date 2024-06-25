import { getPassageAndBible, loadPassagesCache } from './cache-use-passages.js';
import { loadBiblesCache } from './cache-use-bibles.js';
import { getBibleID, needsBiblesCacheUpdate, updateBiblesCache, } from './cache-update-bibles.js';
import { fetchPassage } from '../api-bible/api-passages.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, getDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { getDefaultBiblesToExclude } from './cache-utils.js';
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
export const preparePassage = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { passageID, bibleAbbreviation, passagesCache = await loadPassagesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), config = getDefaultApiConfig(), passageOptions = getDefaultPassageOptions(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), forceUpdateBiblesCache = false, forcePassageApiCall = false, retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const getPassageFromCache = (passagesCache, forcePassageApiCall, passageAndBible, passageQuery) => {
        if (!forcePassageApiCall) {
            const passages = passagesCache.passages[passageAndBible];
            if (passages !== undefined) {
                for (const passage of passages) {
                    if (passageQueriesAreEqual(passage.query, passageQuery)) {
                        return passage.response;
                    }
                }
            }
        }
        return null;
    };
    if (forceUpdateBiblesCache ||
        needsBiblesCacheUpdate(biblesCache, bibleAbbreviation, languages)) {
        await updateBiblesCache({
            biblesCache,
            languages,
            biblesToExclude,
            config,
            forceUpdateBiblesCache,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
    }
    const bibleID = await getBibleID({
        bibleAbbreviation,
        biblesCache,
        forceUpdateBiblesCache,
        languages,
        biblesToExclude,
        timestamp,
        delayBetweenCalls,
        config,
        retries,
        initialBackoff,
    });
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
    const passageFromCache = getPassageFromCache(passagesCache, forcePassageApiCall, passageAndBible, passageQuery);
    if (passageFromCache !== null)
        return passageFromCache;
    const passageAndFums = await fetchPassage({
        passageID,
        bibleID,
        passageOptions,
        config,
        retries,
        initialBackoff,
        delayBetweenCalls,
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXBkYXRlLXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhY2hlL2NhY2hlLXVwZGF0ZS1wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUNMLFVBQVUsRUFDVixzQkFBc0IsRUFDdEIsaUJBQWlCLEdBQ2xCLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsNkJBQTZCLEVBQzdCLDBCQUEwQixFQUMxQixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLHdCQUF3QixHQUN6QixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRTNELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLENBQ3BDLE1BQW9CLEVBQ3BCLE1BQW9CLEVBQ1gsRUFBRTtJQUNYLE9BQU8sQ0FDTCxNQUFNLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLE9BQU87UUFDakMsTUFBTSxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsV0FBVztRQUN6QyxNQUFNLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxZQUFZO1FBQzNDLE1BQU0sQ0FBQyxhQUFhLEtBQUssTUFBTSxDQUFDLGFBQWE7UUFDN0MsTUFBTSxDQUFDLHFCQUFxQixLQUFLLE1BQU0sQ0FBQyxxQkFBcUI7UUFDN0QsTUFBTSxDQUFDLG1CQUFtQixLQUFLLE1BQU0sQ0FBQyxtQkFBbUI7UUFDekQsTUFBTSxDQUFDLGlC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