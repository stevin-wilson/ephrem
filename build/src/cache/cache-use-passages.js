import { cleanPassagesCache, loadPassages, savePassages, } from './cache-passages.js';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
export const getPassageAndBible = (passageID, bibleAbbreviation) => `${passageID}@${bibleAbbreviation}`;
export const loadPassagesCache = async (options = {}) => {
    const { cacheDir = getDefaultCacheDir(), maxCacheAgeDays = getDefaultMaxCacheAgeDays(), timestamp = new Date(), } = options;
    let passages = await loadPassages(cacheDir);
    let updatedSinceLoad = false;
    if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
        [passages, updatedSinceLoad] = cleanPassagesCache(passages, timestamp, maxCacheAgeDays);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXNlLXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhY2hlL2NhY2hlLXVzZS1wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLFlBQVksRUFDWixZQUFZLEdBQ2IsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsa0JBQWtCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUvRSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxDQUNoQyxTQUFpQixFQUNqQixpQkFBeUIsRUFDekIsRUFBRSxDQUFDLEdBQUcsU0FBUyxJQUFJLGlCQUFpQixFQUFFLENBQUM7QUFFekMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUNwQyxVQUE0QixFQUFFLEVBQ04sRUFBRTtJQUMxQixNQUFNLEVBQ0osUUFBUSxHQUFHLGtCQUFrQixFQUFFLEVBQy9CLGVBQWUsR0FBRyx5QkFBeUIsRUFBRSxFQUM3QyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsR0FDdkIsR0FBRyxPQUFPLENBQUM7SUFFWixJQUFJLFFBQVEsR0FBYSxNQUFNLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUU3QixJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzFELENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsa0JBQWtCLENBQy9DLFFBQVEsRUFDUixTQUFTLEVBQ1QsZUFBZSxDQUNoQixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxRQUFRO1FBQ1IsZ0JBQWdCO0tBQ2pCLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQ3BDLGFBQTRCLEVBQzVCLFdBQW1CLGtCQUFrQixFQUFFLEVBQ3hCLEVBQUU7SUFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3BDLE9BQU87SUFDVCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxZQUFZLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRSxDQUFDO0FBQ0gsQ0FBQyxDQUFDIn0=