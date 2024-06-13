import { AxiosRequestConfig } from 'axios';
import { Bibles, Cache } from '../types.js';
export declare const saveBibles: (bibles: Bibles, cacheDir?: string) => Promise<void>;
export declare const loadBibles: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<Bibles>;
export declare const updateBibles: (languages: string[], cache: Cache, biblesToExclude?: string[], config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
