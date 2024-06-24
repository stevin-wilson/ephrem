import path from 'path';
import { homedir } from 'os';
import fs from 'fs-extra';
import Conf from 'conf';
const ISO_693_3_REGEX = /^[a-z]{3}$/;
export const config = new Conf({ projectName: 'ephrem' });
/**
 * Checks if an environment variable is set.
 * @param variable - The name of the environment variable.
 * @returns - Returns true if the environment variable is set, otherwise false.
 */
export const envVariableIsSet = (variable) => !!process.env[variable];
/**
 * Expands the home directory path if it starts with a tilde (~).
 * @param filePath - The file path to expand.
 * @returns - The expanded file path.
 */
export const expandHomeDir = (filePath) => {
    return filePath.startsWith('~')
        ? path.join(homedir(), filePath.slice(1)) // Slice to remove `~` present at the start
        : filePath;
};
/**
 * Determine if a value is a string.
 * from https://www.bennadel.com/blog/3115-maintaining-javascript-date-values-during-deserialization-with-a-json-reviver.htm
 * @param value - The value to check.
 * @returns - Returns true if the value is a string, false otherwise.
 */
const isString = (value) => {
    return {}.toString.call(value) === '[object String]';
};
/**
 * Checks if a given value is a serialized date.
 *
 * Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
 * @param value - The value to be checked.
 * @returns - Return `true` if the value is a serialized date, otherwise `false`.
 */
const isSerializedDate = (value) => {
    // Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isString(value) && datePattern.test(value);
};
/**
 * Function to revive serialized dates.
 * @param propName - The key of the property being processed.
 * @param potentialDateStr - The value of the property being processed.
 * @returns - The revived property value.
 */
export const dateReviver = (propName, potentialDateStr) => {
    if (isSerializedDate(potentialDateStr)) {
        return new Date(potentialDateStr);
    }
    return potentialDateStr;
};
/**
 * Writes JSON data to a file asynchronously.
 * @param filePath - The path to the file where the JSON data should be written.
 * @param jsonData - The JSON data to be written to the file.
 * @returns - A promise that resolves when the JSON data has been written successfully.
 * @throws {Error} - If an error occurs while creating the directory or writing the file.
 */
export const writeJsonFile = async (filePath, jsonData) => {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    // Write the JSON data to the file
    await fs.writeFile(filePath, jsonData, 'utf-8');
};
/**
 * Recursively sorts the given object alphabetically by its keys, including nested objects and arrays.
 * @param obj - The object to be sorted.
 * @returns - The sorted object.
 */
export const sortObject = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }
    else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
            result[key] = sortObject(obj[key]);
            return result;
        }, {});
    }
    return obj;
};
/**
 * The default cache directory for storing data.
 */
/**
 * Calculates the threshold date based on the maximum age in days and the current timestamp (optional).
 * @param maxAgeDays - The maximum age in days.
 * @param [currentTimestamp] - The current timestamp. If not provided, the current date and time will be used.
 * @returns The threshold date.
 */
export const getThresholdDate = (maxAgeDays, currentTimestamp) => {
    const thresholdDate = currentTimestamp ? currentTimestamp : new Date();
    thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
    return thresholdDate;
};
/**
 * Removes punctuation from a given string.
 * @param input - The input string from which punctuation should be removed.
 * @returns - The input string without punctuation.
 */
export const removePunctuation = (input) => input.replace(/\p{P}/gu, '');
export const normalizeBookName = (bookName) => removePunctuation(bookName).toLowerCase();
// - - - - - - - - - -
export const normalizeLanguage = (language) => {
    return removePunctuation(language).trim().toLowerCase();
};
export const isIso6933Code = (language) => {
    return ISO_693_3_REGEX.test(language);
};
export const getValidLanguages = (languages) => {
    return languages.map(s => normalizeLanguage(s)).filter(s => isIso6933Code(s));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxJQUFJLENBQUM7QUFDM0IsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUV4QixNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUM7QUFFckMsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7QUFFeEQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBZ0IsRUFBVyxFQUFFLENBQzVELENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFnQixFQUFVLEVBQUU7SUFDeEQsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMkNBQTJDO1FBQ3JGLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7SUFDOUIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztBQUN2RCxDQUFDLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7SUFDdEMsMEVBQTBFO0lBQzFFLE1BQU0sV0FBVyxHQUFHLCtDQUErQyxDQUFDO0lBRXBFLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFnQixFQUFFLGdCQUFxQixFQUFPLEVBQUU7SUFDMUUsSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7UUFDdkMsT0FBTyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQ2hDLFFBQWdCLEVBQ2hCLFFBQWdCLEVBQ0QsRUFBRTtJQUNqQiw4QkFBOEI7SUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFFdkMsa0NBQWtDO0lBQ2xDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFRLEVBQU8sRUFBRTtJQUMxQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN2QixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0IsQ0FBQztTQUFNLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ3BCLElBQUksRUFBRTthQUNOLE1BQU0sQ0FBQyxDQUFDLE1BQVcsRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUNuQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBRUg7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUM5QixVQUFrQixFQUNsQixnQkFBdUIsRUFDakIsRUFBRTtJQUNSLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUN2RSxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUM1RCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRSxDQUN6RCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUUvQixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFFBQWdCLEVBQVUsRUFBRSxDQUM1RCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUU1QyxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxRQUFnQixFQUFrQixFQUFFO0lBQ3BFLE9BQU8saUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDMUQsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBZ0IsRUFBVyxFQUFFO0lBQ3pELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFNBQW1CLEVBQVksRUFBRTtJQUNqRSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUMsQ0FBQyJ9