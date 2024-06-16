import { PassageQuery, Passages } from '../types.js';
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
