import { Cache, PassageOptions, PassageQuery, Passages } from '../types.js';
import { AxiosRequestConfig } from 'axios';
/**
 * Saves passages to a cache directory.
 * @param passages - The passages to be saved.
 * @param [cacheDir] - The directory where the passages will be saved. If not specified, the default cache directory will be used.
 * @returns - A Promise that resolves once the passages are saved.
 */
export declare const savePassages: (passages: Passages, cacheDir?: string) => Promise<void>;
/**
 * Asynchronously loads passages from cache.
 * @param cacheDir - The directory where the cache file is located. Defaults to `defaultCacheDir`.
 * @param [maxAgeDays] - The maximum age (in days) of the passages to consider valid. If not provided, all passages will be returned.
 * @param [currentTimestamp] - The current timestamp used for calculating passage age. If not provided, the current date and time will be used.
 * @returns - A Promise that resolves to the loaded passages.
 */
export declare const loadPassages: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<Passages>;
export declare const passageQueriesAreEqual: (query1: PassageQuery, query2: PassageQuery) => boolean;
/**
 * Updates the passage in the cache with the given passageID and bibleAbbreviation.
 * @param passageID - The unique identifier of the passage.
 * @param bibleAbbreviation - The abbreviation of the bible.
 * @param cache - The cache object that holds the passages and bibles.
 * @param [passageOptions] - The options to include in the passage query.
 * @param [config] - The config object for the Axios request.
 * @param [timestamp] - The timestamp of the update.
 * @throws {Error} if the bibleID cannot be found in the cache.
 * @returns - A Promise that resolves when the passage is updated in the cache.
 */
export declare const updatePassage: (passageID: string, bibleAbbreviation: string, cache: Cache, passageOptions?: PassageOptions, config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
