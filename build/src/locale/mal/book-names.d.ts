import { Books } from '../../books.js';
export interface BookName {
    readonly name: string;
    readonly abbreviations?: string[];
}
export declare const BookNames: Map<Books, BookName[]>;
