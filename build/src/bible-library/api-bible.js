import 'dotenv/config';
import { HTTPError } from '../utils.js';
import axios from 'axios';
// - - - - - - - - - -
const getAvailableBiblesURL = (language) => `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
const getAvailableBooksURL = (bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;
// - - - - - - - - - -
const defaultConfig = {
    method: 'GET',
    headers: { 'api-key': process.env.API_BIBLE_API_KEY },
};
// - - - - - - - - - -
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// - - - - - - - - - -
const fetchFromAPI = async (url, config = {}, retries = 3, backoff = 300, // initial backoff time in milliseconds
delayBetweenCalls = 1000 // delay between consecutive API calls in milliseconds
) => {
    const finalConfig = {
        ...defaultConfig,
        ...config,
    };
    // Wait for delay before making the API call
    if (delayBetweenCalls !== undefined) {
        await sleep(delayBetweenCalls);
    }
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url, finalConfig);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return response.data.data;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // If it's a 503 error, we retry
                if (error.response.status === 503 && attempt < retries) {
                    await sleep(backoff * Math.pow(2, attempt)); // exponential backoff
                    continue;
                }
                throw new HTTPError(error.response.status, error.response.statusText);
            }
            throw error;
        }
    }
    throw new Error('Max retries reached');
};
// - - - - - - - - - -
export const fetchBibles = async (language, config = {}) => {
    const url = getAvailableBiblesURL(language);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
export const fetchBooks = async (bibleID, config = {}) => {
    const url = getAvailableBooksURL(bibleID);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJpYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYXBpLWJpYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEMsT0FBTyxLQUEyQixNQUFNLE9BQU8sQ0FBQztBQVFoRCxzQkFBc0I7QUFDdEIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUN6RCxzREFBc0QsUUFBUSxFQUFFLENBQUM7QUFDbkUsc0JBQXNCO0FBQ3RCLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxPQUFlLEVBQVUsRUFBRSxDQUN2RCw2Q0FBNkMsT0FBTywrQkFBK0IsQ0FBQztBQUV0RixzQkFBc0I7QUFDdEIsTUFBTSxhQUFhLEdBQUc7SUFDcEIsTUFBTSxFQUFFLEtBQUs7SUFDYixPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBa0IsRUFBQztDQUM1QyxDQUFDO0FBQ1gsc0JBQXNCO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5RSxzQkFBc0I7QUFDdEIsTUFBTSxZQUFZLEdBQUcsS0FBSyxFQUN4QixHQUFXLEVBQ1gsU0FBNkIsRUFBRSxFQUMvQixPQUFPLEdBQUcsQ0FBQyxFQUNYLE9BQU8sR0FBRyxHQUFHLEVBQUUsdUNBQXVDO0FBQ3RELG9CQUF3QyxJQUFJLENBQUMsc0RBQXNEO0VBQ2pGLEVBQUU7SUFDcEIsTUFBTSxXQUFXLEdBQUc7UUFDbEIsR0FBRyxhQUFhO1FBQ2hCLEdBQUcsTUFBTTtLQUNWLENBQUM7SUFFRiw0Q0FBNEM7SUFDNUMsSUFBSSxp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