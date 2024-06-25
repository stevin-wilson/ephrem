import { dateReviver, getThresholdDate, normalizeLanguage, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
const getBiblesCachePath = (cacheDir = getDefaultCacheDir()) => {
    return `${cacheDir}/bibles.json`;
};
export const saveBibles = async (bibles, cacheDir = getDefaultCacheDir()) => {
    await writeJsonFile(getBiblesCachePath(cacheDir), JSON.stringify(bibles, null, 2));
};
export const cleanBibles = (bibles, timestamp, maxCacheAgeDays = getDefaultMaxCacheAgeDays()) => {
    if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
        return [bibles, false];
    }
    const thresholdDate = getThresholdDate(maxCacheAgeDays, timestamp);
    const cleanedBibles = {};
    let removedRecords = false;
    for (const abbreviation of Object.keys(bibles)) {
        const bible = bibles[abbreviation];
        if (bible.cachedOn > thresholdDate) {
            cleanedBibles[abbreviation] = bible;
        }
        else {
            removedRecords = true;
        }
    }
    return [cleanedBibles, removedRecords];
};
export const loadBibles = async (cacheDir = getDefaultCacheDir()) => {
    try {
        const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
        return JSON.parse(jsonData, dateReviver);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return {};
    }
};
export const prepareBibleData = (bibleResponse, timestamp) => {
    const { id, abbreviation, language } = bibleResponse;
    return {
        [abbreviation]: {
            id,
            language: normalizeLanguage(language.id),
            cachedOn: timestamp,
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtYmlibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhY2hlL2NhY2hlLWJpYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsYUFBYSxHQUNkLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUkxQixPQUFPLEVBQUMsa0JBQWtCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUvRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsV0FBbUIsa0JBQWtCLEVBQUUsRUFBRSxFQUFFO0lBQ3JFLE9BQU8sR0FBRyxRQUFRLGNBQWMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixNQUFjLEVBQ2QsV0FBbUIsa0JBQWtCLEVBQUUsRUFDdkMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNoQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQ3pCLE1BQWMsRUFDZCxTQUFnQixFQUNoQixlQUFlLEdBQUcseUJBQXlCLEVBQUUsRUFDMUIsRUFBRTtJQUNyQixJQUFJLENBQUMsZUFBZSxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbkUsTUFBTSxhQUFhLEdBQVcsRUFBRSxDQUFDO0lBQ2pDLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztJQUUzQixLQUFLLE1BQU0sWUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMvQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkMsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLGFBQWEsRUFBRSxDQUFDO1lBQ25DLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdEMsQ0FBQzthQUFNLENBQUM7WUFDTixjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixXQUFtQixrQkFBa0IsRUFBRSxFQUN0QixFQUFFO0lBQ25CLElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBVyxDQUFDO0lBQ3JELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ysc0NBQXNDO1FBQ3RDLElBQUssS0FBK0IsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ25FLENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsT0FBTyxFQUFZLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQzlCLGFBQTRCLEVBQzVCLFNBQWUsRUFDUCxFQUFFO0lBQ1YsTUFBTSxFQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFDLEdBQUcsYUFBYSxDQUFDO0lBQ25ELE9BQU87UUFDTCxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ2QsRUFBRTtZQUNGLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3hDLFFBQVEsRUFBRSxTQUFTO1NBQ3BCO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9