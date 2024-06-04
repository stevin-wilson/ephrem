// - - - - - - - - - -
import { cleanUpOldRecords, defaultCacheDir, sortObject, writeJsonFile, } from '../utils.js';
import fs from 'fs-extra';
import { fetchPassage } from './api-bible.js';
export const getStringForPassageQuery = (passageQuery) => {
    const sortedPassageQuery = sortObject(passageQuery);
    return JSON.stringify(sortedPassageQuery);
};
const getPassagesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/passages.json`;
};
const serializePassages = (map) => {
    const arr = Array.from(map.entries()).map(([key, value]) => ({
        passageQuery: JSON.parse(key),
        passage: value,
    }));
    return JSON.stringify(arr, null, 2);
};
export const savePassages = async (passages, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getPassagesCachePath(cacheDir), serializePassages(passages));
};
// - - - - - - - - - -
const deserializePassages = (json) => {
    const arr = JSON.parse(json);
    const map = new Map();
    arr.forEach((item) => {
        const key = getStringForPassageQuery(item.passageQuery);
        const value = {
            text: item.passage.text,
            fums: item.passage.fums,
            cachedOn: new Date(item.passage.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
// - - - - - - - - - -
export const loadPassages = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
        return cleanUpOldRecords(deserializePassages(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
// - - - - - - - - - -
export const updatePassage = async (passageID, bibleAbbreviation, passages, bibles, passageOptions = {}, config = {}) => {
    const passageQuery = {
        passageID,
        bibleAbbreviation,
        ...passageOptions,
    };
    const passageQueryString = getStringForPassageQuery(passageQuery);
    if (passages.get(passageQueryString)?.text) {
        return;
    }
    const bibleID = bibles.get(passageQuery.bibleAbbreviation)?.id;
    if (!bibleID) {
        throw Error;
    }
    const passageAndFums = await fetchPassage(passageID, bibleID, passageOptions, config);
    const passage = {
        reference: passageAndFums.data.reference,
        content: passageAndFums.data.content,
        copyright: passageAndFums.data.copyright,
    };
    const fums = passageAndFums.meta.fums;
    const cachedOn = new Date();
    const passageText = { text: passage, fums: fums, cachedOn: cachedOn };
    passages.set(passageQueryString, passageText);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9wYXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFFdEIsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsVUFBVSxFQUNWLGFBQWEsR0FDZCxNQUFNLGFBQWEsQ0FBQztBQVdyQixPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTVDLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLENBQ3RDLFlBQTBCLEVBQ2xCLEVBQUU7SUFDVixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFFRixNQUFNLG9CQUFvQixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDbEUsT0FBTyxHQUFHLFFBQVEsZ0JBQWdCLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEdBQWEsRUFBVSxFQUFFO0lBQ2xELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0QsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzdCLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDSixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixNQUFN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