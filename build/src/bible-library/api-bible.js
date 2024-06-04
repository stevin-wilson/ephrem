import 'dotenv/config';
import { HTTPError } from '../utils.js';
import axios from 'axios';
// - - - - - - - - - -
const getAvailableBiblesURL = (language) => `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
const getAvailableBooksAndChaptersURL = (bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=true`;
// - - - - - - - - - -
const getVersesURL = (chapterID, bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/chapters/${chapterID}/verses`;
// - - - - - - - - - -
const defaultConfig = {
    method: 'GET',
    headers: { 'api-key': process.env.API_BIBLE_API_KEY },
};
// - - - - - - - - - -
const fetchFromAPI = async (url, config = {}) => {
    const finalConfig = {
        ...defaultConfig,
        ...config,
    };
    try {
        const response = await axios.get(url, finalConfig);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return response.data.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new HTTPError(error.response.status, error.response.statusText);
        }
        throw error;
    }
};
// - - - - - - - - - -
export const fetchBibles = async (language, config = {}) => {
    const url = getAvailableBiblesURL(language);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
export const fetchBooksAndChapters = async (bibleID, config = {}) => {
    const url = getAvailableBooksAndChaptersURL(bibleID);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
export const fetchVerses = async (chapterID, bibleID, config = {}) => {
    const url = getVersesURL(chapterID, bibleID);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
const getPassageURL = (passageID, bibleID, passageOptions) => {
    const { contentType = 'html', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, } = passageOptions;
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const params = new URLSearchParams({
        'content-type': contentType,
        'include-notes': includeNotes.toString(),
        'include-titles': includeTitles.toString(),
        'include-chapter-numbers': includeChapterNumbers.toString(),
        'include-verse-numbers': includeVerseNumbers.toString(),
        'include-verse-spans': includeVerseSpans.toString(),
        'use-org-id': 'false',
    });
    return `https://api.scripture.api.bible/v1/bibles/${bibleID}/passages/${passageID}?${params.toString()}`;
};
// - - - - - - - - - -
export const fetchPassage = async (passageID, bibleID, passageOptions = {}, config = {}) => {
    const finalConfig = {
        ...defaultConfig,
        ...config,
    };
    const url = getPassageURL(passageID, bibleID, passageOptions);
    try {
        const response = await axios.get(url, finalConfig);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new HTTPError(error.response.status, error.response.statusText);
        }
        throw error;
    }
};
// - - - - - - - - - -
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJpYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYXBpLWJpYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEMsT0FBTyxLQUEyQixNQUFNLE9BQU8sQ0FBQztBQVNoRCxzQkFBc0I7QUFDdEIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUN6RCxzREFBc0QsUUFBUSxFQUFFLENBQUM7QUFDbkUsc0JBQXNCO0FBQ3RCLE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxPQUFlLEVBQVUsRUFBRSxDQUNsRSw2Q0FBNkMsT0FBTyw4QkFBOEIsQ0FBQztBQUNyRixzQkFBc0I7QUFDdEIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFpQixFQUFFLE9BQWUsRUFBVSxFQUFFLENBQ2xFLDZDQUE2QyxPQUFPLGFBQWEsU0FBUyxTQUFTLENBQUM7QUFDdEYsc0JBQXNCO0FBQ3RCLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWtCLEVBQUM7Q0FDNUMsQ0FBQztBQUNYLHNCQUFzQjtBQUN0QixNQUFNLFlBQVksR0FBRyxLQUFLLEVBQ3hCLEdBQVcsRUFDWCxTQUE2QixFQUFFLEVBQ2IsRUFBRTtJQUNwQixNQUFNLFdBQVcsR0FBRztRQUNsQixHQUFHLGFBQWE7UUFDaEIsR0FBRyxNQUFNO0tBQ1YsQ0FBQztJQUVGLElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbkQsc0VBQXNFO1FBQ3RFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7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