import { BiblesCache, PassagesCache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const initializeBiblesCache: () => BiblesCache;
/**
 * Loads the cache of bibles and book name information from the cache directory and
 * returns a Promise that resolves to the BiblesCache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data.
 * If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded BiblesCache object.
 */
export declare const loadBiblesCache: (cacheDir?: string, maxAgeDays?: number) => Promise<BiblesCache>;
export declare const initializePassagesCache: () => PassagesCache;
/**
 * Loads the cache of passages from the cache directory and
 * returns a Promise that resolves to the PassagesCache object.
 * @param [cacheDir] - The cache directory to load from.
 * @param [maxAgeDays] - The maximum age in days of the cached data.
 * If provided, only cached data within this age will be loaded.
 * @returns A Promise that resolves to the loaded PassagesCache object.
 */
export declare const loadPassagesCache: (cacheDir?: string, maxAgeDays?: number) => Promise<PassagesCache>;
/**
 * Saves the BiblesCache data to the specified cache directory.
 * @param cache - The BiblesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export declare const saveBiblesCache: (cache: BiblesCache, cacheDir?: string) => Promise<void>;
/**
 * Saves the PassagesCache data to the specified cache directory.
 * @param cache - The PassagesCache object that contains the data to be saved.
 * @param [cacheDir] - The directory path where the cache data will be saved.
 * @returns - A promise that resolves when the cache data is successfully saved, or rejects with an error if saving fails.
 */
export declare const savePassagesCache: (cache: PassagesCache, cacheDir?: string) => Promise<void>;
/**
 * Checks if the given language is available in the cache.
 * @param language - The ISO 639-3 three digit language code to check for.
 * @param cache - The cache object.
 * @returns - A boolean indicating if the language is available in the cache.
 */
export declare const languageInBiblesCache: (language: string, cache: BiblesCache) => boolean;
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
export declare const updateBiblesCache: (languages: string[], cache: BiblesCache, forceUpdate?: boolean, biblesToExclude?: string[], config?: AxiosRequestConfig) => Promise<void>;
export declare const needsBiblesCacheUpdate: (bibleAbbreviation: string | undefined, languages: string[], cache: BiblesCache) => boolean;
