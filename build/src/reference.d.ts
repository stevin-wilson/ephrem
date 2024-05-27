import { Books } from './books.js';
type ValueOf<T> = T[keyof T];
export interface Reference {
    readonly book: ValueOf<Books>;
    readonly chapterStart: string;
    readonly chapterEnd?: string;
    readonly verseStart?: string;
    readonly verseEnd?: string;
    readonly bible: string;
}
export declare const isValidStringOrUndefined: (value: string | undefined) => boolean;
export declare const hasValidSyntax: (reference: Reference) => boolean;
export declare const isMultiChapter: (reference: Reference) => boolean;
export declare const isSingleChapter: (reference: Reference) => boolean;
export declare const isSingleVerse: (reference: Reference) => boolean;
export declare const isSingleChapterMultipleVerses: (reference: Reference) => boolean;
export declare const getReferenceGroups: (input: string) => string[];
export interface ReferenceGroup {
    readonly bookName: string;
    readonly chapterStart: string;
    readonly chapterEnd?: string;
    readonly verseStart?: string;
    readonly verseEnd?: string;
    readonly bibles?: string[];
}
export declare const simplifyReferenceGroup: (input: string) => ReferenceGroup;
export {};
