import path from 'path';
import {homedir} from 'os';
import fs from 'fs-extra';
import Conf from 'conf';

const ISO_693_3_REGEX = /^[a-z]{3}$/;

export const config = new Conf({projectName: 'ephrem'});

/**
 * Checks if an environment variable is set.
 * @param variable - The name of the environment variable.
 * @returns - Returns true if the environment variable is set, otherwise false.
 */
export const envVariableIsSet = (variable: string): boolean =>
  !!process.env[variable];

/**
 * Expands the home directory path if it starts with a tilde (~).
 * @param filePath - The file path to expand.
 * @returns - The expanded file path.
 */
export const expandHomeDir = (filePath: string): string => {
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
const isString = (value: any) => {
  return {}.toString.call(value) === '[object String]';
};

/**
 * Checks if a given value is a serialized date.
 *
 * Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
 * @param value - The value to be checked.
 * @returns - Return `true` if the value is a serialized date, otherwise `false`.
 */
const isSerializedDate = (value: any) => {
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
export const dateReviver = (propName: string, potentialDateStr: any): any => {
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
export const writeJsonFile = async (
  filePath: string,
  jsonData: string
): Promise<void> => {
  // Ensure the directory exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, {recursive: true});

  // Write the JSON data to the file
  await fs.writeFile(filePath, jsonData, 'utf-8');
};

/**
 * Recursively sorts the given object alphabetically by its keys, including nested objects and arrays.
 * @param obj - The object to be sorted.
 * @returns - The sorted object.
 */
export const sortObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
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
 * @param [timestamp] - The current timestamp. If not provided, the current date and time will be used.
 * @returns The threshold date.
 */
export const getThresholdDate = (
  maxAgeDays: number,
  timestamp?: Date
): Date => {
  const thresholdDate = timestamp ? timestamp : new Date();
  thresholdDate.setDate(thresholdDate.getDate() - maxAgeDays);
  return thresholdDate;
};

/**
 * Removes punctuation from a given string.
 * @param input - The input string from which punctuation should be removed.
 * @returns - The input string without punctuation.
 */
export const removePunctuation = (input: string): string =>
  input.replace(/\p{P}/gu, '');

export const normalizeBookName = (bookName: string): string =>
  removePunctuation(bookName).toLowerCase();

// - - - - - - - - - -
export const normalizeLanguage = (language: string): string | never => {
  return removePunctuation(language).trim().toLowerCase();
};

export const isIso6933Code = (language: string): boolean => {
  return ISO_693_3_REGEX.test(language);
};

export const getValidLanguages = (languages: string[]): string[] => {
  return languages.map(s => normalizeLanguage(s)).filter(s => isIso6933Code(s));
};
