/**
 * Checks if the specified environment variable is set.
 * @param variable - The name of the environment variable to check.
 * @returns - True if the environment variable is set, otherwise false.
 */
export declare const envVariableIsSet: (variable: string) => boolean;
export declare class HTTPError extends Error {
    statusCode: number;
    constructor(code: number, message?: string);
}
export declare const expandHomeDir: (filePath: string) => string;
export type JSONFile = {
    [key: string]: unknown;
};
export declare function readJsonFile(filePath: string): Promise<JSONFile>;
export declare function writeJsonFile(filePath: string, jsonData: string): Promise<void>;
export declare const sortObject: (obj: any) => any;
