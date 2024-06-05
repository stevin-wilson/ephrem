import { BookNameMoreDetails, BookNames, BookResponse } from '../types.js';
export declare const saveBookNames: (bookNames: BookNames, cacheDir?: string) => Promise<void>;
export declare const loadBookNames: (cacheDir?: string, max_age_days?: number) => Promise<BookNames>;
export declare const getBookNames: (bookResponses: BookResponse[]) => BookNameMoreDetails[];
