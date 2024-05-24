import {STATUS_CODES} from 'http';

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
