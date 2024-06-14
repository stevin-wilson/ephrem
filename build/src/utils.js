import path from 'path';
import { homedir } from 'os';
import fs from 'fs-extra';
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
export const defaultCacheDir = expandHomeDir(process.env.CACHE_PATH || '~/ephrem/cache');
/**
 * Removes periods from a given string.
 * @param input - The input string from which periods should be removed.
 * @returns - The input string without periods.
 */
export const removePeriod = (input) => input.replace(/\./g, '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxJQUFJLENBQUM7QUFDM0IsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFFBQWdCLEVBQVcsRUFBRSxDQUM1RCxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUxQjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBZ0IsRUFBVSxFQUFFO0lBQ3hELE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztRQUNyRixDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO0lBQzlCLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssaUJBQWlCLENBQUM7QUFDdkQsQ0FBQyxDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO0lBQ3RDLDBFQUEwRTtJQUMxRSxNQUFNLFdBQVcsR0FBRywrQ0FBK0MsQ0FBQztJQUVwRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELENBQUMsQ0FBQztBQUVG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