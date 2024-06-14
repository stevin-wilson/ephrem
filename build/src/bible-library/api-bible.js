import 'dotenv/config';
import axios from 'axios';
import createError from 'http-errors';
// - - - - - - - - - -
const defaultConfig = {
    method: 'GET',
    headers: { 'api-key': process.env.API_BIBLE_API_KEY },
};
// - - - - - - - - - -
/**
 * Returns the URL for retrieving available Bibles based on the specified language.
 * @param language - ISO 639-3 three digit language code of the desired Bibles.
 * @returns The URL for retrieving available Bibles.
 */
const getAvailableBiblesURL = (language) => `https://api.scripture.api.bible/v1/bibles?language=${language}`;
// - - - - - - - - - -
/**
 * Returns the URL for getting available books based on the given Bible ID.
 * @param bibleID - The ID of the Bible for which the available books URL is requested.
 * @returns The URL for getting available books.
 */
const getAvailableBooksURL = (bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;
// - - - - - - - - - -
/**
 * Delays the execution by the specified number of milliseconds.
 * @param ms - The number of milliseconds to delay the execution.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// - - - - - - - - - -
/**
 * Retries a given function call if it fails due to a 503-error response.
 * @param fn - The function to be retried.
 * @param [retries] - The number of retries to attempt.
 * @param [initialBackoff] - The initial backoff duration in milliseconds.
 * @returns The result of the function call.
 * @throws {Error} If the maximum number of retries is reached, or if an error occurs while processing the request.
 */
const retryOn503 = async (fn, retries = 3, initialBackoff = 300) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            if (axios.isAxiosError(error) &&
                error.response?.status === 503 &&
                attempt < retries) {
                await sleep(initialBackoff * Math.pow(2, attempt)); // exponential backoff
                continue;
            }
            // createError helper to create an error with a specific status code
            if (axios.isAxiosError(error) &&
                error.response?.status === 503 &&
                attempt === retries) {
                throw createError(503, 'Service is temporarily unavailable. Please try again later.');
            }
            let errorMessage = 'An error occurred while processing your request.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }
    throw createError(503, 'Service is temporarily unavailable. Maximum number of retries have been exhausted.');
};
/**
 * Fetches data from an API using Axios.
 * @param url - The URL of the API.
 * @param [config] - The configuration object for Axios.
 * @param [delayBetweenCalls] - The delay between consecutive API calls in milliseconds.
 * @returns A Promise that resolves to the fetched data.
 */
const fetchFromAPI = async (url, config = {}, delayBetweenCalls = 1000 // delay between consecutive API calls in milliseconds
) => {
    const finalConfig = {
        ...defaultConfig,
        ...config,
    };
    // Wait for delay before making the API call
    if (delayBetweenCalls !== undefined) {
        await sleep(delayBetweenCalls);
    }
    return await retryOn503(() => axios.get(url, finalConfig).then(response => response.data.data));
};
// - - - - - - - - - -
/**
 * Fetches the available Bibles based on the provided language.
 * @param language - ISO 639-3 three digit language code for the desired language.
 * @param [config] - Optional configuration for the API request.
 * @returns - A Promise that resolves to an array of BibleResponse objects.
 */
export const fetchBibles = async (language, config = {}) => {
    const url = getAvailableBiblesURL(language);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
/**
 * Fetches the available books for a given bible ID.
 * @param bibleID - The ID of the bible.
 * @param [config] - The Axios request configuration options (optional).
 * @returns - A Promise that resolves with an array of BookResponse objects.
 */
export const fetchBooks = async (bibleID, config = {}) => {
    const url = getAvailableBooksURL(bibleID);
    return (await fetchFromAPI(url, config));
};
// - - - - - - - - - -
/**
 * Returns the URL for retrieving a passage from the scripture API.
 * @param passageID - The unique identifier for the passage.
 * @param bibleID - The unique identifier for the bible.
 * @param passageOptions - The options for retrieving the passage (optional).
 * @returns The URL for retrieving the passage.
 */
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
/**
 * Represents an error that occurs during the passage retrieval from API.Bible.
 */
class PassageError extends Error {
    constructor(message, statusCode, statusText) {
        super(message);
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.name = 'PassageError';
    }
}
// - - - - - - - - - -
/**
 * Fetches a Bible passage by ID and Bible ID.
 * @async
 * @param passageID - The ID of the passage to fetch.
 * @param bibleID - The ID of the Bible from which to fetch the passage.
 * @param [passageOptions] - Optional parameters for fetching the passage.
 * @param [config] - Optional configuration for the Axios HTTP client.
 * @returns - A promise that resolves to the fetched passage and Fums (Find, Usages, Metadata, and Statistics) response.
 * @throws {PassageError} - If an error occurs during the passage fetch, a PassageError is thrown with relevant error details.
 */
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
        if (axios.isAxiosError(error)) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new PassageError('Bad request. Please check your request content', error.response.status, error.response.statusText);
                    case 404:
                        throw new PassageError('Invalid passage or bible id.', error.response.status, error.response.statusText);
                    default:
                        throw new PassageError('An error occurred while fetching the passage.', error.response.status, error.response.statusText);
                }
            }
            else if (error.request) {
                throw new PassageError('No response received from API. Please check your connection or API endpoint.', 0, '');
            }
            else {
                throw new PassageError('An error occurred in the request setup.', 0, '');
            }
        }
        else {
            throw new PassageError('An unexpected error occurred.', 0, '');
        }
    }
};
// - - - - - - - - - -
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJpYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JpYmxlLWxpYnJhcnkvYXBpLWJpYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sS0FBMkIsTUFBTSxPQUFPLENBQUM7QUFPaEQsT0FBTyxXQUFXLE1BQU0sYUFBYSxDQUFDO0FBRXRDLHNCQUFzQjtBQUN0QixNQUFNLGFBQWEsR0FBRztJQUNwQixNQUFNLEVBQUUsS0FBSztJQUNiLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFrQixFQUFDO0NBQzVDLENBQUM7QUFDWCxzQkFBc0I7QUFDdEI7Ozs7R0FJRztBQUNILE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxRQUFnQixFQUFVLEVBQUUsQ0FDekQsc0RBQXNELFFBQVEsRUFBRSxDQUFDO0FBQ25FLHNCQUFzQjtBQUN0Qjs7OztHQUlHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE9BQWUsRUFBVSxFQUFFLENBQ3ZELDZDQUE2QyxPQUFPLCtCQUErQixDQUFDO0FBRXRGLHNCQUFzQjtBQUN0Qjs7OztHQUlHO0FBQ0gsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlFLHNCQUFzQjtBQUN0Qjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUN0QixFQUFvQixFQUNwQixPQUFPLEdBQUcsQ0FBQyxFQUNYLGNBQWMsR0FBRyxHQUFHLEVBQ1IsRUFBRTtJQUNkLEtBQUssSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sSUFBSSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUM7WUFDSCxPQUFP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