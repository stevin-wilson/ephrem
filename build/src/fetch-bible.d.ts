import 'dotenv/config';
import { AxiosRequestConfig } from 'axios';
export interface Language {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: 'RTL' | 'LTR';
}
interface LanguageResponse extends Language {
    [key: string]: unknown;
}
export interface VerseResponse {
    id: string;
    [key: string]: unknown;
}
interface ChapterResponse {
    id: string;
    number: string;
    [key: string]: unknown;
}
export interface BookResponse {
    id: string;
    chapters: ChapterResponse[];
    [key: string]: unknown;
}
export interface BibleResponse {
    id: string;
    dblId: string;
    name: string;
    nameLocal: string;
    abbreviation: string;
    language: LanguageResponse;
    [key: string]: unknown;
}
/**
 *
 * @param language ISO code of language
 * @param options
 */
export declare function fetchBibles(language: string, config?: AxiosRequestConfig): Promise<BibleResponse[]>;
/**
 *
 // eslint-disable-next-line jsdoc/require-param-description
 * @param bibleID
 // eslint-disable-next-line jsdoc/require-param-description
 // eslint-disable-next-line jsdoc/require-param-description
 * @param config
 */
export declare function fetchBooksAndChapters(bibleID: string, config?: AxiosRequestConfig): Promise<BookResponse[]>;
export declare function fetchVerses(chapterID: string, bibleID: string, config?: AxiosRequestConfig): Promise<VerseResponse[]>;
interface PassageResponse {
    id: string;
    reference: string;
    content: string;
    copyright: string;
    [key: string]: unknown;
}
interface FumsResponse {
    fums: string;
    [key: string]: unknown;
}
interface PassageAndFumsResponse {
    data: PassageResponse;
    meta: FumsResponse;
    [key: string]: unknown;
}
export declare function fetchPassage(passageID: string, bibleID: string, contentType?: 'html' | 'json' | 'text', includeNotes?: boolean, includeTitles?: boolean, includeChapterNumbers?: boolean, includeVerseNumbers?: boolean, includeVerseSpans?: boolean, config?: AxiosRequestConfig): Promise<PassageAndFumsResponse>;
export {};
