import { AxiosRequestConfig } from 'axios';
export interface FetchOptions {
    delayBetweenCalls?: number;
    config?: AxiosRequestConfig;
    retries?: number;
    initialBackoff?: number;
}
export interface FetchBiblesOptions extends FetchOptions {
    language?: string;
}
export declare class BiblesFetchError extends Error {
    statusCode: number;
    statusText: string;
    context: FetchBiblesOptions;
    constructor(message: string, statusCode: number, statusText: string, context: FetchBiblesOptions);
}
export type ScriptDirection = 'RTL' | 'LTR';
export interface Language {
    readonly id: string;
    readonly name: string;
    readonly nameLocal: string;
    readonly script: string;
    readonly scriptDirection: ScriptDirection;
}
export interface LanguageResponse extends Language {
    readonly [key: string]: unknown;
}
export interface BibleResponse {
    readonly id: string;
    readonly abbreviation: string;
    readonly language: LanguageResponse;
    readonly [key: string]: unknown;
}
export interface FetchBooksOptions extends FetchOptions {
    bibleID: string;
}
export declare class BooksFetchError extends Error {
    statusCode: number;
    statusText: string;
    context: FetchBooksOptions;
    constructor(message: string, statusCode: number, statusText: string, context: FetchBooksOptions);
}
export interface BookResponse {
    readonly id: string;
    readonly abbreviation: string;
    readonly name: string;
    readonly nameLong: string;
    readonly [key: string]: unknown;
}
export interface PassageResponse {
    readonly id: string;
    readonly reference: string;
    readonly content: string;
    readonly copyright: string;
    readonly [key: string]: unknown;
}
export interface FetchPassageOptions extends FetchOptions {
    passageID: string;
    bibleID: string;
    passageOptions: PassageOptions;
}
export declare class PassageFetchError extends Error {
    statusCode: number;
    statusText: string;
    context: FetchPassageOptions;
    constructor(message: string, statusCode: number, statusText: string, context: FetchPassageOptions);
}
export interface PassageOptions {
    readonly contentType?: 'html' | 'json' | 'text';
    readonly includeNotes?: boolean;
    readonly includeTitles?: boolean;
    readonly includeChapterNumbers?: boolean;
    readonly includeVerseNumbers?: boolean;
    readonly includeVerseSpans?: boolean;
}
export interface FumsResponse {
    readonly fums: string;
    readonly [key: string]: unknown;
}
export interface PassageAndFumsResponse {
    readonly data: PassageResponse;
    readonly meta: FumsResponse;
    readonly [key: string]: unknown;
}
