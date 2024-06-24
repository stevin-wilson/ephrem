import axios, {AxiosError} from 'axios';
import {BookResponse, BooksFetchError, FetchBooksOptions} from './api-types.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultMaxRetries,
  retryOn503,
  sleep,
} from './api-utils.js';

const getAvailableBooksURL = (bibleID: string): string =>
  `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;

// - - - - - - - - - -
const handleFetchBooksApiError = (
  error: AxiosError,
  fetchOptions: FetchBooksOptions
): never => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const errorMessage = `An error occurred while fetching Books of the Bible. Status code: ${response.status}, Status text: ${response.statusText}`;
      throw new BooksFetchError(
        errorMessage,
        response.status,
        response.statusText,
        fetchOptions
      );
    } else {
      throw new Error(
        'No response received from API. Please check your connection or API endpoint. This usually means that the server is not reachable.'
      );
    }
  } else {
    throw new Error(
      'An unexpected error occurred. Please check your request and try again.'
    );
  }
};

// - - - - - - - - - -
export const fetchBooks = async (
  options: FetchBooksOptions
): Promise<BookResponse[]> => {
  const {
    bibleID,
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  const url = getAvailableBooksURL(bibleID);

  // Wait for delay before making the API call
  if (delayBetweenCalls !== undefined) {
    await sleep(delayBetweenCalls);
  }

  try {
    const response = await retryOn503(
      () => axios.get(url, config),
      retries,
      initialBackoff
    );
    return response.data.data as BookResponse[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleFetchBooksApiError(error, options);
    }
    throw error;
  }
};
