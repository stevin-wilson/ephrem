import {Books} from './books.js';

type ValueOf<T> = T[keyof T];

// - - - - - - - - -
export interface Reference {
  readonly book: ValueOf<Books>;
  readonly chapterStart: string;
  readonly chapterEnd?: string;
  readonly verseStart?: string;
  readonly verseEnd?: string;
  readonly bible: string;
}

// - - - - - - - - -
export const hasValidSyntax = (reference: Reference): boolean => {
  return !(reference.verseEnd !== undefined && reference.verseStart === undefined);
};

// - - - - - - - - -
export const isMultiChapter = (reference: Reference): boolean => {
  let output: boolean;
  if (reference.chapterEnd === undefined) {
    output = false;
  } else {
    output = reference.chapterEnd !== reference.chapterStart;
  }

  return output;
};

// - - - - - - - - -
export const isSingleChapter = (reference: Reference): boolean => {
  let output: boolean;

  if (isMultiChapter(reference)) {
    output = false;
  } else {
    output = true;
  }

  return output;
};

// - - - - - - - - -
export const isSingleVerse = (reference: Reference): boolean => {
  let output: boolean;

  if (isMultiChapter(reference)) {
    output = false;
  } else if (reference.chapterEnd !== undefined && reference.chapterEnd !== reference.chapterEnd) {
    output = false;
  } else output = reference.verseStart !== undefined;

  return output;
};

// - - - - - - - - -
export const isSingleChapterMultipleVerses = (
  reference: Reference,
): boolean => {
  let output: boolean;

  if (!isSingleChapter(reference)) {
    output = false;
  } else output = !isSingleVerse(reference);

  return output;
};

// - - - - - - - - -
const getReferenceGroups = (input: string): string[] => input.split(";").map(
  group => group.trim()
)

// - - - - - - - - -
const getReferences = (input: string, languages: string[]): Map<string, Reference[]> => {
  // From string input, get a map from strings to References,
  // for example, Genesis 1:1 (NIV, KJV); John 3:16-17 (MAL10RO)
  // would generate {
  //      Genesis 1:1 (NIV, KJV): [
  //      {book: GEN, chapterStart: 1, verseStart: 1, bible: NIV},
  //      {book: GEN, chapterStart: 1, verseStart: 1, bible: KJV},
  //      ],
  //      John 3:16-17 (MAL10RO): [
  //      {book: JHN, chapterStart: 3, verseStart: 16, verseEnd: 17, bible: MAL10RO},
  //      ],
  // }
};
