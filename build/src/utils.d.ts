/**
 * Checks if an environment variable is set.
 * @param variable - The name of the environment variable.
 * @returns - Returns true if the environment variable is set, otherwise false.
 */
export declare const envVariableIsSet: (variable: string) => boolean;
/**
 * Expands the home directory path if it starts with a tilde (~).
 * @param filePath - The file path to expand.
 * @returns - The expanded file path.
 */
export declare const expandHomeDir: (filePath: string) => string;
/**
 * Function to revive serialized dates.
 * @param propName - The key of the property being processed.
 * @param potentialDateStr - The value of the property being processed.
 * @returns - The revived property value.
 */
export declare const dateReviver: (propName: string, potentialDateStr: any) => any;
/**
 * Writes JSON data to a file asynchronously.
 * @param filePath - The path to the file where the JSON data should be written.
 * @param jsonData - The JSON data to be written to the file.
 * @returns - A promise that resolves when the JSON data has been written successfully.
 * @throws {Error} - If an error occurs while creating the directory or writing the file.
 */
export declare const writeJsonFile: (filePath: string, jsonData: string) => Promise<void>;
/**
 * Recursively sorts the given object alphabetically by its keys, including nested objects and arrays.
 * @param obj - The object to be sorted.
 * @returns - The sorted object.
 */
export declare const sortObject: (obj: any) => any;
/**
 * The default cache directory for storing data.
 */
export declare const defaultCacheDir: string;
/**
 * Removes periods from a given string.
 * @param input - The input string from which periods should be removed.
 * @returns - The input string without periods.
 */
export declare const removePeriod: (input: string) => string;
/**
 * Calculates the threshold date based on the maximum age in days and the current timestamp (optional).
 * @param maxAgeDays - The maximum age in days.
 * @param [currentTimestamp] - The current timestamp. If not provided, the current date and time will be used.
 * @returns The threshold date.
 */
export declare const getThresholdDate: (maxAgeDays: number, currentTimestamp?: Date) => Date;
