import { dateReviver, getThresholdDate, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
const getPassagesCachePath = (cacheDir = getDefaultCacheDir()) => {
    return `${cacheDir}/passages.json`;
};
export const savePassages = async (passages, cacheDir = getDefaultCacheDir()) => {
    await writeJsonFile(getPassagesCachePath(cacheDir), JSON.stringify(passages, null, 2));
};
export const cleanPassagesCache = (passages, currentTimestamp, maxCacheAgeDays = getDefaultMaxCacheAgeDays()) => {
    if (!maxCacheAgeDays || maxCacheAgeDays < 0) {
        return [passages, false];
    }
    const thresholdDate = getThresholdDate(maxCacheAgeDays, currentTimestamp);
    const cleanedPassages = {};
    let removedRecords = false;
    for (const [passageAndBible, currentPassages] of Object.entries(passages)) {
        const filteredPassages = currentPassages.filter(passage => passage.cachedOn > thresholdDate);
        if (filteredPassages.length !== currentPassages.length) {
            removedRecords = true;
        }
        if (filteredPassages.length > 0) {
            cleanedPassages[passageAndBible] = filteredPassages;
        }
    }
    return [cleanedPassages, removedRecords];
};
export const loadPassages = async (cacheDir = getDefaultCacheDir()) => {
    try {
        const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcGFzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FjaGUvY2FjaGUtcGFzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekUsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTFCLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRS9FLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxXQUFtQixrQkFBa0IsRUFBRSxFQUFFLEVBQUU7SUFDdkUsT0FBTyxHQUFHLFFBQVEsZ0JBQWdCLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFDL0IsUUFBa0IsRUFDbEIsV0FBbUIsa0JBQWtCLEVBQUUsRUFDdkMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQixvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNsQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FDaEMsUUFBa0IsRUFDbEIsZ0JBQXVCLEVBQ3ZCLGVBQWUsR0FBRyx5QkFBeUIsRUFBRSxFQUN4QixFQUFFO0lBQ3ZCLElBQUksQ0FBQyxlQUFlLElBQUksZUFBZSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRTFFLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztJQUNyQyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFFM0IsS0FBSyxNQUFNLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUMxRSxNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQzdDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQzVDLENBQUM7UUFDRixJQUFJLGdCQUFnQixDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkQsY0FBYyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO1FBQ3RELENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUMvQixXQUFtQixrQkFBa0IsRUFBRSxFQUNwQixFQUFFO0lBQ3JCLElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBYSxDQUFDO0lBQ3ZELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ysc0NBQXNDO1FBQ3RDLElBQUssS0FBK0IsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ25FLENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsT0FBTyxFQUFjLENBQUM7SUFDeEIsQ0FBQztBQUNILENBQUMsQ0FBQyJ9