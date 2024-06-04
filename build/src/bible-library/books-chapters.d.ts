import { BiblesToBooks, BookResponse, BooksInBible, BooksToChapters, ChapterResponse, ChaptersInBook } from '../types.js';
export declare const saveBiblesToBooks: (biblesToBooks: BiblesToBooks, cacheDir?: string) => Promise<void>;
export declare const loadBiblesToBooks: (cacheDir?: string, max_age_days?: number) => Promise<BiblesToBooks>;
export declare const getBibleAndBookString: (bibleAbbreviation: string, bookID: string) => string;
export declare const saveBooksToChapters: (booksToChapters: BooksToChapters, cacheDir?: string) => Promise<void>;
export declare const loadBooksToChapters: (cacheDir?: string, max_age_days?: number) => Promise<BooksToChapters>;
export declare const getBookIDs: (bookResponses: BookResponse[]) => BooksInBible;
export declare const getChapterIDs: (chapterResponses: ChapterResponse[]) => ChaptersInBook;
