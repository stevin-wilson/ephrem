import { PassageFetchError, } from './api-types.js';
import { DEFAULT_PASSAGE_OPTIONS } from './api-constants.js';
import axios from 'axios';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultMaxRetries, getDefaultPassageOptions, retryOn503, sleep, } from './api-utils.js';
const getPassageURL = (passageID, bibleID, passageOptions = getDefaultPassageOptions()) => {
    const { contentType = 'text', includeNotes = false, includeTitles = false, includeChapterNumbers = false, includeVerseNumbers = false, includeVerseSpans = false, } = passageOptions;
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
const handleFetchPassageApiError = (error, fetchOptions) => {
    if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response) {
            const errorMessage = `An error occurred while fetching Passage. Status code: ${response.status}, Status text: ${response.statusText}`;
            throw new PassageFetchError(errorMessage, response.status, response.statusText, fetchOptions);
        }
        else {
            throw new Error('No response received from API. Please check your connection or API endpoint. This usually means that the server is not reachable.');
        }
    }
    else {
        throw new Error('An unexpected error occurred. Please check your request and try again.');
    }
};
// - - - - - - - - - -
export const fetchPassage = async (options) => {
    const { passageID, bibleID, passageOptions = DEFAULT_PASSAGE_OPTIONS, config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const url = getPassageURL(passageID, bibleID, passageOptions);
    const passageRequest = async () => {
        const response = await axios.get(url, config);
        return response.data;
    };
    // Wait for delay before making the API call
    if (delayBetweenCalls !== undefined) {
        await sleep(delayBetweenCalls);
    }
    try {
        return await retryOn503(passageRequest, retries, initialBackoff);
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            handleFetchPassageApiError(error, options);
        }
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLXBhc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS1iaWJsZS9hcGktcGFzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLGlCQUFpQixHQUVsQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzNELE9BQU8sS0FBbUIsTUFBTSxPQUFPLENBQUM7QUFDeEMsT0FBTyxFQUNMLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLG9CQUFvQixFQUNwQix3QkFBd0IsRUFDeEIsVUFBVSxFQUNWLEtBQUssR0FDTixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE1BQU0sYUFBYSxHQUFHLENBQ3BCLFNBQWlCLEVBQ2pCLE9BQWUsRUFDZixpQkFBaUMsd0JBQXdCLEVBQUUsRUFDbkQsRUFBRTtJQUNWLE1BQU0sRUFDSixXQUFXLEdBQUcsTUFBTSxFQUNwQixZQUFZLEdBQUcsS0FBSyxFQUNwQixhQUFhLEdBQUcsS0FBSyxFQUNyQixxQkFBcUIsR0FBRyxLQUFLLEVBQzdCLG1CQUFtQixHQUFHLEtBQUssRUFDM0IsaUJBQWlCLEdBQUcsS0FBSyxHQUMxQixHQUFHLGNBQWMsQ0FBQztJQUVuQixzRUFBc0U7SUFDdEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUM7UUFDakMsY0FBYyxFQUFFLFdBQVc7UUFDM0IsZUFBZSxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDeEMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRTtRQUMxQyx5QkFBeUIsRUFBRSxxQkFBcUIsQ0FBQyxRQUFRLEVBQUU7UUFDM0QsdUJBQXVCLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxFQUFFO1FBQ3ZELHFCQUFxQixFQUFFLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtRQUNuRCxZQUFZLEVBQUUsT0FBTztLQUN0QixDQUFDLENBQUM7SUFFSCxPQUFPLDZDQUE2QyxPQUFPLGFBQWEsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO0FBQzNHLENBQUMsQ0FBQztBQUVGLHNCQUFzQjtBQUN0QixNQUFNLDBCQUEwQixHQUFHLENBQ2pDLEtBQWlCLEVBQ2pCLFlBQWlDLEVBQzFCLEVBQUU7SUFDVCxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksUUFBUSxFQUFFLENBQUM7WUFDYixNQUFNLFlBQVksR0FBRywwREFBMEQsUUFBUSxDQUFDLE1BQU0sa0JBQWtCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN0SSxNQUFNLElBQUksaUJBQWlCLENBQ3pCLFlBQVksRUFDWixRQUFRLENBQUMsTUFBTSxFQUNmLFFBQVEsQ0FBQyxVQUFVLEVBQ25CLFlBQVksQ0FDYixDQUFDO1FBQ0osQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUNiLG1JQUFtSSxDQUNwSSxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxJQUFJLEtBQUssQ0FDYix3RUFBd0UsQ0FDekUsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFDL0IsT0FBNEIsRUFDSyxFQUFFO0lBQ25DLE1BQU0sRUFDSixTQUFTLEVBQ1QsT0FBTyxFQUNQLGNBQWMsR0FBRyx1QkFBdUIsRUFDeEMsTUFBTSxHQUFHLG1CQUFtQixFQUFFLEVBQzlCLE9BQU8sR0FBRyxvQkFBb0IsRUFBRSxFQUNoQyxjQUFjLEdBQUcsMEJBQTBCLEVBQUUsRUFDN0MsaUJBQWlCLEdBQUcsNkJBQTZCLEVBQUUsR0FDcEQsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUU5RCxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtRQUNoQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLE9BQU8sUUFBUSxDQUFDLElBQThCLENBQUM7SUFDakQsQ0FBQyxDQUFDO0lBRUYsNENBQTRDO0lBQzVDLElBQUksaUJBQWlCLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDcEMsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsT0FBTyxNQUFNLFVBQVUsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDOUIsMEJBQTBCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDLENBQUMifQ==