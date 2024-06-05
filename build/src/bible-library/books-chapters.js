import { cleanUpOldRecords, defaultCacheDir, writeJsonFile } from '../utils.js';
import fs from 'fs-extra';
// - - - - - - - - - -
//  Bible Abbreviation -> Book Names
const getBiblesToBooksCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/bibles-to-books.json`;
};
// serialize the BooksToChapters map to JSON
const serializeBiblesToBooks = (biblesToBooks) => {
    const obj = Array.from(biblesToBooks.entries()).map(([bibleAbbreviation, value]) => ({
        bibleAbbreviation: bibleAbbreviation,
        books: value.books,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveBiblesToBooks = async (biblesToBooks, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBiblesToBooksCachePath(cacheDir), serializeBiblesToBooks(biblesToBooks));
};
// deserialize JSON back to a BooksToChapters map
const deserializeBiblesToBooks = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAbbreviation;
        const value = {
            books: item.books,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
export const loadBiblesToBooks = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBiblesToBooksCachePath(cacheDir), 'utf-8');
        return cleanUpOldRecords(deserializeBiblesToBooks(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
// - - - - - - - - - -
// Bibles and Books -> Chapter
export const getBibleAndBookString = (bibleAbbreviation, bookID) => `${bibleAbbreviation}@${bookID}`;
const getBooksToChaptersCachePath = (cacheDir = defaultCacheDir) => {
    return `${cacheDir}/books-to-chapters.json`;
};
// serialize the BooksToChapters map to JSON
const serializeBooksToChapters = (booksToChapters) => {
    const obj = Array.from(booksToChapters.entries()).map(([bibleAndBook, value]) => ({
        bibleAndBook: bibleAndBook,
        chapters: value.chapters,
        cachedOn: value.cachedOn.toISOString(),
    }));
    return JSON.stringify(obj, null, 2);
};
export const saveBooksToChapters = async (booksToChapters, cacheDir = defaultCacheDir) => {
    await writeJsonFile(getBooksToChaptersCachePath(cacheDir), serializeBooksToChapters(booksToChapters));
};
// deserialize JSON back to a BooksToChapters map
const deserializeBooksToChapters = (jsonData) => {
    const arr = JSON.parse(jsonData);
    const map = new Map();
    arr.forEach((item) => {
        const key = item.bibleAndBook;
        const value = {
            chapters: item.chapters,
            cachedOn: new Date(item.cachedOn),
        };
        map.set(key, value);
    });
    return map;
};
export const loadBooksToChapters = async (cacheDir = defaultCacheDir, max_age_days = 14) => {
    try {
        const jsonData = await fs.readFile(getBooksToChaptersCachePath(cacheDir), 'utf-8');
        return cleanUpOldRecords(deserializeBooksToChapters(jsonData), max_age_days);
    }
    catch (error) {
        // Type assertion to access error.code
        if (error.code === 'ENOENT') {
            console.warn('Cache file not found, returning a new empty map.');
        }
        else {
            console.error('Error reading or parsing JSON file:', error);
        }
        return new Map();
    }
};
// - - - - - - - - - -
export const getBookIDs = (bookResponses) => {
    const books = [];
    for (const bookResponse of bookResponses) {
        books.push(bookResponse.id);
    }
    return { books, cachedOn: new Date() };
};
// - - - - - - - - - -
export const getChapterIDs = (chapterResponses) => {
    const chapters = [];
    for (const chapterResponse of chapterResponses) {
        if (chapterResponse.number === 'intro') {
            continue;
        }
        chapters.push(chapterResponse.id);
    }
    return { chapters, cachedOn: new Date() };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va3MtY2hhcHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmlibGUtbGlicmFyeS9ib29rcy1jaGFwdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQWlCOUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBSzFCLHNCQUFzQjtBQUN0QixvQ0FBb0M7QUFDcEMsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFdBQW1CLGVBQWUsRUFBRSxFQUFFO0lBQ3ZFLE9BQU8sR0FBRyxRQUFRLHVCQUF1QixDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUVGLDRDQUE0QztBQUM1QyxNQUFNLHNCQUFzQixHQUFHLENBQUMsYUFBNEIsRUFBVSxFQUFFO0lBQ3RFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUNqRCxDQUFDLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0IsaUJBQWlCLEVBQUUsaUJBQWlCO1FBQ3BDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztRQUNsQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7S0FDdkMsQ0FBQyxDQUNILENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQ3BDLGFBQTRCLEVBQzVCLFdBQW1CLGVBQWUsRUFDbEMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQix5QkFBeUIsQ0FBQyxRQUFRLENBQUMsRUFDbkMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQ3RDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixpREFBaUQ7QUFDakQsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLFFBQWdCLEVBQWlCLEVBQUU7SUFDbkUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxNQUFNLEdBQUcsR0FBa0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUVyQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxHQUFHLEdBQXNCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUN0RCxNQUFNLEtBQUssR0FBaUI7WUFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2xDLENBQUM7UUFDRixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUNwQyxXQUFtQixlQUFlLEVBQ2xDLFlBQVksR0FBRyxFQUFFLEVBQ08sRUFBRTtJQUMxQixJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQ2hDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxFQUNuQyxPQUFPLENBQ1IsQ0FBQztRQUNGLE9BQU8saUJBQWlCLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixzQ0FBc0M7UUFDdEMsSUFBSyxLQUErQixDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDbkUsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxPQUFPLElBQUksR0FBRyxFQUFtQixDQUFDO0lBQ3BDLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsOEJBQThCO0FBRTlCLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLENBQ25DLGlCQUF5QixFQUN6QixNQUFjLEVBQ2QsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLElBQUksTUFBTSxFQUFFLENBQUM7QUFFdEMsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLFdBQW1CLGVBQWUsRUFBRSxFQUFFO0lBQ3pFLE9BQU8sR0FBRyxRQUFRLHlCQUF5QixDQUFDO0FBQzlDLENBQUMsQ0FBQztBQUVGLDRDQUE0QztBQUM1QyxNQUFNLHdCQUF3QixHQUFHLENBQUMsZUFBZ0MsRUFBVSxFQUFFO0lBQzVFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUNuRCxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLFlBQVksRUFBRSxZQUFZO1FBQzFCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtRQUN4QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7S0FDdkMsQ0FBQyxDQUNILENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQ3RDLGVBQWdDLEVBQ2hDLFdBQW1CLGVBQWUsRUFDbEMsRUFBRTtJQUNGLE1BQU0sYUFBYSxDQUNqQiwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsRUFDckMsd0JBQXdCLENBQUMsZUFBZSxDQUFDLENBQzFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixpREFBaUQ7QUFDakQsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLFFBQWdCLEVBQW1CLEVBQUU7SUFDdkUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxNQUFNLEdBQUcsR0FBb0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUV2QyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxHQUFHLEdBQWlCLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQW1CO1lBQzVCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNsQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLEtBQUssRUFDdEMsV0FBbUIsZUFBZSxFQUNsQyxZQUFZLEdBQUcsRUFBRSxFQUNTLEVBQUU7SUFDNUIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUNoQywyQkFBMkIsQ0FBQyxRQUFRLENBQUMsRUFDckMsT0FBTyxDQUNSLENBQUM7UUFDRixPQUFPLGlCQUFpQixDQUN0QiwwQkFBMEIsQ0FBQyxRQUFRLENBQUMsRUFDcEMsWUFBWSxDQUNiLENBQUM7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLHNDQUFzQztRQUN0QyxJQUFLLEtBQStCLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNuRSxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUNELE9BQU8sSUFBSSxHQUFHLEVBQXFCLENBQUM7SUFDdEMsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0QixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxhQUE2QixFQUFnQixFQUFFO0lBQ3hFLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztJQUUzQixLQUFLLE1BQU0sWUFBWSxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxPQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRSxFQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxDQUMzQixnQkFBbUMsRUFDbkIsRUFBRTtJQUNsQixNQUFNLFFBQVEsR0FBZ0IsRUFBRSxDQUFDO0lBRWpDLEtBQUssTUFBTSxlQUFlLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDdkMsU0FBUztRQUNYLENBQUM7UUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsT0FBTyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQyJ9