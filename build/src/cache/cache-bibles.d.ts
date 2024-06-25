import { Bibles } from './cache-types.js';
import { BibleResponse } from '../api-bible/api-types.js';
export declare const saveBibles: (bibles: Bibles, cacheDir?: string) => Promise<void>;
export declare const cleanBibles: (bibles: Bibles, timestamp?: Date, maxCacheAgeDays?: number) => [Bibles, boolean];
export declare const loadBibles: (cacheDir?: string) => Promise<Bibles>;
export declare const prepareBibleData: (bibleResponse: BibleResponse, timestamp: Date) => Bibles;
