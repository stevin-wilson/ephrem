import { fetchBibles } from './api-bible.js';
import { defaultCacheDir, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
// - - - - - - - - - -
//  Abbreviation -> Bible
const getBiblesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/bibles.json`;
};
// - - - - - - - - - -
// serialize the BooksToChapters map to JSON
export const saveBibles = async (bibles, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBiblesCachePath(cacheDir), JSON.stringify(bibles, null, 2));
};
// - - - - - - - - - -
// deserialize JSON back to a BooksToChapters map
const cleanBiblesCache = (bibles, maxAgeDays = 14, currentTimestamp) => {
    let thresholdDate = currentTimestamp;
    if (thresholdDate === undefined) {
        thresholdDate = new Date();
    }
    thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
    const cleanedBibles = {};
    for (const abbreviation of Object.keys(bibles)) {
        const bible = bibles[abbreviation];
        if (bible.cachedOn > thresholdDate) {
            cleanedBibles[abbreviation] = bible;
        }
    }
    return cleanedBibles;
};
// - - - - - - - - - -
export const loadBibles = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
        const bibles = JSON.parse(jsonData);
        if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
            return cleanBiblesCache(bibles, maxAgeDays, currentTimestamp);
        }
        else {
            return bibles;
        }
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
// - - - - - - - - - -
export const updateBibles = async (languages, cache, biblesToExclude = [], config = {}, timestamp) => {
    if (timestamp === undefined) {
        timestamp = new Date();
    }
    for (const language of languages) {
        const bibleResponses = await fetchBibles(language, config);
        for (const bibleResponse of bibleResponses) {
            if (biblesToExclude.includes(bibleResponse.abbreviation)) {
                continue;
            }
            cache.bibles[bibleResponse.abbreviation] = {
                id: bibleResponse.id,
                language: bibleResponse.language.id,
                scriptDirection: bibleResponse.language.scriptDirection,
                cachedOn: timestamp,
            };
        }
    }
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMzRCxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHMUIsc0JBQXNCO0FBQ3RCLHlCQUF5QjtBQUV6QixNQUFNLGtCQUFrQixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDaEUsT0FBTyxHQUFHLFFBQVEsY0FBYyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0Qiw0Q0FBNEM7QUFDNUMsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFDN0IsTUFBYyxFQUNkLFdBQW1CLGVBQWUsRUFDbEMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNoQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLGlEQUFpRDtBQUNqRCxNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLE1BQWMsRUFDZCxVQUFVLEdBQUcsRUFBRSxFQUNmLGdCQUF1QixFQUNmLEVBQUU7SUFDVixJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztJQUNyQyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNoQyxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBQ0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFFNUQsTUFBTSxhQUFhLEdBQVcsRUFBRSxD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