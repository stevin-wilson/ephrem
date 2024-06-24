import { cleanBibles, loadBibles, saveBibles } from './cache-bibles.js';
import { cleanBookNamesCache, loadBookNames, saveBookNames, } from './cache-book-names.js';
import { getDefaultCacheDir, getDefaultMaxCacheAgeDays } from './cache-utils.js';
export const loadBiblesCache = async (cacheDir = getDefaultCacheDir(), maxCacheAgeDays = getDefaultMaxCacheAgeDays(), currentTimestamp = new Date()) => {
    let bibles = await loadBibles(cacheDir);
    let bookNames = await loadBookNames(cacheDir);
    let updatedBiblesSinceLoad = false;
    let updatedBookNamesSinceLoad = false;
    if (maxCacheAgeDays !== undefined && maxCacheAgeDays >= 0) {
        [bibles, updatedBiblesSinceLoad] = cleanBibles(bibles, currentTimestamp, maxCacheAgeDays);
        [bookNames, updatedBookNamesSinceLoad] = cleanBookNamesCache(bookNames, currentTimestamp, maxCacheAgeDays);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtdXNlLWJpYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYWNoZS9jYWNoZS11c2UtYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RFLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRS9FLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQ2xDLFdBQW1CLGtCQUFrQixFQUFFLEVBQ3ZDLGtCQUFzQyx5QkFBeUIsRUFBRSxFQUNqRSxnQkFBZ0IsR0FBRyxJQUFJLElBQUksRUFBRSxFQUNQLEVBQUU7SUFDeEIsSUFBSSxNQUFNLEdBQVcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsSUFBSSxTQUFTLEdBQWMsTUFBTSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekQsSUFBSSxzQkFBc0IsR0FBRyxLQUFLLENBQUM7SUFDbkMsSUFBSSx5QkFBeUIsR0FBRyxLQUFLLENBQUM7SUFFdEMsSUFBSSxlQUFlLEtBQUssU0FBUyxJQUFJLGVBQWUsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMxRCxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxHQUFHLFdBQVcsQ0FDNUMsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixlQUFlLENBQ2hCLENBQUM7UUFFRixDQUFDLFNBQVMsRUFBRSx5QkFBeUIsQ0FBQyxHQUFHLG1CQUFtQixDQUMxRCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGVBQWUsQ0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLGdCQUFnQixHQUFHLHNCQUFzQixJQUFJLHlCQUF5QixDQUFDO0lBRTdFLE9BQU87UUFDTCxNQUFNO1FBQ04sU0FBUztRQUNULGdCQUFnQjtLQUNqQixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFDbEMsV0FBd0IsRUFDeEIsV0FBbUIsa0JBQWtCLEVBQUUsRUFDeEIsRUFBRTtJQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDbEMsT0FBTztJQUNULENBQUM7SUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDcEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNiLFdBQVcsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDdkMsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBVyxFQUFFO0lBQ3JFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQztBQUVGLE1BQU0sbUJBQW1CLEdBQUcsQ0FDMUIsUUFBZ0IsRUFDaEIsU0FBb0IsRUFDWCxFQUFFO0lBQ1gsS0FBSyxNQUFNLGNBQWMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDdEQsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMzQyxJQUFJLGFBQWEsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3hDLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxDQUNuQyxRQUFnQixFQUNoQixXQUF3QixFQUNmLEVBQUU7SUFDWCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU8sbUJBQW1CLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUMifQ==