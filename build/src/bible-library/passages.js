// - - - - - - - - - -
import { defaultCacheDir, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
import { fetchPassage } from './api-bible.js';
const getPassagesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/passages.json`;
};
// - - - - - - - - - -
// serialize Passages to JSON
export const savePassages = async (passages, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getPassagesCachePath(cacheDir), JSON.stringify(passages, null, 2));
};
// - - - - - - - - - -
// deserialize JSON back to a Passages
const cleanPassagesCache = (passages, maxAgeDays = 14, currentTimestamp) => {
    let thresholdDate = currentTimestamp;
    if (thresholdDate === undefined) {
        thresholdDate = new Date();
    }
    thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
    const cleanedPassages = {};
    for (const [passageAndBible, Passages] of Object.entries(passages)) {
        const filteredPassages = Passages.filter(passage => passage.cachedOn > thresholdDate);
        if (filteredPassages.length === 0) {
            continue;
        }
        cleanedPassages[passageAndBible] = filteredPassages;
    }
    return cleanedPassages;
};
export const loadPassages = async (cacheDir = defaultCacheDir, maxAgeDays, currentTimestamp) => {
    try {
        const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
        const passages = JSON.parse(jsonData);
        if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
            return cleanPassagesCache(passages, maxAgeDays, currentTimestamp);
        }
        else {
            return passages;
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
const getPassageAndBible = (passageID, bibleAbbreviation) => `${passageID}@${bibleAbbreviation}`;
// - - - - - - - - - -
export const passageQueriesAreEqual = (query1, query2) => {
    return (query1.passageID === query2.passageID &&
        query1.bibleID === query2.bibleID &&
        query1.contentType === query2.contentType &&
        query1.includeNotes === query2.includeNotes &&
        query1.includeTitles === query2.includeTitles &&
        query1.includeChapterNumbers === query2.includeChapterNumbers &&
        query1.includeVerseNumbers === query2.includeVerseNumbers &&
        query1.includeVerseSpans === query2.includeVerseSpans);
};
// - - - - - - - - - -
const getPassage = async (passageID, bibleID, passageOptions = {}, config = {}, timestamp) => {
    if (timestamp === undefined) {
        timestamp = new Date();
    }
    const passageAndFums = await fetchPassage(passageID, bibleID, passageOptions, config);
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    return {
        query: passageQuery,
        reference: passageAndFums.data.reference,
        content: passageAndFums.data.content,
        copyright: passageAndFums.data.copyright,
        fums: passageAndFums.meta.fums,
        cachedOn: timestamp,
    };
};
// - - - - - - - - - -
export const updatePassage = async (passageID, bibleAbbreviation, cache, passageOptions = {}, config = {}, timestamp) => {
    const bibleID = cache.bibles[bibleAbbreviation]?.id;
    if (!bibleID) {
        throw Error;
    }
    const passageAndBible = getPassageAndBible(passageID, bibleAbbreviation);
    const passageQuery = {
        passageID,
        bibleID,
        ...passageOptions,
    };
    const passages = cache.passages[passageAndBible];
    if (passages === undefined || passages.length === 0) {
        const newPassage = await getPassage(passageID, bibleID, passageOptions, config, timestamp);
        cache.passages[passageAndBible] = [newPassage];
    }
    else {
        let addedToPassages = false;
        for (const passage of passages) {
            if (passageQueriesAreEqual(passage.query, passageQuery)) {
                addedToPassages = true;
                break;
            }
        }
        if (!addedToPassages) {
            const newPassage = await getPassage(passageID, bibleID, passageOptions, config, timestamp);
            passages.push(newPassage);
            cache.passages[passageAndBible] = passages;
        }
    }
    cache.updatedSinceLoad = true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFFdEIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFRM0QsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTFCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxNQUFNLG9CQUFvQixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDbEUsT0FBTyxHQUFHLFFBQVEsZ0JBQWdCLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLDZCQUE2QjtBQUM3QixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUMvQixRQUFrQixFQUNsQixXQUFtQixlQUFlLEVBQ2xDLEVBQUU7SUFDRixNQUFNLGFBQWEsQ0FDakIsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEVBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDbEMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0QixzQ0FBc0M7QUFDdEMsTUFBTSxrQkFBa0IsR0FBRyxDQUN6QixRQUFrQixFQUNsQixVQUFVLEdBQUcsRUFBRSxFQUNmLGdCQUF1QixFQUNiLEVBQUU7SUFDWixJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztJQUNyQyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNoQyxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBQ0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFFNUQsTUFBTSxlQUFlLEdBQWEsRUFBRSxDQUFD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