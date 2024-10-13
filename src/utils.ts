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
// BaseError class
export class BaseEphremError extends Error {
	public context: Record<string, unknown>;

	constructor(message: string) {
		super(message);
		this.name = "BaseEphremError";
		this.context = {};
	}
}
