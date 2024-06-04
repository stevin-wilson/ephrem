import { Cache } from '../types.js';
export declare const loadCache: (cacheDir?: string, maxAgeDays?: number) => Promise<Cache>;
export declare const saveCache: (cache: Cache, cacheDir?: string) => Promise<void>;
