import {STATUS_CODES} from 'http';
import path from 'path';
import {homedir} from 'os';
import fs from 'fs-extra';

/**
 * Checks if the specified environment variable is set.
 * @param variable - The name of the environment variable to check.
 * @returns - True if the environment variable is set, otherwise false.
 */
export const envVariableIsSet = (variable: string): boolean =>
  !!process.env[variable];

export class HTTPError extends Error {
  statusCode: number;

  constructor(code: number, message?: string) {
    super(message ?? STATUS_CODES[code]);
    this.name = STATUS_CODES[code] ?? String(code);
    this.statusCode = code;
  }
}

export const expandHomeDir = (filePath: string): string => {
  if (filePath.startsWith('~')) {
    return path.join(homedir(), filePath.slice(1));
  }
  return filePath;
};

export type JSONFile = {
  [key: string]: unknown;
};

export async function readJsonFile(filePath: string): Promise<JSONFile> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data, dateReviver) as JSONFile;
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    throw error;
  }
}

// from https://www.bennadel.com/blog/3115-maintaining-javascript-date-values-during-deserialization-with-a-json-reviver.htm
function isString(value: any) {
  return {}.toString.call(value) === '[object String]';
}

function isSerializedDate(value: any) {
  // Dates are serialized in TZ format, example: '1981-12-20T04:00:14.000Z'.
  const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  return isString(value) && datePattern.test(value);
}

function dateReviver(key: string, value: any): any {
  if (isSerializedDate(value)) {
    return new Date(value);
  }

  return value;
}

export async function writeJsonFile(
  filePath: string,
  jsonData: string
): Promise<void> {
  // Ensure the directory exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, {recursive: true});

  // Write the JSON data to the file
  await fs.writeFile(filePath, jsonData, 'utf-8');
}

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
