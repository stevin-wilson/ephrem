import { loadCacheOptions, PassagesCache } from './cache-types.js';
export declare const getPassageAndBible: (passageID: string, bibleAbbreviation: string) => string;
export declare const loadPassagesCache: (options?: loadCacheOptions) => Promise<PassagesCache>;
export declare const savePassagesCache: (passagesCache: PassagesCache, cacheDir?: string) => Promise<void>;
