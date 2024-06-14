import {Cache, VoteTally} from './types.js';

/**
 * Finds the key with the maximum value in the given voteTally object.
 * @param voteTally - The vote tally object.
 * @returns - The key with the maximum value, or undefined if voteTally is empty.
 */
const getKeyOfMaxValue = (voteTally: VoteTally): string | undefined => {
  let maxKey: string | undefined;
  let maxValue = -Infinity;

  // Iterate over each key-value pair in the voteTally object
  Object.entries(voteTally).forEach(([key, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  });

  return maxKey;
};

/**
 * Returns the book ID for the given book name, Bible abbreviation, languages, and cache.
 * If the book ID cannot be determined, undefined is returned.
 * @param bookName - The name of the book.
 * @param bibleAbbreviation - The abbreviation of the Bible.
 * @param languages - An array of languages to filter the books by.
 * @param cache - The cache object containing book reference data.
 * @returns - The book ID if found, otherwise undefined.
 */
const getBookID = (
  bookName: string,
  bibleAbbreviation: string | undefined,
  languages: string[] | undefined,
  cache: Cache
): string | undefined => {
  const bookReferences = cache.bookNames[bookName];
  if (bookReferences === undefined || bookReferences.length === 0) {
    return undefined;
  }

  if (bibleAbbreviation !== undefined) {
    for (const bookReference of bookReferences) {
      if (bookReference.bibles.includes(bibleAbbreviation)) {
        return bookReference.id;
      }
    }
  }

  const voteTally: VoteTally = {};
  for (const bookReference of bookReferences) {
    if (
      languages !== undefined &&
      languages.length > 0 &&
      !languages.includes(bookReference.language)
    ) {
      continue;
    }
    const bookID = bookReference.id;
    if (voteTally[bookID] === undefined) {
      voteTally[bookID] = 0;
    }
    voteTally[bookID] += bookReference.bibles.length;
  }

  return getKeyOfMaxValue(voteTally);
};
