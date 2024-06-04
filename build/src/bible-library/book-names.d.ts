import { Bibles, BiblesToBooks, BookNameMoreDetails, BookNames, BookResponse, BooksToChapters } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const saveBookNames: (bookNames: BookNames, cacheDir?: string) => Promise<void>;
export declare const loadBookNames: (cacheDir?: string, max_age_days?: number) => Promise<BookNames>;
export declare const getBookNames: (bookResponses: BookResponse[]) => BookNameMoreDetails[];
export declare const updateBiblesBooksAndChapters: (languages: string[], bookNames: BookNames, biblesToBooks: BiblesToBooks, booksToChapters: BooksToChapters, bibles: Bibles, updateBiblesFromAPI?: boolean, config?: AxiosRequestConfig) => Promise<void>;
