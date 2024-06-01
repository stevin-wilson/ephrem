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
// console.log(
//   JSON.stringify(
//     await fetchPassage('GEN.1.1-GEN.2', '805e795e07fb9422-01'),
//     null,
//     2
//   )
// );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtYmlibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmV0Y2gtYmlibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEtBQTJCLE1BQU0sT0FBTyxDQUFDO0FBOENoRCxzQkFBc0I7QUFDdEIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUN6RCxzREFBc0QsUUFBUSxFQUFFLENBQUM7QUFFbkUsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLE9BQWUsRUFBVSxFQUFFLENBQ2xFLDZDQUE2QyxPQUFPLDhCQUE4QixDQUFDO0FBRXJGLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBaUIsRUFBRSxPQUFlLEVBQVUsRUFBRSxDQUNsRSw2Q0FBNkMsT0FBTyxhQUFhLFNBQVMsU0FBUyxDQUFDO0FBRXRGLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWtCLEVBQUM7Q0FDNUMsQ0FBQztBQUVYLGlEQUFpRDtBQUNqRDs7R0FFRztBQUNILEtBQUssVUFBVSxZQUFZLENBQ3pCLEdBQVcsRUFDWCxNQUEyQjtJQUUzQixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUVsRSxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELHNFQUFzRTtRQUN0RSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ys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