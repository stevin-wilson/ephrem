// – – – – – – – – – –
import envPaths from "env-paths";

export const PROJECT_NAME = "ephrem";

export const ephremPaths = envPaths(PROJECT_NAME);

export const removePunctuation = (input: string): string =>
	input.replace(/\p{P}/gu, "");

// – – – – – – – – – –
export const normalizeBookName = (bookName: string): string =>
	removePunctuation(bookName).toLowerCase();

// – – – – – – – – – –
/**
 * Represents a base error class for the Ephrem project.
 * Extends the built-in Error class to include additional context information.
 */
export class BaseEphremError extends Error {
	/**
	 * A record containing additional context information about the error.
	 * @type {Record<string, unknown>}
	 */
	public context: Record<string, unknown>;

	/**
	 * Creates an instance of BaseEphremError.
	 * @param message The error message to show to the user.
	 */
	constructor(message: string) {
		super(message);
		this.name = "BaseEphremError";
		this.context = {};
	}
}
