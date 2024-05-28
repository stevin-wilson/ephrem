// - - - - - - - - -
import {Books} from '../books.js';

export type NamesToBooks = Map<string, Books>;

// - - - - - - - - -
export interface ReferenceGroup {
  readonly bookName: string;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bibles?: string[];
}
