import { GetPassagesError, } from './passage-types.js';
import { getDefaultUseMajorityFallback } from '../reference/reference-utils.js';
import { loadBiblesCache, saveBiblesCache } from '../cache/cache-use-bibles.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, getDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { loadPassagesCache, savePassagesCache, } from '../cache/cache-use-passages.js';
import { parseReferences } from '../reference/simple-parser.js';
import { preparePassage } from '../cache/cache-update-passages.js';
import { getDefaultBibles, getDefaultBiblesToExclude, } from '../cache/cache-utils.js';
import { getValidLanguages } from '../utils.js';
import { getPassageID } from './passage-utils.js';
export const getPassages = async (options) => {
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { input, passageOptions = getDefaultPassageOptions(), forcePassageApiCall = false, delimiter = ';', defaultBibles = getDefaultBibles(), useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), passagesCache = await loadPassagesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const processedLanguages = getValidLanguages(languages);
    const allReferences = await parseReferences({
        input,
        biblesCache,
        delimiter,
        defaultBibles,
        languages: processedLanguages,
        useMajorityFallback,
        forceUpdateBiblesCache,
        biblesToExclude,
        config,
        timestamp,
        retries,
        initialBackoff,
        delayBetweenCalls,
    });
    const passageOutput = {};
    try {
        for (const [referenceGroupString, references] of Object.entries(allReferences)) {
            passageOutput[referenceGroupString] = await Promise.all(references.map(async (reference) => preparePassage({
                passageID: getPassageID(reference),
                bibleAbbreviation: reference.bible,
                passagesCache,
                biblesCache,
                config,
                passageOptions,
                languages: processedLanguages,
                biblesToExclude,
                forceUpdateBiblesCache,
                forcePassageApiCall,
            })));
        }
    }
    catch (error) {
        const errorMessage = error.message ? error.message : undefined;
        throw new GetPassagesError(errorMessage, options);
    }
    await saveBiblesCache(biblesCache);
    await savePassagesCache(passagesCache);
    return passageOutput;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bhc3NhZ2UvZ2V0LXBhc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxnQkFBZ0IsR0FHakIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUM5RSxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzlFLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsNkJBQTZCLEVBQzdCLDBCQUEwQixFQUMxQixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLHdCQUF3QixHQUN6QixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsaUJBQWlCLEdBQ2xCLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTlELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRSxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLHlCQUF5QixHQUMxQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFaEQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFDOUIsT0FBMkIsRUFDRixFQUFFO0lBQzNCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFFckUsTUFBTSxFQUNKLEtBQUssRUFDTCxjQUFjLEdBQUcsd0JBQXdCLEVBQUUsRUFDM0MsbUJBQW1CLEdBQUcsS0FBSyxFQUMzQixTQUFTLEdBQUcsR0FBRyxFQUNmLGFBQWEsR0FBRyxnQkFBZ0IsRUFBRSxFQUNsQyxtQkFBbUIsR0FBRyw2QkFBNkIsRUFBRSxFQUNyRCxzQkFBc0IsR0FBRyxLQUFLLEVBQzlCLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQztRQUNsQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7UUFDMUIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO1FBQ3hDLFNBQVM7S0FDVixDQUFDLEVBQ0YsYUFBYSxHQUFHLE1BQU0saUJBQWlCLENBQUM7UUFDdEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1FBQzFCLGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtRQUN4QyxTQUFTO0tBQ1YsQ0FBQyxFQUNGLFNBQVMsR0FBRyxtQkFBbUIsRUFBRSxFQUNqQyxlQUFlLEdBQUcseUJBQXlCLEVBQUUsRUFDN0MsTUFBTSxHQUFHLG1CQUFtQixFQUFFLEVBQzlCLE9BQU8sR0FBRyxvQkFBb0IsRUFBRSxFQUNoQyxjQUFjLEdBQUcsMEJBQTBCLEVBQUUsRUFDN0MsaUJBQWlCLEdBQUcsNkJBQTZCLEVBQUUsR0FDcEQsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLGtCQUFrQixHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXhELE1BQU0sYUFBYSxHQUFlLE1BQU0sZUFBZSxDQUFDO1FBQ3RELEtBQUs7UUFDTCxXQUFXO1FBQ1gsU0FBUztRQUNULGFBQWE7UUFDYixTQUFTLEVBQUUsa0JBQWtCO1FBQzdCLG1CQUFtQjtRQUNuQixzQkFBc0I7UUFDdEIsZUFBZTtRQUNmLE1BQU07UUFDTixTQUFTO1FBQ1QsT0FBTztRQUNQLGNBQWM7UUFDZCxpQkFBaUI7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQW1CLEVBQUUsQ0FBQztJQUN6QyxJQUFJLENBQUM7UUFDSCxLQUFLLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUM3RCxhQUFhLENBQ2QsRUFBRSxDQUFDO1lBQ0YsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNyRCxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsRUFBRSxDQUMvQixjQUFjLENBQUM7Z0JBQ2IsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxLQUFLO2dCQUNsQyxhQUFhO2dCQUNiLFdBQVc7Z0JBQ1gsTUFBTTtnQkFDTixjQUFjO2dCQUNkLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLGVBQWU7Z0JBQ2Ysc0JBQXNCO2dCQUN0QixtQkFBbUI7YUFDcEIsQ0FBQyxDQUNILENBQ0YsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDL0QsTUFBTSxJQUFJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsTUFBTSxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbkMsTUFBTSxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUV2QyxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUMifQ==