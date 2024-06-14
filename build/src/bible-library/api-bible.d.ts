import 'dotenv/config';
import { AxiosRequestConfig } from 'axios';
import { BibleResponse, BookResponse, PassageAndFumsResponse, PassageOptions } from '../types.js';
/**
 * Fetches the available Bibles based on the provided language.
 * @param language - ISO 639-3 three digit language code for the desired language.
 * @param [config] - Optional configuration for the API request.
 * @returns - A Promise that resolves to an array of BibleResponse objects.
 */
export declare const fetchBibles: (language: string, config?: AxiosRequestConfig) => Promise<BibleResponse[]>;
/**
 * Fetches the available books for a given bible ID.
 * @param bibleID - The ID of the bible.
 * @param [config] - The Axios request configuration options (optional).
 * @returns - A Promise that resolves with an array of BookResponse objects.
 */
export declare const fetchBooks: (bibleID: string, config?: AxiosRequestConfig) => Promise<BookResponse[]>;
/**
 * Fetches a Bible passage by ID and Bible ID.
 * @async
 * @param passageID - The ID of the passage to fetch.
 * @param bibleID - The ID of the Bible from which to fetch the passage.
 * @param [passageOptions] - Optional parameters for fetching the passage.
 * @param [config] - Optional configuration for the Axios HTTP client.
 * @returns - A promise that resolves to the fetched passage and Fums (Find, Usages, Metadata, and Statistics) response.
 * @throws {PassageError} - If an error occurs during the passage fetch, a PassageError is thrown with relevant error details.
 */
export declare const fetchPassage: (passageID: string, bibleID: string, passageOptions?: PassageOptions, config?: AxiosRequestConfig) => Promise<PassageAndFumsResponse>;
