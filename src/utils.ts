// – – – – – – – – – –
import envPaths from "env-paths";
import fs from "node:fs";
// – – – – – – – – – –
export const PROJECT_NAME = "ephrem";
// – – – – – – – – – –
export const ephremPaths = envPaths(PROJECT_NAME);
// – – – – – – – – – –
export const createDataDir = async () => {
	try {
		// Try to create the directory
		await fs.promises.mkdir(ephremPaths.data, { recursive: true });
		console.log("Created Ephrem Data Directory successfully.");
	} catch (error) {
		// Handle the case where the directory already exists or any other error
		if (error instanceof Error && "code" in error && error.code === "EEXIST") {
			console.log("Ephrem Data Directory already exists.");
		} else {
			console.error("Error creating Ephrem Data Directory:", error);
		}
	}
};

// – – – – – – – – – –
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
