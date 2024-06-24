// - - - - - - - - - -
import axios from 'axios';
import { BiblesFetchError, } from './api-types.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultMaxRetries, retryOn503, sleep, } from './api-utils.js';
import { normalizeLanguage } from '../utils.js';
const getAvailableBiblesURL = (language) => {
    const baseURL = 'https://api.scripture.api.bible/v1/bibles';
    return language
        ? `${baseURL}?language=${normalizeLanguage(language)}`
        : baseURL;
};
// - - - - - - - - - -
const handleFetchBiblesApiError = (error, fetchOptions) => {
    if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response) {
            const errorMessage = `An error occurred while fetching Bibles. Status code: ${response.status}, Status text: ${response.statusText}`;
            throw new BiblesFetchError(errorMessage, response.status, response.statusText, fetchOptions);
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
export const fetchBibles = async (options) => {
    const { language = undefined, config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const url = getAvailableBiblesURL(language);
    // Wait for delay before making the API call
    if (delayBetweenCalls !== undefined) {
        await sleep(delayBetweenCalls);
    }
    try {
        const response = await retryOn503(() => axios.get(url, config), retries, initialBackoff);
        return response.data.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            handleFetchBiblesApiError(error, options);
        }
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJpYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGktYmlibGUvYXBpLWJpYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFDdEIsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBRUwsZ0JBQWdCLEdBRWpCLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUNMLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLG9CQUFvQixFQUNwQixVQUFVLEVBQ1YsS0FBSyxHQUNOLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTlDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxRQUFpQixFQUFVLEVBQUU7SUFDMUQsTUFBTSxPQUFPLEdBQUcsMkNBQTJDLENBQUM7SUFDNUQsT0FBTyxRQUFRO1FBQ2IsQ0FBQyxDQUFDLEdBQUcsT0FBTyxhQUFhLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3RELENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsTUFBTSx5QkFBeUIsR0FBRyxDQUNoQyxLQUFpQixFQUNqQixZQUFnQyxFQUN6QixFQUFFO0lBQ1QsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDOUIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2IsTUFBTSxZQUFZLEdBQUcseURBQXlELFFBQVEsQ0FBQyxNQUFNLGtCQUFrQixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDckksTUFBTSxJQUFJLGdCQUFnQixDQUN4QixZQUFZLEVBQ1osUUFBUSxDQUFDLE1BQU0sRUFDZixRQUFRLENBQUMsVUFBVSxFQUNuQixZQUFZLENBQ2IsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FDYixtSUFBbUksQ0FDcEksQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sSUFBSSxLQUFLLENBQ2Isd0VBQXdFLENBQ3pFLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQzlCLE9BQTJCLEVBQ0QsRUFBRTtJQUM1QixNQUFNLEVBQ0osUUFBUSxHQUFHLFNBQVMsRUFDcEIsTUFBTSxHQUFHLG1CQUFtQixFQUFFLEVBQzlCLE9BQU8sR0FBRyxvQkFBb0IsRUFBRSxFQUNoQyxjQUFjLEdBQUcsMEJBQTBCLEVBQUUsRUFDN0MsaUJBQWlCLEdBQUcsNkJBQTZCLEVBQUUsR0FDcEQsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1Qyw0Q0FBNEM7SUFDNUMsSUFBSSxpQkFBaUIsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNwQyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FDL0IsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQzVCLE9BQU8sRUFDUCxjQUFjLENBQ2YsQ0FBQztRQUNGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUF1QixDQUFDO0lBQy9DLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDOUIseUJBQXlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDRCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDLENBQUMifQ==