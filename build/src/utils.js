import { STATUS_CODES } from 'http';
import path from 'path';
import { homedir } from 'os';
import fs from 'fs-extra';
/**
 * Checks if the specified environment variable is set.
 * @param variable - The name of the environment variable to check.
 * @returns - True if the environment variable is set, otherwise false.
 */
export const envVariableIsSet = (variable) => !!process.env[variable];
export class HTTPError extends Error {
    constructor(code, message) {
        super(message ?? STATUS_CODES[code]);
        this.name = STATUS_CODES[code] ?? String(code);
        this.statusCode = code;
    }
}
export const expandHomeDir = (filePath) => {
    if (filePath.startsWith('~')) {
        return path.join(homedir(), filePath.slice(1));
    }
    return filePath;
};
/**
 *
 * @param filePath
 */
export async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data, dateReviver);
    }
    catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        throw error;
    }
}
// from https://www.bennadel.com/blog/3115-maintaining-javascript-date-values-during-deserialization-with-a-json-reviver.htm
/**
 *
 * @param value
 */
function isString(value) {
    return {}.toString.call(value) === '[object String]';
}
/**
 *
 * @param value
 */
function isSerializedDate(value) {
    // Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isString(value) && datePattern.test(value);
}
/**
 *
 * @param key
 * @param value
 */
function dateReviver(key, value) {
    if (isSerializedDate(value)) {
        return new Date(value);
    }
    return value;
}
/**
 *
 * @param filePath
 * @param jsonData
 */
export async function writeJsonFile(filePath, jsonData) {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    // Write the JSON data to the file
    await fs.writeFile(filePath, jsonData, 'utf-8');
}
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
export const cleanUpOldRecords = (map, maxAgeDays = 14) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
    const cleanedMap = new Map();
    map.forEach((value, key) => {
        if (value.cachedOn > thresholdDate) {
            cleanedMap.set(key, value);
        }
    });
    return cleanedMap;
};
export const defaultCacheDir = expandHomeDir(process.env.CACHE_PATH || '~/ephrem/cache');
export const removePeriod = (input) => input.replace(/\./g, '');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLElBQUksQ0FBQztBQUMzQixPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHMUI7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBZ0IsRUFBVyxFQUFFLENBQzVELENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTFCLE1BQU0sT0FBTyxTQUFVLFNBQVEsS0FBSztJQUdsQyxZQUFZLElBQVksRUFBRSxPQUFnQjtRQUN4QyxLQUFLLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFnQixFQUFVLEVBQUU7SUFDeEQsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxZQUFZLENBQUMsUUFBZ0I7SUFDakQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBYSxDQUFDO0lBQ25ELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBRUQsNEhBQTRIO0FBQzVIOzs7R0FHRztBQUNILFNBQVMsUUFBUSxDQUFDLEtBQVU7SUFDMUIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztBQUN2RCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFVO0lBQ2xDLDBFQUEwRTtJQUMxRSxNQUFNLFdBQVcsR0FBRywrQ0FBK0MsQ0FBQztJQUVwRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxXQUFXLENBQUMsR0FBVyxFQUFFLEtBQVU7SUFDMUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLGFBQWEsQ0FDakMsUUFBZ0IsRUFDaEIsUUFBZ0I7SUFFaEIsOEJBQThCO0lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBRXZDLGtDQUFrQztJQUNsQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBUSxFQUFPLEVBQUU7SUFDMUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDdkIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7U0FBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDbkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNwQixJQUFJLEVBQUU7YUFDTixNQUFNLENBQUMsQ0FBQyxNQUFXLEVBQUUsR0FBVyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQyxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUMvQixHQUFjLEVBQ2QsVUFBVSxHQUFHLEVBQUUsRUFDSixFQUFFO0lBQ2IsTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNqQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUU1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBUSxDQUFDO0lBRW5DLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDekIsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLGFBQWEsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBVyxhQUFhLENBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGdCQUFnQixDQUMzQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBYSxFQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyJ9