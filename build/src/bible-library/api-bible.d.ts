import 'dotenv/config';
import { AxiosRequestConfig } from 'axios';
import { BibleResponse, BookResponse, PassageAndFumsResponse, PassageOptions } from '../types.js';
export declare const fetchBibles: (language: string, config?: AxiosRequestConfig) => Promise<BibleResponse[]>;
export declare const fetchBooks: (bibleID: string, config?: AxiosRequestConfig) => Promise<BookResponse[]>;
export declare const fetchPassage: (passageID: string, bibleID: string, passageOptions?: PassageOptions, config?: AxiosRequestConfig) => Promise<PassageAndFumsResponse>;
