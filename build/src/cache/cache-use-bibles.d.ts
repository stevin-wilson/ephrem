import { BiblesCache } from './cache-types.js';
export declare const loadBiblesCache: (cacheDir?: string, maxCacheAgeDays?: number | undefined, currentTimestamp?: Date) => Promise<BiblesCache>;
export declare const saveBiblesCache: (biblesCache: BiblesCache, cacheDir?: string) => Promise<void>;
export declare const languageInBiblesCache: (language: string, biblesCache: BiblesCache) => boolean;
