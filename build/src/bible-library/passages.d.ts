import { Bibles, PassageOptions, PassageQuery, Passages } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const getStringForPassageQuery: (passageQuery: PassageQuery) => string;
export declare const savePassages: (passages: Passages, cacheDir?: string) => Promise<void>;
export declare const loadPassages: (cacheDir?: string, max_age_days?: number) => Promise<Passages>;
export declare const updatePassage: (passageID: string, bibleAbbreviation: string, passages: Passages, bibles: Bibles, passageOptions?: PassageOptions, config?: AxiosRequestConfig) => Promise<void>;
