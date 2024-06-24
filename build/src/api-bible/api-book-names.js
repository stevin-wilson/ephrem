import axios from 'axios';
import { BooksFetchError } from './api-types.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultMaxRetries, retryOn503, sleep, } from './api-utils.js';
const getAvailableBooksURL = (bibleID) => `https://api.scripture.api.bible/v1/bibles/${bibleID}/books?include-chapters=false`;
// - - - - - - - - - -
const handleFetchBooksApiError = (error, fetchOptions) => {
    if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response) {
            const errorMessage = `An error occurred while fetching Books of the Bible. Status code: ${response.status}, Status text: ${response.statusText}`;
            throw new BooksFetchError(errorMessage, response.status, response.statusText, fetchOptions);
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
export const fetchBooks = async (options) => {
    const { bibleID, config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const url = getAvailableBooksURL(bibleID);
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
            handleFetchBooksApiError(error, options);
        }
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJvb2stbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpLWJpYmxlL2FwaS1ib29rLW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBbUIsTUFBTSxPQUFPLENBQUM7QUFDeEMsT0FBTyxFQUFlLGVBQWUsRUFBb0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRixPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLDZCQUE2QixFQUM3QiwwQkFBMEIsRUFDMUIsb0JBQW9CLEVBQ3BCLFVBQVUsRUFDVixLQUFLLEdBQ04sTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBZSxFQUFVLEVBQUUsQ0FDdkQsNkNBQTZDLE9BQU8sK0JBQStCLENBQUM7QUFFdEYsc0JBQXNCO0FBQ3RCLE1BQU0sd0JBQXdCLEdBQUcsQ0FDL0IsS0FBaUIsRUFDakIsWUFBK0IsRUFDeEIsRUFBRTtJQUNULElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNiLE1BQU0sWUFBWSxHQUFHLHFFQUFxRSxRQUFRLENBQUMsTUFBTSxrQkFBa0IsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pKLE1BQU0sSUFBSSxlQUFlLENBQ3ZCLFlBQVksRUFDWixRQUFRLENBQUMsTUFBTSxFQUNmLFFBQVEsQ0FBQyxVQUFVLEVBQ25CLFlBQVksQ0FDYixDQUFDO1FBQ0osQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUNiLG1JQUFtSSxDQUNwSSxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxJQUFJLEtBQUssQ0FDYix3RUFBd0UsQ0FDekUsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFDN0IsT0FBMEIsRUFDRCxFQUFFO0lBQzNCLE1BQU0sRUFDSixPQUFPLEVBQ1AsTUFBTSxHQUFHLG1CQUFtQixFQUFFLEVBQzlCLE9BQU8sR0FBRyxvQkFBb0IsRUFBRSxFQUNoQyxjQUFjLEdBQUcsMEJBQTBCLEVBQUUsRUFDN0MsaUJBQWlCLEdBQUcsNkJBQTZCLEVBQUUsR0FDcEQsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUUxQyw0Q0FBNEM7SUFDNUMsSUFBSSxpQkFBaUIsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNwQyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FDL0IsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQzVCLE9BQU8sRUFDUCxjQUFjLENBQ2YsQ0FBQztRQUNGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFzQixDQUFDO0lBQzlDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDOUIsd0JBQXdCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDLENBQUMifQ==