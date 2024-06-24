import { GetBookIdOptions } from './reference-types.js';
import { BOOK_IDs } from './book-ids.js';
export declare const getBookID: (options: GetBookIdOptions) => Promise<keyof typeof BOOK_IDs>;
