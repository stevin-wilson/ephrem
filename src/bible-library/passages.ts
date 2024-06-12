// - - - - - - - - - -

import {
  cleanUpOldRecords,
  defaultCacheDir,
  sortObject,
  writeJsonFile,
} from '../utils.js';
import {
  Cache,
  Fums,
  Passage,
  PassageOptions,
  PassageQuery,
  PassageQueryString,
  Passages,
  PassageText,
} from '../types.js';
import fs from 'fs-extra';
import {AxiosRequestConfig} from 'axios';
import {fetchPassage} from './api-bible.js';

export const getStringForPassageQuery = (
  passageQuery: PassageQuery
): string => {
  const sortedPassageQuery = sortObject(passageQuery);
  return JSON.stringify(sortedPassageQuery);
};

const getPassagesCachePath = (cacheDir: string = defaultCacheDir) => {
  return `${cacheDir}/passages.json`;
};

const serializePassages = (map: Passages): string => {
  const arr = Array.from(map.entries()).map(([key, value]) => ({
    passageQuery: JSON.parse(key),
    passage: value,
  }));
  return JSON.stringify(arr, null, 2);
};

export const savePassages = async (
  passages: Passages,
  cacheDir: string = defaultCacheDir
) => {
  await writeJsonFile(
    getPassagesCachePath(cacheDir),
    serializePassages(passages)
  );
};

// - - - - - - - - - -
const deserializePassages = (json: string): Passages => {
  const arr = JSON.parse(json);
  const map: Passages = new Map();

  arr.forEach((item: any) => {
    const key: PassageQueryString = getStringForPassageQuery(item.passageQuery);
    const value: Passage = {
      text: item.passage.text,
      fums: item.passage.fums,
      cachedOn: new Date(item.passage.cachedOn),
    };
    map.set(key, value);
  });

  return map;
};

// - - - - - - - - - -
export const loadPassages = async (
  cacheDir: string = defaultCacheDir,
  maxAgeDays?: number
): Promise<Passages> => {
  try {
    const jsonData = await fs.readFile(getPassagesCachePath(cacheDir), 'utf-8');
    const passages = deserializePassages(jsonData);
    if (typeof maxAgeDays === 'number' && maxAgeDays >= 0) {
      return cleanUpOldRecords(passages, maxAgeDays);
    } else {
      return passages;
    }
  } catch (error) {
    // Type assertion to access error.code
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('Cache file not found, returning a new empty map.');
    } else {
      console.error('Error reading or parsing JSON file:', error);
    }
    return new Map() as Passages;
  }
};

// - - - - - - - - - -
export const updatePassage = async (
  passageID: string,
  bibleAbbreviation: string,
  cache: Cache,
  passageOptions: PassageOptions = {},
  config: AxiosRequestConfig = {}
): Promise<void> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    ...passageOptions,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (cache.passages.get(passageQueryString)?.text) {
    return;
  }

  const bibleID = cache.bibles.get(passageQuery.bibleAbbreviation)?.id;
  if (!bibleID) {
    throw Error;
  }

  const passageAndFums = await fetchPassage(
    passageID,
    bibleID,
    passageOptions,
    config
  );

  const passage: PassageText = {
    reference: passageAndFums.data.reference,
    content: passageAndFums.data.content,
    copyright: passageAndFums.data.copyright,
  };
  const fums: Fums = passageAndFums.meta.fums;
  const cachedOn: Date = new Date();
  const passageText: Passage = {text: passage, fums: fums, cachedOn: cachedOn};
  cache.passages.set(passageQueryString, passageText);
};
