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
async function getAvailableBibles(language, config) {
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
async function getBookAndChapters(bibleID, config) {
    const url = getAvailableBooksAndChaptersURL(bibleID);
    return (await fetchFromAPI(url, config));
}
// console.log(
//   JSON.stringify(await getBookAndChapters('805e795e07fb9422-01'), null, 2)
// );
async function getVerses(chapterID, bibleID, config) {
    const url = getVersesURL(chapterID, bibleID);
    return (await fetchFromAPI(url, config));
}
const getPassageURL = (passageID, bibleID, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/passages/${passageID}?content-type=${contentType}&include-notes=${includeNotes}&include-titles=${includeTitles}&include-chapter-numbers=${includeChapterNumbers}&include-verse-numbers=${includeVerseNumbers}&include-verse-spans=${includeVerseSpans}&use-org-id=false`;
async function getPassage(passageID, bibleID, contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, config) {
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
console.log(JSON.stringify(await getPassage('GEN.1.1-GEN.2', '805e795e07fb9422-01'), null, 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtYmlibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmV0Y2gtYmlibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEtBQTJCLE1BQU0sT0FBTyxDQUFDO0FBMENoRCxzQkFBc0I7QUFDdEIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUN6RCxzREFBc0QsUUFBUSxFQUFFLENBQUM7QUFFbkUsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLE9BQWUsRUFBVSxFQUFFLENBQ2xFLDZDQUE2QyxPQUFPLDhCQUE4QixDQUFDO0FBRXJGLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBaUIsRUFBRSxPQUFlLEVBQVUsRUFBRSxDQUNsRSw2Q0FBNkMsT0FBTyxhQUFhLFNBQVMsU0FBUyxDQUFDO0FBRXRGLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWtCLEVBQUM7Q0FDNUMsQ0FBQztBQUVYLGlEQUFpRDtBQUNqRDs7R0FFRztBQUNILEtBQUssVUFBVSxZQUFZLENBQ3pCLEdBQVcsRUFDWCxNQUEyQjtJQUUzQixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUVsRSxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELHNFQUFzRTtRQUN0RSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ys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