import {Reference} from '../reference/reference-types.js';

export const getPassageID = (reference: Reference): string => {
  // Ensure reference is an object
  if (typeof reference !== 'object' || reference === null) {
    throw new Error('Reference must be an object');
  }

  const sections: string[] = [];

  const requiredSection = createPassageBoundary(
    reference.book,
    reference.chapterStart,
    reference.verseStart
  );
  let optionalSection: string | undefined = undefined;

  if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
    optionalSection = createPassageBoundary(
      reference.book,
      reference.chapterEnd,
      reference.verseEnd
    );
  } else if (reference.chapterEnd !== undefined) {
    optionalSection = createPassageBoundary(
      reference.book,
      reference.chapterEnd
    );
  } else if (reference.verseEnd !== undefined) {
    optionalSection = createPassageBoundary(
      reference.book,
      reference.chapterStart,
      reference.verseEnd
    );
  }

  sections.push(requiredSection);
  if (optionalSection) {
    sections.push(optionalSection);
  }

  return sections.join('-').replace(/\s+/g, '');
};
const createPassageBoundary = (
  book: string,
  chapter?: string,
  verse?: string
): string => {
  return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};
