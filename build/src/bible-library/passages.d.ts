import { Cache, PassageOptions, PassageQuery, Passages } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const savePassages: (passages: Passages, cacheDir?: string) => Promise<void>;
export declare const loadPassages: (cacheDir?: string, maxAgeDays?: number, currentTimestamp?: Date) => Promise<Passages>;
export declare const passageQueriesAreEqual: (query1: PassageQuery, query2: PassageQuery) => boolean;
export declare const updatePassage: (passageID: string, bibleAbbreviation: string, cache: Cache, passageOptions?: PassageOptions, config?: AxiosRequestConfig, timestamp?: Date) => Promise<void>;
