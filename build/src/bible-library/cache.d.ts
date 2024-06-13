import { Cache } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const loadCache: (cacheDir?: string, maxAgeDays?: number) => Promise<Cache>;
export declare const saveCache: (cache: Cache, cacheDir?: string) => Promise<void>;
export declare const clearCache: (cache: Cache) => void;
export declare const updateCache: (languages: string[], cache: Cache, forceUpdate?: boolean, biblesToExclude?: string[], config?: AxiosRequestConfig) => Promise<void>;
