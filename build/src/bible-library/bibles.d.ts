import { AxiosRequestConfig } from 'axios';
import { Bibles } from '../types.js';
export declare const saveBibles: (bibles: Bibles, cacheDir?: string) => Promise<void>;
export declare const loadBibles: (cacheDir?: string, max_age_days?: number) => Promise<Bibles>;
export declare const updateBibles: (languages: string[], bibles: Bibles, config?: AxiosRequestConfig) => Promise<void>;
