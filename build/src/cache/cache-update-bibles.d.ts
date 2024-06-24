import { BiblesCache, GetBibleIdOptions, UpdateBiblesCacheOptions, UpdateBiblesOptions, UpdateBookNamesOptions } from './cache-types.js';
export declare const needsBiblesCacheUpdate: (biblesCache: BiblesCache, bibleAbbreviation?: string, languages?: string[]) => boolean;
export declare const updateBibles: (options: UpdateBiblesOptions) => Promise<void>;
export declare const updateBookNames: (options: UpdateBookNamesOptions) => Promise<void>;
export declare const updateBiblesCache: (options: UpdateBiblesCacheOptions) => Promise<void>;
export declare const getBibleID: (options: GetBibleIdOptions) => Promise<string>;
