import { AxiosRequestConfig } from 'axios';
import { Bibles, Cache } from '../types.js';
/**
 * Saves the Bibles object to the specified cache directory in JSON format.
 * If no cache directory is provided, the default cache directory will be used.
 * @param bibles - The Bibles object to be saved.
 * @param [cacheDir] - The cache directory path.
 * @returns - A Promise that resolves when the Bibles object is successfully saved.
 */
export declare const saveBibles: (bibles: Bibles, cacheDir?: string) => Promise<void>;
/**
 * Loads the Bibles from the cache directory.
 * @param cacheDir - The cache directory path. Default value is defaultCacheDir.
 * @param [maxAgeDays] - The maximum age of the cached Bibles in days.
 * @param [currentTimestamp] - The current timestamp.
 * @returns - A promise that resolves to the loaded Bibles.
 */
export declare const loadBibles: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<Bibles>;
/**
 * Updates bibles in the cache for the specified languages.
 * @param languages - The ISO 639-3 three digit language codes for which to update the bibles.
 * @param cache - The cache object where the bibles will be updated.
 * @param [biblesToExclude] - The list of bible abbreviations to exclude from the update.
 * @param [config] - The Axios request configuration options.
 * @param [timestamp] - The timestamp for the bible update.
 * @returns - A promise that resolves once the bibles have been updated.
 */
export declare const updateBibles: (languages: string[], cache: Cache, biblesToExclude?: string[], config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
