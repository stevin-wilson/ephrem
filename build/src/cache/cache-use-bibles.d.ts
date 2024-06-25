import { BiblesCache, loadCacheOptions } from './cache-types.js';
export declare const loadBiblesCache: (options?: loadCacheOptions) => Promise<BiblesCache>;
export declare const saveBiblesCache: (biblesCache: BiblesCache, cacheDir?: string) => Promise<void>;
export declare const languageInBiblesCache: (language: string, biblesCache: BiblesCache) => boolean;
