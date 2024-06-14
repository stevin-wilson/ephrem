import { Reference, ReferenceGroup } from './types.js';
/**
 * Checks if a given value is a valid string or undefined.
 * @param value - The value to be checked.
 * @returns - True if the value is a valid string or undefined, false otherwise.
 */
export declare const isValidStringOrUndefined: (value: string | undefined) => boolean;
/**
 * Checks if a given reference has a valid syntax.
 * @param reference - The reference object to check.
 * @returns - True if the reference has valid syntax, false otherwise.
 */
export declare const hasValidReferenceSyntax: (reference: Reference) => boolean;
/**
 * Determines if a given reference refers multiple chapters in the Bible.
 * @param reference - The reference to check.
 * @returns - True if the reference is multi-chapter, otherwise false.
 */
export declare const isMultiChapterReference: (reference: Reference) => boolean;
/**
 * Determines whether a given reference refers to a single verse in the Bible.
 * @param reference - The reference to check.
 * @returns - True if the reference is a single verse reference, false otherwise.
 */
export declare const isSingleVerseReference: (reference: Reference) => boolean;
/**
 * Determines if the given reference is a single chapter with multiple verses reference.
 * @param reference - The reference to check.
 * @returns - True if the reference is a single chapter with multiple verses reference, false otherwise.
 */
export declare const isSingleChapterMultipleVersesReference: (reference: Reference) => boolean;
/**
 * Simplifies a reference group string into a ReferenceGroup object.
 * @param input - The input string representing the reference group.
 * @returns - The simplified reference group object.
 * @throws {Error} - If the input string is not in the correct format.
 */
export declare const simplifyReferenceGroup: (input: string) => ReferenceGroup;
/**
 * Gets reference groups from the given input string.
 * @param input - The input string containing reference groups.
 * @param [groupSeparator] - The separator used to separate reference groups.
 * @returns - The map of reference groups.
 * @throws {Error} If the input is not a string.
 */
export declare const getReferenceGroups: (input: string, groupSeparator?: string) => Map<string, ReferenceGroup>;
