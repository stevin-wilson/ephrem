import {Cache, VoteTally} from './types.js';
import {loadCache} from './bible-library/cache.js';

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

const getBookID = (
  bookName: string,
  bibleAbbreviation: string,
  languages: string[],
  cache: Cache
): string | undefined => {
  const bookReferences = cache.bookNames[bookName];
  if (bookReferences === undefined || bookReferences.length === 0) {
    return undefined;
  }

  for (const bookReference of bookReferences) {
    if (bookReference.bibles.includes(bibleAbbreviation)) {
      return bookReference.id;
    }
  }

  const voteTally: VoteTally = {};
  for (const bookReference of bookReferences) {
    if (!languages.includes(bookReference.language)) {
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

// - - - - - -
const cache = await loadCache();
console.log(getBookID('genesis', 'KJV', ['eng', 'mal'], cache));
console.log(getBookID('ഉൽപ്പത്തി', 'KJV', ['eng', 'mal'], cache));
console.log(getBookID('bereshis', 'KJV', ['eng', 'mal'], cache));
