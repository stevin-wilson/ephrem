import { fetchBibles } from './api-bible.js';
import { defaultCacheDir, cleanUpOldRecords, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
// - - - - - - - - - -
//  Abbreviation -> Bible
const getBiblesCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/bibles.json`;
};
// - - - - - - - - - -
// serialize the BooksToChapters map to JSON
const serializeBibles = (bibles) => {
    const obj = Array.from(bibles.entries()).map(([bibleAbbreviation, value]) => ({
        bibleAbbreviation: bibleAbbreviation,
        id: value.id,
        dblId: value.dblId,
        name: value.name,
        nameLocal: value.nameLocal,
        language: value.language,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
// - - - - - - - - - -
export const saveBibles = async (bibles, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBiblesCachePath(cacheDir), serializeBibles(bibles));
};
// - - - - - - - - - -
// deserialize JSON back to a BooksToChapters map
const deserializeBibles = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAbbreviation;
        const value = {
            id: item.id,
            dblId: item.dblId,
            name: item.name,
            nameLocal: item.nameLocal,
            language: item.language,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
// - - - - - - - - - -
export const loadBibles = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
        return cleanUpOldRecords(deserializeBibles(jsonData), max_age_days);
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
export const updateBibles = async (languages, bibles, config = {}) => {
    for (const language of languages) {
        const bibleResponses = await fetchBibles(language, config);
        for (const bibleResponse of bibleResponses) {
            const bibleObj = {
                id: bibleResponse.id,
                dblId: bibleResponse.dblId,
                name: bibleResponse.name,
                nameLocal: bibleResponse.nameLocal,
                language: bibleResponse.language,
                cachedOn: new Date(),
            };
            bibles.set(bibleResponse.abbreviation, bibleObj);
        }
    }
};
// - - - - - - - - - -
const isSupportedBible = async (bibleAbbreviation, languages, bibles, config = {}) => {
    if (!bibles.has(bibleAbbreviation)) {
        await updateBibles(languages, bibles, config);
    }
    for (const [bibleAbbreviationSupported, bibleDetails] of bibles) {
        if (bibleAbbreviation === bibleAbbreviationSupported &&
            languages.includes(bibleDetails.language.id)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYmlibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZUFBZSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5RSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHMUIsc0JBQXNCO0FBQ3RCLHlCQUF5QjtBQUV6QixNQUFNLGtCQUFrQixHQUFHLENBQUMsV0FBbUIsZUFBZSxFQUFFLEVBQUU7SUFDaEUsT0FBTyxHQUFHLFFBQVEsY0FBYyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0Qiw0Q0FBNEM7QUFDNUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFjLEVBQVUsRUFBRTtJQUNqRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDMUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLGlCQUFpQixFQUFFLGlCQUFpQjtRQUNwQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDWixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7UUFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztRQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7UUFDeEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO0tBQ3ZDLENBQUMsQ0FDSCxDQUFDO0lBQ0YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FB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