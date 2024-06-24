import { GetPassagesError, } from './passage-types.js';
import { getDefaultUseMajorityFallback, getPassageID, } from '../reference/reference-utils.js';
import { loadBiblesCache, saveBiblesCache } from '../cache/cache-use-bibles.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, getDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { loadPassagesCache, savePassagesCache, } from '../cache/cache-use-passages.js';
import { parseReferences } from '../reference/simple-parser.js';
import { preparePassage } from '../cache/cache-update-passages.js';
import { getDefaultBibles, getDefaultBiblesToExclude, } from '../cache/cache-utils.js';
export const getPassages = async (options) => {
    const { input, passageOptions = getDefaultPassageOptions(), forcePassageApiCall = false, delimiter = ';', defaultBibles = getDefaultBibles(), useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), passagesCache = await loadPassagesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const allReferences = await parseReferences({
        input,
        biblesCache,
        delimiter,
        defaultBibles,
        languages,
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
                languages,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bhc3NhZ2UvZ2V0LXBhc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxnQkFBZ0IsR0FHakIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixPQUFPLEVBQ0wsNkJBQTZCLEVBQzdCLFlBQVksR0FDYixNQUFNLGlDQUFpQyxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDOUUsT0FBTyxFQUNMLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLG1CQUFtQixFQUNuQixvQkFBb0IsRUFDcEIsd0JBQXdCLEdBQ3pCLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixpQkFBaUIsR0FDbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFFOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2pFLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIseUJBQXlCLEdBQzFCLE1BQU0seUJBQXlCLENBQUM7QUFFakMsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFDOUIsT0FBMkIsRUFDRixFQUFFO0lBQzNCLE1BQU0sRUFDSixLQUFLLEVBQ0wsY0FBYyxHQUFHLHdCQUF3QixFQUFFLEVBQzNDLG1CQUFtQixHQUFHLEtBQUssRUFDM0IsU0FBUyxHQUFHLEdBQUcsRUFDZixhQUFhLEdBQUcsZ0JBQWdCLEVBQUUsRUFDbEMsbUJBQW1CLEdBQUcsNkJBQTZCLEVBQUUsRUFDckQsc0JBQXNCLEdBQUcsS0FBSyxFQUM5QixXQUFXLEdBQUcsTUFBTSxlQUFlLEVBQUUsRUFDckMsYUFBYSxHQUFHLE1BQU0saUJBQWlCLEVBQUUsRUFDekMsU0FBUyxHQUFHLG1CQUFtQixFQUFFLEVBQ2pDLGVBQWUsR0FBRyx5QkFBeUIsRUFBRSxFQUM3QyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFDdEIsTUFBTSxHQUFHLG1CQUFtQixFQUFFLEVBQzlCLE9BQU8sR0FBRyxvQkFBb0IsRUFBRSxFQUNoQyxjQUFjLEdBQUcsMEJBQTBCLEVBQUUsRUFDN0MsaUJBQWlCLEdBQUcsNkJBQTZCLEVBQUUsR0FDcEQsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLGFBQWEsR0FBZSxNQUFNLGVBQWUsQ0FBQztRQUN0RCxLQUFLO1FBQ0wsV0FBVztRQUNYLFNBQVM7UUFDVCxhQUFhO1FBQ2IsU0FBUztRQUNULG1CQUFtQjtRQUNuQixzQkFBc0I7UUFDdEIsZUFBZTtRQUNmLE1BQU07UUFDTixTQUFTO1FBQ1QsT0FBTztRQUNQLGNBQWM7UUFDZCxpQkFBaUI7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQW1CLEVBQUUsQ0FBQztJQUN6QyxJQUFJLENBQUM7UUFDSCxLQUFLLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUM3RCxhQUFhLENBQ2QsRUFBRSxDQUFDO1lBQ0YsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNyRCxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsRUFBRSxDQUMvQixjQUFjLENBQUM7Z0JBQ2IsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxLQUFLO2dCQUNsQyxhQUFhO2dCQUNiLFdBQVc7Z0JBQ1gsTUFBTTtnQkFDTixjQUFjO2dCQUNkLFNBQVM7Z0JBQ1QsZUFBZTtnQkFDZixzQkFBc0I7Z0JBQ3RCLG1CQUFtQjthQUNwQixDQUFDLENBQ0gsQ0FDRixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMvRCxNQUFNLElBQUksZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxNQUFNLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNuQyxNQUFNLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXZDLE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyJ9