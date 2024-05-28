import 'dotenv/config';
import { HTTPError } from './utils.js';
import axios from 'axios';
// - - - - - - - - - -
const getAvailableBiblesURL = (language) => `https://api.scripture.api.bible/v1/bibles?language=${language}`;
const getAvailableBooksAndChaptersURL = (bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=true`;
const getVersesURL = (chapterID, bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/chapters/${chapterID}/verses`;
const defaultConfig = {
    method: 'GET',
    headers: { 'api-key': process.env.API_BIBLE_API_KEY },
};
// eslint-disable-next-line jsdoc/require-returns
/**
 *
 */
async function fetchFromAPI(url, config) {
    const configToUse = config !== undefined ? config : defaultConfig;
    try {
        const response = await axios.get(url, configToUse);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return response.data.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new HTTPError(error.response.status, error.response.statusText);
        }
        throw error;
    }
}
// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param language ISO code of language
 * @param options
 */
export async function fetchBibles(language, config) {
    const url = getAvailableBiblesURL(language);
    return (await fetchFromAPI(url, config));
}
// console.log(await getAvailableBibles('ENG'));
// eslint-disable-next-line jsdoc/require-returns
/**
 *
 // eslint-disable-next-line jsdoc/require-param-description
 * @param bibleID
 // eslint-disable-next-line jsdoc/require-param-description
 // eslint-disable-next-line jsdoc/require-param-description
 * @param config
 */
export async function fetchBooksAndChapters(bibleID, config) {
    const url = getAvailableBooksAndChaptersURL(bibleID);
    return (await fetchFromAPI(url, config));
}
// console.log(
//   JSON.stringify(await getBookAndChapters('805e795e07fb9422-01'), null, 2)
// );
export async function fetchVerses(chapterID, bibleID, config) {
    const url = getVersesURL(chapterID, bibleID);
    return (await fetchFromAPI(url, config));
}
const getPassageURL = (passageID, bibleID, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/passages/${passageID}?content-type=${contentType}&include-notes=${includeNotes}&include-titles=${includeTitles}&include-chapter-numbers=${includeChapterNumbers}&include-verse-numbers=${includeVerseNumbers}&include-verse-spans=${includeVerseSpans}&use-org-id=false`;
export async function fetchPassage(passageID, bibleID, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, config) {
    const configToUse = config !== undefined ? config : defaultConfig;
    const url = getPassageURL(passageID, bibleID, contentType, includeNotes, includeTitles, includeChapterNumbers, includeVerseNumbers, includeVerseSpans);
    try {
        const response = await axios.get(url, configToUse);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new HTTPError(error.response.status, error.response.statusText);
        }
        throw error;
    }
}
console.log(JSON.stringify(await fetchPassage('GEN.1.1-GEN.2', '805e795e07fb9422-01'), null, 2));
// - - - - - - - - - -
// * Build Library
// Get languages as input.
// Get an array of Reference as input.
// Optionally, take a Library as input
// Fetch all supported Bibles in these languages
// Check if Bibles in the references are supported.
// If not, return unsupported bibles
// For each Bible, get Books and Chapters
// Check if Books and Chapters in the references are supported
// If not, return unsupported References
// Identify References that specify Verse number(s)
// For each Chapter, get Verses
// For each Reference that specifies a Verse number, check if the verse is available
// If not, return unsupported References
// Return [Library, unsupported References]
// - - - - - - - - - -
// * Get Scripture
// Get Library as input.
// Get an array of Reference as input.
// Get map of Bibles to Bible IDs
// Get Passage ID for each Reference
// Get Scriptures
// Return Map<Reference, Scripture>
// - - - - - - - - - -
// * Parse References
// From string input, get a map from strings to References,
// for example, Genesis 1:1 (NIV, KJV); John 3:16 (MAL10RO)
// would generate {
//      Genesis 1:1 (NIV): Reference 1,
//      Genesis 1:1 (KJV): Reference 2,
//      John 3:16 (MAL10RO): Reference 3,
// }
// Pass  References to Get Scripture
// Get Map<Reference, Scripture>
// Join and get
// {
//      Genesis 1:1 (NIV): Scripture 1,
//      Genesis 1:1 (KJV): Scripture 2,
//      John 3:16 (MAL10RO): {
//              id: string;
//              reference: "യോഹന്നാൻ 3:16";
//              content: string;
//              format: 'html';
//              language: "Malayalam";
//              copyright: string;
//      },
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtYmlibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmV0Y2gtYmlibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEtBQTJCLE1BQU0sT0FBTyxDQUFDO0FBNENoRCxzQkFBc0I7QUFDdEIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUN6RCxzREFBc0QsUUFBUSxFQUFFLENBQUM7QUFFbkUsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLE9BQWUsRUFBVSxFQUFFLENBQ2xFLDZDQUE2QyxPQUFPLDhCQUE4QixDQUFDO0FBRXJGLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBaUIsRUFBRSxPQUFlLEVBQVUsRUFBRSxDQUNsRSw2Q0FBNkMsT0FBTyxhQUFhLFNBQVMsU0FBUyxDQUFDO0FBRXRGLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWtCLEVBQUM7Q0FDNUMsQ0FBQztBQUVYLGlEQUFpRDtBQUNqRDs7R0FFRztBQUNILEtBQUssVUFBVSxZQUFZLENBQ3pCLEdBQVcsRUFDWCxNQUEyQjtJQUUzQixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUVsRSxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELHNFQUFzRTtRQUN0RSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ys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