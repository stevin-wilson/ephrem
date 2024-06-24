// - - - - - - - - - -
import axios, {AxiosError} from 'axios';
import {
  BibleResponse,
  BiblesFetchError,
  FetchBiblesOptions,
} from './api-types.js';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultMaxRetries,
  retryOn503,
  sleep,
} from './api-utils.js';
import {normalizeLanguage} from '../utils.js';

const getAvailableBiblesURL = (language?: string): string => {
  const baseURL = 'https://api.scripture.api.bible/v1/bibles';
  return language
    ? `${baseURL}?language=${normalizeLanguage(language)}`
    : baseURL;
};

// - - - - - - - - - -
const handleFetchBiblesApiError = (
  error: AxiosError,
  fetchOptions: FetchBiblesOptions
): never => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const errorMessage = `An error occurred while fetching Bibles. Status code: ${response.status}, Status text: ${response.statusText}`;
      throw new BiblesFetchError(
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
export const fetchBibles = async (
  options: FetchBiblesOptions
): Promise<BibleResponse[]> => {
  const {
    language = undefined,
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  const url = getAvailableBiblesURL(language);

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
    return response.data.data as BibleResponse[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleFetchBiblesApiError(error, options);
    }
    throw error;
  }
};
