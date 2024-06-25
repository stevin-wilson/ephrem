import { cleanBibles, loadBibles, saveBibles } from './cache-bibles.js';
import { cleanBookNamesCache, loadBookNames, saveBookNames, } from './cache-book-names.js';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
export const loadBiblesCache = async (options = {}) => {
    const { cacheDir = getDefaultCacheDir(), maxCacheAgeDays = getDefaultMaxCacheAgeDays(), timestamp = new Date(), } = options;
    let bibles = await loadBibles(cacheDir);
    let bookNames = await loadBookNames(cacheDir);
    let updatedBiblesSinceLoad = false;
    let updatedBookNamesSinceLoad = false;
    if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
        [bibles, updatedBiblesSinceLoad] = cleanBibles(bibles, timestamp, maxCacheAgeDays);
        [bookNames, updatedBookNamesSinceLoad] = cleanBookNamesCache(bookNames, timestamp, maxCacheAgeDays);
    }
    const updatedSinceLoad = updatedBiblesSinceLoad || updatedBookNamesSinceLoad;
    return {
        bibles,
        bookNames,
        updatedSinceLoad,
    };
};
export const saveBiblesCache = async (biblesCache, cacheDir = getDefaultCacheDir()) => {
    if (!biblesCache.updatedSinceLoad) {
        return;
    }
    let savedAll = true;
    try {
        await saveBibles(biblesCache.bibles, cacheDir);
    }
    catch (error) {
        savedAll = false;
        console.error('Error saving bibles to biblesCache', error);
    }
    try {
        await saveBookNames(biblesCache.bookNames, cacheDir);
    }
    catch (error) {
        savedAll = false;
        console.error('Error saving bookNames to biblesCache', error);
    }
    if (savedAll) {
        biblesCache.updatedSinceLoad = false;
    }
};
const languageInBibles = (language, bibles) => {
    return Object.values(bibles).some(bible => bible.language === language);
};
const languageInBookNames = (language, bookNames) => {
    for (const bookReferences of Object.values(bookNames)) {
        for (const bookReference of bookReferences) {
            if (bookReference.language === language) {
                return true;
            }
        }
    }
    return false;
};
export const languageInBiblesCache = (language, biblesCache) => {
    if (!languageInBibles(language, biblesCache.bibles)) {
        return false;
    }
    return languageInBookNames(language, biblesCache.bookNames);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXNlLWJpYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYWNoZS9jYWNoZS11c2UtYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE9BQU8sRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RFLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRS9FLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQ2xDLFVBQTRCLEVBQUUsRUFDUixFQUFFO0lBQ3hCLE1BQU0sRUFDSixRQUFRLEdBQUcsa0JBQWtCLEVBQUUsRUFDL0IsZUFBZSxHQUFHLHlCQUF5QixFQUFFLEVBQzdDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxHQUN2QixHQUFHLE9BQU8sQ0FBQztJQUVaLElBQUksTUFBTSxHQUFXLE1BQU0sVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELElBQUksU0FBUyxHQUFjLE1BQU0sYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELElBQUksc0JBQXNCLEdBQUcsS0FBSyxDQUFDO0lBQ25DLElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDO0lBRXRDLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDMUQsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLENBQUMsR0FBRyxXQUFXLENBQzVDLE1BQU0sRUFDTixTQUFTLEVBQ1QsZUFBZSxDQUNoQixDQUFDO1FBRUYsQ0FBQyxTQUFTLEVBQUUseUJBQXlCLENBQUMsR0FBRyxtQkFBbUIsQ0FDMUQsU0FBUyxFQUNULFNBQVMsRUFDVCxlQUFlLENBQ2hCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxnQkFBZ0IsR0FBRyxzQkFBc0IsSUFBSSx5QkFBeUIsQ0FBQztJQUU3RSxPQUFPO1FBQ0wsTUFBTTtRQUNOLFNBQVM7UUFDVCxnQkFBZ0I7S0FDakIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQ2xDLFdBQXdCLEVBQ3hCLFdBQW1CLGtCQUFrQixFQUFFLEVBQ3hCLEVBQUU7SUFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xDLE9BQU87SUFDVCxDQUFDO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQztRQUNILE1BQU0sVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELElBQUksUUFBUSxFQUFFLENBQUM7UUFDYixXQUFXLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBZ0IsRUFBRSxNQUFjLEVBQVcsRUFBRTtJQUNyRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQztBQUMxRSxDQUFDLENBQUM7QUFFRixNQUFNLG1CQUFtQixHQUFHLENBQzFCLFFBQWdCLEVBQ2hCLFNBQW9CLEVBQ1gsRUFBRTtJQUNYLEtBQUssTUFBTSxjQUFjLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQ3RELEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFLENBQUM7WUFDM0MsSUFBSSxhQUFhLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUN4QyxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsQ0FDbkMsUUFBZ0IsRUFDaEIsV0FBd0IsRUFDZixFQUFFO0lBQ1gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNwRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxPQUFPLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDIn0=