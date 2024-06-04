import { Bibles, BiblesToBooks, BooksToChapters, ChaptersToVerses, ChapterToFetchVerses } from '../types.js';
import { AxiosRequestConfig } from 'axios';
export declare const getBibleAndChapterString: (bibleAbbreviation: string, chapterID: string) => string;
export declare const saveChaptersToVerses: (chaptersToVerses: ChaptersToVerses, cacheDir?: string) => Promise<void>;
export declare const loadChaptersToVerses: (cacheDir?: string, max_age_days?: number) => Promise<ChaptersToVerses>;
export declare const updateVerses: (chaptersToFetchVerses: ChapterToFetchVerses[], chaptersToVerses: ChaptersToVerses, bibles: Bibles, biblesToBooks: BiblesToBooks, booksToChapters: BooksToChapters, config?: AxiosRequestConfig) => Promise<void>;
