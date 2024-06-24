import { cleanPassagesCache, loadPassages, savePassages, } from './cache-passages.js';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
export const getPassageAndBible = (passageID, bibleAbbreviation) => `${passageID}@${bibleAbbreviation}`;
export const loadPassagesCache = async (cacheDir = getDefaultCacheDir(), maxCacheAgeDays = getDefaultMaxCacheAgeDays(), currentTimestamp = new Date()) => {
    let passages = await loadPassages(cacheDir);
    let updatedSinceLoad = false;
    if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
        [passages, updatedSinceLoad] = cleanPassagesCache(passages, currentTimestamp, maxCacheAgeDays);
    }
    return {
        passages,
        updatedSinceLoad,
    };
};
export const savePassagesCache = async (passagesCache, cacheDir = getDefaultCacheDir()) => {
    if (!passagesCache.updatedSinceLoad) {
        return;
    }
    try {
        await savePassages(passagesCache.passages, cacheDir);
        passagesCache.updatedSinceLoad = false;
    }
    catch (error) {
        console.error('Error saving passages to passagesCache', error);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXNlLXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhY2hlL2NhY2hlLXVzZS1wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLFlBQVksRUFDWixZQUFZLEdBQ2IsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUvRSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxDQUNoQyxTQUFpQixFQUNqQixpQkFBeUIsRUFDekIsRUFBRSxDQUFDLEdBQUcsU0FBUyxJQUFJLGlCQUFpQixFQUFFLENBQUM7QUFFekMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUNwQyxXQUFtQixrQkFBa0IsRUFBRSxFQUN2QyxrQkFBc0MseUJBQXlCLEVBQUUsRUFDakUsZ0JBQWdCLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFDTCxFQUFFO0lBQzFCLElBQUksUUFBUSxHQUFhLE1BQU0sWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBRTdCLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDMUQsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxrQkFBa0IsQ0FDL0MsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixlQUFlLENBQ2hCLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTztRQUNMLFFBQVE7UUFDUixnQkFBZ0I7S0FDakIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFDcEMsYUFBNEIsRUFDNUIsV0FBbUIsa0JBQWtCLEVBQUUsRUFDeEIsRUFBRTtJQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDcEMsT0FBTztJQUNULENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxNQUFNLFlBQVksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLENBQUM7QUFDSCxDQUFDLENBQUMifQ==