// - - - - - - - - - -
import {AxiosRequestConfig} from 'axios';
import {fetchBibles} from './api-bible.js';
import {defaultCacheDir, cleanUpOldRecords, writeJsonFile} from '../utils.js';
import fs from 'fs-extra';
import {Bible, BibleAbbreviation, BibleResponse, Bibles} from '../types.js';

// - - - - - - - - - -
//  Abbreviation -> Bible

const getBiblesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/bibles.json`;
};

// - - - - - - - - - -
// serialize the BooksToChapters map to JSON
const serializeBibles = (bibles: Bibles): string => {
  const obj = Array.from(bibles.entries()).map(
    ([bibleAbbreviation, value]) => ({
      bibleAbbreviation: bibleAbbreviation,
      id: value.id,
      dblId: value.dblId,
      name: value.name,
      nameLocal: value.nameLocal,
      language: value.language,
      cachedOn: value.cachedOn.toISOString(),
    })
  );
  return JSON.stringify(obj, null, 2);
};

// - - - - - - - - - -
export const saveBibles = async (
  bibles: Bibles,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(getBiblesCachePath(cacheDir), serializeBibles(bibles));
};

// - - - - - - - - - -
// deserialize JSON back to a BooksToChapters map
const deserializeBibles = (jsonData: string): Bibles => {
  const arr = JSON.parse(jsonData);
  const map: Bibles = new Map();

  arr.forEach((item: any) => {
    const key: BibleAbbreviation = item.bibleAbbreviation;
    const value: Bible = {
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
export const loadBibles = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<Bibles> => {
  try {
    const jsonData = await fs.readFile(getBiblesCachePath(cacheDir), 'utf-8');
    const bibles = deserializeBibles(jsonData);
    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanUpOldRecords(bibles, maxAgeDays);
    } else {
      return bibles;
    }
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as Bibles;
  }
};

// - - - - - - - - - -
export const updateBibles = async (
  languages: string[],
  bibles: Bibles,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  for (const language of languages) {
    const currentDateTime = new Date();
    const bibleResponses: BibleResponse[] = await fetchBibles(language, config);

    for (const bibleResponse of bibleResponses) {
      const bibleObj: Bible = {
        id: bibleResponse.id,
        dblId: bibleResponse.dblId,
        name: bibleResponse.name,
        nameLocal: bibleResponse.nameLocal,
        language: bibleResponse.language,
        cachedOn: currentDateTime,
      };
      bibles.set(bibleResponse.abbreviation, bibleObj);
    }
  }
};
