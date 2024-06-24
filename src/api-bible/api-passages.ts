import {
  FetchPassageOptions,
  PassageAndFumsResponse,
  PassageFetchError,
  PassageOptions,
} from './api-types.js';
import {DEFAULT_PASSAGE_OPTIONS} from './api-constants.js';
import axios, {AxiosError} from 'axios';
import {
  getDefaultApiConfig,
  getDefaultDelayBetweenCallsMs,
  getDefaultInitialBackoffMs,
  getDefaultMaxRetries,
  getDefaultPassageOptions,
  retryOn503,
  sleep,
} from './api-utils.js';

const getPassageURL = (
  passageID: string,
  bibleID: string,
  passageOptions: PassageOptions = getDefaultPassageOptions()
): string => {
  const {
    contentType = 'text',
    includeNotes = false,
    includeTitles = false,
    includeChapterNumbers = false,
    includeVerseNumbers = false,
    includeVerseSpans = false,
  } = passageOptions;

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
const handleFetchPassageApiError = (
  error: AxiosError,
  fetchOptions: FetchPassageOptions
): never => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const errorMessage = `An error occurred while fetching Passage. Status code: ${response.status}, Status text: ${response.statusText}`;
      throw new PassageFetchError(
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
export const fetchPassage = async (
  options: FetchPassageOptions
): Promise<PassageAndFumsResponse> => {
  const {
    passageID,
    bibleID,
    passageOptions = DEFAULT_PASSAGE_OPTIONS,
    config = getDefaultApiConfig(),
    retries = getDefaultMaxRetries(),
    initialBackoff = getDefaultInitialBackoffMs(),
    delayBetweenCalls = getDefaultDelayBetweenCallsMs(),
  } = options;

  const url = getPassageURL(passageID, bibleID, passageOptions);

  const passageRequest = async () => {
    const response = await axios.get(url, config);
    return response.data as PassageAndFumsResponse;
  };

  // Wait for delay before making the API call
  if (delayBetweenCalls !== undefined) {
    await sleep(delayBetweenCalls);
  }

  try {
    return await retryOn503(passageRequest, retries, initialBackoff);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleFetchPassageApiError(error, options);
    }
    throw error;
  }
};
