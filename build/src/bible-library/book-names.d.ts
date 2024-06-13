import { BookNameDetails, BookNames, BookResponse, Cache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const saveBookNames: (bookNames: BookNames, cacheDir?: string) => Promise<void>;
export declare const loadBookNames: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<BookNames>;
export declare const getBookNames: (bookResponses: BookResponse[]) => BookNameDetails[];
export declare const updateBookNames: (languages: string[], cache: Cache, config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
