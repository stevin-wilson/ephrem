// - - - - - - - - - -
const getLanguageofBible = (bibleAbbreviation: string): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.id.toLowerCase();
};

// - - - - - - - - - -
const getScriptDirectionOfBible = (
  bibleAbbreviation: string
): ScriptDirection => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.language.scriptDirection;
};

// - - - - - - - - - -
const getLocalNameOfBible = (bibleAbbreviation: string): string => {
  const bible = bibles.get(bibleAbbreviation);
  if (!bible) {
    throw Error;
  }
  return bible.nameLocal;
};

// - - - - - - - - - -
const isSupportedBook = (
  bibleAbbreviation: string,
  bookID: string
): boolean => {
  const booksInBible = biblesToBooks.get(bibleAbbreviation);
  if (!booksInBible) {
    throw Error;
  }
  return booksInBible.books.includes(bookID);
};

// - - - - - - - - - -
const isSupportedChapter = (
  bibleAbbreviation: string,
  bookID: string,
  chapterID: string
): boolean => {
  const chaptersInBook = booksToChapters.get(
    getBibleAndBookString(bibleAbbreviation, bookID)
  );
  if (!chaptersInBook) {
    throw Error;
  }
  return chaptersInBook.chapters.includes(chapterID);
};

// - - - - - - - - - -
const isSupportedVerse = (
  bibleAbbreviation: string,
  chapterID: string,
  verseID: string
): boolean => {
  const versesInChapter = chaptersToVerses.get(
    getBibleAndChapterString(bibleAbbreviation, chapterID)
  );
  if (!versesInChapter) {
    throw Error;
  }
  return versesInChapter.verses.includes(verseID);
};

// - - - - - - - - - -
const chaptersInCorrectOrder = (
  bibleAbbreviation: string,
  bookID: string,
  startChapterID: string,
  endChapterID: string
): boolean => {
  const chaptersInBook = booksToChapters.get(
    getBibleAndBookString(bibleAbbreviation, bookID)
  );
  if (!chaptersInBook) {
    throw Error;
  }
  return chaptersInBook.chapters
    .slice(chaptersInBook.chapters.indexOf(startChapterID))
    .includes(endChapterID);
};

// - - - - - - - - - -
const versesInCorrectOrder = (
  bibleAbbreviation: string,
  chapterID: string,
  startVerseID: string,
  endVerseID: string
): boolean => {
  const versesInChapter = chaptersToVerses.get(
    getBibleAndChapterString(bibleAbbreviation, chapterID)
  );
  if (!versesInChapter) {
    throw Error;
  }
  return versesInChapter.verses
    .slice(versesInChapter.verses.indexOf(startVerseID))
    .includes(endVerseID);
};

// - - - - - - - - - -
const saveCache = async (): Promise<void> => {
  if (booksToChapters.size > 0) {
    try {
      await saveBooksToChapters(booksToChapters, booksToChaptersCache);
    } catch (error) {
      console.error('Error saving booksToChapters to cache', error);
    }
  }

  if (bibles.size > 0) {
    try {
      await saveBibles(bibles, biblesCache);
    } catch (error) {
      console.error('Error saving bibles to cache', error);
    }
  }

  if (passages.size > 0) {
    try {
      await savePassages(passages, passagesCache);
    } catch (error) {
      console.error('Error saving passages to cache', error);
    }
  }

  if (biblesToBooks.size > 0) {
    try {
      await saveBiblesToBooks(biblesToBooks, biblesToBooksCache);
    } catch (error) {
      console.error('Error saving biblesToBooks to cache', error);
    }
  }

  if (chaptersToVerses.size > 0) {
    try {
      await saveChaptersToVerses(chaptersToVerses, chaptersToVersesCache);
    } catch (error) {
      console.error('Error saving chaptersToVerses to cache', error);
    }
  }

  if (bookNames.size > 0) {
    try {
      await saveBookNames(bookNames, bookNamesCache);
    } catch (error) {
      console.error('Error saving bookNames to cache', error);
    }
  }
};

// - - - - - - - - - -
const getPassage = async (
  passageID: string,
  bibleAbbreviation: string,
  contentType: 'html' | 'json' | 'text' = 'html',
  includeNotes = false,
  includeTitles = false,
  includeChapterNumbers = false,
  includeVerseNumbers = false,
  includeVerseSpans = false,
  config?: AxiosRequestConfig
): Promise<Passage> => {
  const passageQuery: PassageQuery = {
    passageID,
    bibleAbbreviation,
    contentType,
    includeNotes,
    includeTitles,
    includeChapterNumbers,
    includeVerseNumbers,
    includeVerseSpans,
  };

  const passageQueryString = getStringForPassageQuery(passageQuery);

  if (passages.get(passageQueryString) === undefined) {
    await updatePassage(
      passageID,
      bibleAbbreviation,
      contentType,
      includeNotes,
      includeTitles,
      includeChapterNumbers,
      includeVerseNumbers,
      includeVerseSpans,
      config
    );
  }

  const passage = passages.get(passageQueryString);
  if (passage === undefined) {
    throw Error;
  }

  return passage;
};

// - - - - - - - - - -

// - - - - - - - - - -
const clearCache = (): void => {
  bibles.clear();
  biblesToBooks.clear();
  booksToChapters.clear();
  chaptersToVerses.clear();
  passages.clear();
};
