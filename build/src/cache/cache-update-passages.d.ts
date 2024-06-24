import { PassageQuery, PreparePassageOptions } from './cache-types.js';
import { PassageAndFumsResponse } from '../api-bible/api-types.js';
export declare const passageQueriesAreEqual: (query1: PassageQuery, query2: PassageQuery) => boolean;
export declare const preparePassage: (options: PreparePassageOptions) => Promise<PassageAndFumsResponse>;
