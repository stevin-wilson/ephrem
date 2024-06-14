import { BookNameDetails, BookNames, BookResponse, Cache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
/**
 * Saves the book names to a cache file.
 * @param bookNames - The book names to be saved.
 * @param [cacheDir] - The directory where the cache file will be saved. Defaults to the default cache directory.
 * @returns - Resolves with no value on successful saving of the book names.
 */
export declare const saveBookNames: (bookNames: BookNames, cacheDir?: string) => Promise<void>;
/**
 * Loads the book names from the cache directory.
 * @param [cacheDir] - The cache directory path.
 * @param [maxAgeDays] - The maximum age of the cache in days. If provided,
 *    the cache will be cleaned before returning the book names.
 * @param [currentTimestamp] - The current timestamp to compare against
 *    the cache age. If not provided, the current date and time will be used.
 * @returns - A promise that resolves to the loaded book names.
 * @throws {Error} - If there is an error reading or parsing the JSON file.
 */
export declare const loadBookNames: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<BookNames>;
/**
 * Retrieves an array of book names, based on the provided book responses.
 * @param bookResponses - An array of book responses.
 * @returns - An array of book name details.
 */
export declare const getBookNames: (bookResponses: BookResponse[]) => BookNameDetails[];
/**
 * Updates the book names in the cache based on the provided languages.
 * @param languages - The list of ISO 639-3 three digit language codes to update the book names for.
 * @param cache - The cache object.
 * @param [config] - The Axios request configuration.
 * @param [timestamp] - The timestamp for the cache update.
 * @returns - A Promise that resolves once the book names are updated in the cache.
 */
export declare const updateBookNames: (languages: string[], cache: Cache, config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
