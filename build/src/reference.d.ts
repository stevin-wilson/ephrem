import { Reference, ReferenceGroup } from './types.js';
export declare const isValidStringOrUndefined: (value: string | undefined) => boolean;
export declare const hasValidSyntax: (reference: Reference) => boolean;
export declare const isMultiChapter: (reference: Reference) => boolean;
export declare const isSingleChapter: (reference: Reference) => boolean;
export declare const isSingleVerse: (reference: Reference) => boolean;
export declare const isSingleChapterMultipleVerses: (reference: Reference) => boolean;
export declare const simplifyReferenceGroup: (input: string) => ReferenceGroup;
export declare const getReferenceGroups: (input: string, groupSeparator?: string) => Map<string, ReferenceGroup>;
