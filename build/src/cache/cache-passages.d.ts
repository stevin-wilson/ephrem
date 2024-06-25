import { Passages } from './cache-types.js';
export declare const savePassages: (passages: Passages, cacheDir?: string) => Promise<void>;
export declare const cleanPassagesCache: (passages: Passages, timestamp?: Date, maxCacheAgeDays?: number) => [Passages, boolean];
export declare const loadPassages: (cacheDir?: string) => Promise<Passages>;
