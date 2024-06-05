import { Bibles, BiblesToBooks, BookNames, BooksToChapters, Cache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const loadCache: (cacheDir?: string, maxAgeDays?: number) => Promise<Cache>;
export declare const saveCache: (cache: Cache, cacheDir?: string) => Promise<void>;
export declare const prepareCacheForReferenceSearch: (languages: string[], bookNames: BookNames, biblesToBooks: BiblesToBooks, booksToChapters: BooksToChapters, bibles: Bibles, updateBiblesFromAPI?: boolean, skipIfLessThanNDays?: number, config?: AxiosRequestConfig) => Promise<void>;
export declare const updateBooksAndChapters: (bibleAbbreviations: string[], bookNames: BookNames, biblesToBooks: BiblesToBooks, booksToChapters: BooksToChapters, bibles: Bibles, config?: AxiosRequestConfig) => Promise<void>;
