import { GetPassagesError, } from './passage-types.js';
import { getDefaultUseMajorityFallback, getPassageID, } from '../reference/reference-utils.js';
import { loadBiblesCache, saveBiblesCache } from '../cache/cache-use-bibles.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, getDefaultPassageOptions, } from '../api-bible/api-utils.js';
import { loadPassagesCache, savePassagesCache, } from '../cache/cache-use-passages.js';
import { parseReferences } from '../reference/simple-parser.js';
import { preparePassage } from '../cache/cache-update-passages.js';
import { getDefaultBibles, getDefaultBiblesToExclude, } from '../cache/cache-utils.js';
import { getValidLanguages } from '../utils.js';
export const getPassages = async (options) => {
    const { input, passageOptions = getDefaultPassageOptions(), forcePassageApiCall = false, delimiter = ';', defaultBibles = getDefaultBibles(), useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), passagesCache = await loadPassagesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bhc3NhZ2UvZ2V0LXBhc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxnQkFBZ0IsR0FHakIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixPQUFPLEVBQ0wsNkJBQTZCLEVBQzdCLFlBQVksR0FDYixNQUFNLGlDQUFpQyxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDOUUsT0FBTyxFQUNMLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLG1CQUFtQixFQUNuQixvQkFBb0IsRUFDcEIsd0JBQXdCLEdBQ3pCLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixpQkFBaUIsR0FDbEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFFOUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2pFLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIseUJBQXlCLEdBQzFCLE1BQU0seUJBQXlCLENBQUM7QUFDakMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQzlCLE9BQTJCLEVBQ0YsRUFBRTtJQUMzQixNQUFNLEVBQ0osS0FBSyxFQUNMLGNBQWMsR0FBRyx3QkFBd0IsRUFBRSxFQUMzQyxtQkFBbUIsR0FBRyxLQUFLLEVBQzNCLFNBQVMsR0FBRyxHQUFHLEVBQ2YsYUFBYSxHQUFHLGdCQUFnQixFQUFFLEVBQ2xDLG1CQUFtQixHQUFHLDZCQUE2QixFQUFFLEVBQ3JELHNCQUFzQixHQUFHLEtBQUssRUFDOUIsV0FBVyxHQUFHLE1BQU0sZUFBZSxFQUFFLEVBQ3JDLGFBQWEsR0FBRyxNQUFNLGlCQUFpQixFQUFFLEVBQ3pDLFNBQVMsR0FBRyxtQkFBbUIsRUFBRSxFQUNqQyxlQUFlLEdBQUcseUJBQXlCLEVBQUUsRUFDN0MsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLEVBQ3RCLE1BQU0sR0FBRyxtQkFBbUIsRUFBRSxFQUM5QixPQUFPLEdBQUcsb0JBQW9CLEVBQUUsRUFDaEMsY0FBYyxHQUFHLDBCQUEwQixFQUFFLEVBQzdDLGlCQUFpQixHQUFHLDZCQUE2QixFQUFFLEdBQ3BELEdBQUcsT0FBTyxDQUFDO0lBRVosTUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV4RCxNQUFNLGFBQWEsR0FBZSxNQUFNLGVBQWUsQ0FBQztRQUN0RCxLQUFLO1FBQ0wsV0FBVztRQUNYLFNBQVM7UUFDVCxhQUFhO1FBQ2IsU0FBUyxFQUFFLGtCQUFrQjtRQUM3QixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLGVBQWU7UUFDZixNQUFNO1FBQ04sU0FBUztRQUNULE9BQU87UUFDUCxjQUFjO1FBQ2QsaUJBQWlCO0tBQ2xCLENBQUMsQ0FBQztJQUVILE1BQU0sYUFBYSxHQUFtQixFQUFFLENBQUM7SUFDekMsSUFBSSxDQUFDO1FBQ0gsS0FBSyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FDN0QsYUFBYSxDQUNkLEVBQUUsQ0FBQztZQUNGLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDckQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLEVBQUUsQ0FDL0IsY0FBYyxDQUFDO2dCQUNiLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDO2dCQUNsQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsS0FBSztnQkFDbEMsYUFBYTtnQkFDYixXQUFXO2dCQUNYLE1BQU07Z0JBQ04sY0FBYztnQkFDZCxTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixlQUFlO2dCQUNmLHNCQUFzQjtnQkFDdEIsbUJBQW1CO2FBQ3BCLENBQUMsQ0FDSCxDQUNGLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQy9ELE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE1BQU0sZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25DLE1BQU0saUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFdkMsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQyxDQUFDIn0=