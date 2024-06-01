import 'dotenv/config';
import { AxiosRequestConfig } from 'axios';
export type ScriptDirection = 'RTL' | 'LTR';
export interface Language {
    readonly id: string;
    readonly name: string;
    readonly nameLocal: string;
    readonly script: string;
    readonly scriptDirection: ScriptDirection;
}
interface LanguageResponse extends Language {
    readonly [key: string]: unknown;
}
export interface VerseResponse {
    readonly id: string;
    readonly [key: string]: unknown;
}
export interface ChapterResponse {
    readonly id: string;
    readonly number: string;
    readonly [key: string]: unknown;
}
export interface BookResponse {
    readonly id: string;
    readonly chapters: ChapterResponse[];
    readonly [key: string]: unknown;
}
export interface BibleResponse {
    readonly id: string;
    readonly dblId: string;
    readonly name: string;
    readonly nameLocal: string;
    readonly abbreviation: string;
    readonly language: LanguageResponse;
    readonly [key: string]: unknown;
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
    readonly id: string;
    readonly reference: string;
    readonly content: string;
    readonly copyright: string;
    readonly [key: string]: unknown;
}
interface FumsResponse {
    readonly fums: string;
    readonly [key: string]: unknown;
}
interface PassageAndFumsResponse {
    readonly data: PassageResponse;
    readonly meta: FumsResponse;
    readonly [key: string]: unknown;
}
export declare function fetchPassage(passageID: string, bibleID: string, contentType?: 'html' | 'json' | 'text', includeNotes?: boolean, includeTitles?: boolean, includeChapterNumbers?: boolean, includeVerseNumbers?: boolean, includeVerseSpans?: boolean, config?: AxiosRequestConfig): Promise<PassageAndFumsResponse>;
export {};
