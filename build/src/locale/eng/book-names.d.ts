import { Books } from '../../books.js';
export type Usage = 'orthodox' | 'common';
export interface BookName {
    readonly name: string;
    readonly abbreviations?: string[];
    /**
     * `orthodoxOnly` is used to indicate name and abbreviation that are exclusive to Orthodox Bibles.
     * For example, 1 Samuel is called 1 Kings or Kingdoms in Orthodox Bibles
     */
    readonly usage: Usage[];
}
export declare const BookNames: Map<Books, BookName[]>;
