import { ParseReferencesOptions, Reference, ReferenceGroup, References, SplitReferenceGroupOptions } from './reference-types.js';
export declare const parseReferenceGroup: (input: string, defaultBibles?: string[]) => ReferenceGroup;
export declare const splitReferenceGroup: (options: SplitReferenceGroupOptions) => Promise<Reference[]>;
export declare const parseReferences: (options: ParseReferencesOptions) => Promise<References>;
