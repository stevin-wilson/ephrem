import { PassageAndFumsResponse, PassageOptions } from '../api-bible/api-types.js';
import { ParseReferencesOptions } from '../reference/reference-types.js';
import { PassagesCache } from '../cache/cache-types.js';
export type PassagesOutput = Record<string, PassageAndFumsResponse[]>;
export interface GetPassagesOptions extends ParseReferencesOptions {
    passagesCache?: PassagesCache;
    passageOptions?: PassageOptions;
    forcePassageApiCall?: boolean;
}
export declare class GetPassagesError extends Error {
    readonly context?: GetPassagesOptions;
    constructor(message: string | undefined, context: GetPassagesOptions);
}
