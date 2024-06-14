import { Cache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
/**
 * Loads the cache from the cache directory and returns a Promise that resolves to the Cache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data. If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded Cache object.
 */
export declare const loadCache: (cacheDir?: string, maxAgeDays?: number) => Promise<Cache>;
/**
 * Saves the cache data to the specified cache directory.
 * @param cache - The cache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export declare const saveCache: (cache: Cache, cacheDir?: string) => Promise<void>;
/**
 * Clear cache by resetting all cache properties and setting `updatedSinceLoad` to `true`.
 * @param cache - The cache object to be cleared.
 */
export declare const clearCache: (cache: Cache) => void;
/**
 * Updates the cache with new data for specified languages.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param cache - The cache object to update.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @returns - A promise that resolves when the cache is updated.
 */
export declare const updateCache: (languages: string[], cache: Cache, forceUpdate?: boolean, biblesToExclude?: string[], config?: AxiosRequestConfig) => Promise<void>;
/**
 * Loads cache, updates and then saves it.
 * @async
 * @param languages - The list of ISO 639-3 three digit language codes to update in the cache.
 * @param [forceUpdate] - Flag indicating whether to force the update for all languages.
 * @param [biblesToExclude] - The list of bibles to exclude from the update.
 * @param [config] - Additional configuration options for the update request.
 * @param [cacheDir] - The cache directory to load from.
 * @returns - A promise that resolves when the cache is loaded, updated, and saved successfully.
 */
export declare const loadUpdateSaveCache: (languages: string[], forceUpdate?: boolean, biblesToExclude?: string[], config?: AxiosRequestConfig, cacheDir?: string) => Promise<void>;
