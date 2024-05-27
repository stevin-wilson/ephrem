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
