// – – – – – – – – – –
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import axiosRetry from "axios-retry";
import * as fs from "node:fs";
import path from "node:path";

import {
	BaseEphremError,
	ephremPaths,
	normalizeBookName,
	removePunctuation,
} from "./utils.js";

// – – – – – – – – – –
const API_BIBLE_BASE_URL = "https://api.scripture.api.bible";
const API_BIBLE_TIMEOUT = 10000;
const ISO_693_3_REGEX = /^[a-z]{3}$/;

export const BIBLES_DATA_PATH = path.join(ephremPaths.data, "bibles.json");
export const ABB_TO_ID_MAPPING_PATH = path.join(
	ephremPaths.data,
	"bibles-map.json",
);
export const BOOKS_DATA_PATH = path.join(ephremPaths.data, "books.json");
export const NAMES_TO_BIBLES_PATH = path.join(
	ephremPaths.data,
	"book-names-to-bibles.json",
);

// – – – – – – – – – –
export class ApiBibleKeyNotFoundError extends BaseEphremError {
	constructor() {
		super("API.Bible Key not found. Please provide a valid API key.");
		this.name = "ApiBibleKeyNotFoundError";
		this.context = {};
	}
}

// – – – – – – – – – –
export const hasApiBibleKey = (): boolean => {
	return process.env.API_BIBLE_API_KEY !== undefined;
};

// – – – – – – – – – –
export class InvalidLanguageIDError extends BaseEphremError {
	public context: {
		languageId: string;
	};

	constructor(languageId: string) {
		super("Language ID does not match ISO 639-3 format (lower case)");
		this.name = "InvalidLanguageIDError";
		this.context = { languageId };
	}
}

// – – – – – – – – – –
export class BiblesNotAvailableError extends BaseEphremError {
	public context: {
		languageId: string;
	};

	constructor(languageId: string) {
		super(
			"No Bibles were available for the given language using the specified API.Bible key",
		);
		this.name = "BiblesNotAvailableError";
		this.context = { languageId };
	}
}

// – – – – – – – – – –
export class BiblesFetchError extends BaseEphremError {
	public context: {
		languageId: string;
		statusCode: number | undefined;
		statusText: string | undefined;
	};

	constructor(
		message: string,
		languageId: string,
		public statusCode: number | undefined,
		public statusText: string | undefined,
	) {
		super(message);
		this.name = "BiblesFetchError";
		this.context = { languageId, statusCode, statusText };
	}
}

// – – – – – – – – – –
export class BooksFetchError extends BaseEphremError {
	public context: {
		bibleId: string;
		statusCode: number | undefined;
		statusText: string | undefined;
	};

	constructor(
		message: string,
		bibleId: string,
		public statusCode: number | undefined,
		public statusText: string | undefined,
	) {
		super(message);
		this.name = "BooksFetchError";
		this.context = { bibleId, statusCode, statusText };
	}
}

// – – – – – – – – – –
export class PassageFetchError extends BaseEphremError {
	public context: {
		bibleId: string;
		passageId: string;
		passageOptions: PassageOptions;
		statusCode: number | undefined;
		statusText: string | undefined;
	};

	constructor(
		message: string,
		passageId: string,
		bibleId: string,
		passageOptions: PassageOptions,
		public statusCode: number | undefined,
		public statusText: string | undefined,
	) {
		super(message);
		this.name = "PassageFetchError";
		this.context = {
			bibleId,
			passageId,
			passageOptions,
			statusCode,
			statusText,
		};
	}
}

// – – – – – – – – – –
export type ScriptDirection = "LTR" | "RTL";

// – – – – – – – – – –
export interface Language {
	readonly id: string;
	readonly name: string;
	readonly nameLocal: string;
	readonly script: string;
	readonly scriptDirection: ScriptDirection;
}

// – – – – – – – – – –
export interface BibleResponse {
	readonly abbreviation: string;
	readonly abbreviationLocal: string;
	readonly dblId: string;
	readonly description: string;
	readonly descriptionLocal: string;
	readonly id: string;
	readonly language: Language;
	readonly name: string;
	readonly nameLocal: string;

	readonly [key: string]: unknown;
}

// – – – – – – – – – –
export interface Book {
	readonly abbreviation: string;
	readonly bibleId: string;
	readonly id: string;
	readonly name: string;
	readonly nameLong: string;
}

// – – – – – – – – – –
export interface PassageOptions {
	readonly contentType?: "html" | "json" | "text";
	readonly includeChapterNumbers?: boolean;
	readonly includeNotes?: boolean;
	readonly includeTitles?: boolean;
	readonly includeVerseNumbers?: boolean;
	readonly includeVerseSpans?: boolean;
}

// – – – – – – – – – –
export interface PassageResponse {
	readonly content: string;
	readonly copyright: string;
	readonly id: string;

	readonly [key: string]: unknown;

	readonly reference: string;
}

// – – – – – – – – – –
export interface FumsResponse {
	readonly fums: string;

	readonly [key: string]: unknown;
}

// – – – – – – – – – –
export interface PassageAndFumsResponse {
	readonly data: PassageResponse;
	readonly meta: FumsResponse;

	readonly [key: string]: unknown;
}

// – – – – – – – – – –
export interface PassageWithDetails {
	readonly bible: BibleResponse;
	readonly book: Book;
	readonly fums: FumsResponse;
	readonly passage: PassageResponse;
}

type BookName = string;
export type BibleId = string;
export type BookId = string;
type BibleAbbreviation = string;
export type BooksAndBibles = Record<BookName, Record<BibleId, BookId>>;
export type BiblesMap = Record<BibleAbbreviation, BibleId>;

// – – – – – – – – – –
/**
 * Converts the given passage options into a format suitable for the API request.
 * @param options The options for fetching the passage.
 * @returns A record containing the passage options formatted for the API request.
 */
const convertPassageOptionsForApi = (
	options: PassageOptions,
): Record<string, unknown> => {
	const {
		contentType,
		includeChapterNumbers,
		includeNotes,
		includeTitles,
		includeVerseNumbers,
		includeVerseSpans,
	} = options;

	const precursor = {
		"content-type": contentType,
		"include-chapter-numbers": includeChapterNumbers,
		"include-notes": includeNotes,
		"include-titles": includeTitles,
		"include-verse-numbers": includeVerseNumbers,
		"include-verse-spans": includeVerseSpans,
	};

	// filter out undefined values
	return Object.fromEntries(
		Object.entries(precursor).filter(([, value]) => value !== undefined),
	);
};

// – – – – – – – – – –
// Exponential back-off retry delay between requests
axiosRetry(axios, {
	retries: 5,
	retryDelay: (retryCount, error) =>
		axiosRetry.exponentialDelay(retryCount, error, 1000),
	shouldResetTimeout: true,
});

// – – – – – – – – – –
const getDefaultApiHeader = (): RawAxiosRequestHeaders => {
	if (!hasApiBibleKey()) {
		throw new ApiBibleKeyNotFoundError();
	}
	return {
		Accept: "application/json",
		"api-key": process.env.API_BIBLE_API_KEY,
	};
};

// – – – – – – – – – –
const getBiblesFromApiConfig = (
	normalizedLanguageId: string,
): AxiosRequestConfig => {
	if (!ISO_693_3_REGEX.test(normalizedLanguageId)) {
		throw new InvalidLanguageIDError(normalizedLanguageId);
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(),
		params: {
			"include-full-details": false,
			language: normalizedLanguageId,
		},
		timeout: API_BIBLE_TIMEOUT,
	};
};

// – – – – – – – – – –
const handleGetBiblesFromApiError = (
	error: unknown,
	languageId: string,
): BiblesFetchError => {
	let errorMessage =
		"An unexpected error occurred while fetching Bibles from API.Bible.";
	let statusCode: number | undefined = undefined;
	let statusText: string | undefined = undefined;

	if (axios.isAxiosError(error)) {
		const response = error.response;

		if (response?.status) {
			statusCode = response.status;
		}

		if (response?.statusText) {
			statusText = response.statusText;
		}

		if (statusCode === 400) {
			errorMessage =
				"Not authorized to retrieve any Bibles or invalid `language` provided.";
		} else if (statusCode === 401) {
			errorMessage =
				"Unauthorized for API access. Missing or Invalid API Key provided.";
		}
	}

	return new BiblesFetchError(errorMessage, languageId, statusCode, statusText);
};

// – – – – – – – – – –
// fetchBibles
const getBiblesFromApi = async (
	normalizedLanguageId: string,
): Promise<BibleResponse[]> => {
	const config = getBiblesFromApiConfig(normalizedLanguageId);

	let bibles: BibleResponse[] = [];
	try {
		const response = await axios.get<{ data: BibleResponse[] }>(
			"/v1/bibles",
			config,
		);

		bibles = response.data.data;
	} catch (error) {
		throw handleGetBiblesFromApiError(error, normalizedLanguageId);
	}

	if (bibles.length === 0) {
		throw new BiblesNotAvailableError(normalizedLanguageId);
	}

	return bibles;
};

// – – – – – – – – – –
const getBiblesInLanguages = async (
	languageIds: string[],
): Promise<BibleResponse[]> => {
	const normalizedLanguageIds = languageIds.map((languageId) =>
		removePunctuation(languageId).trim().toLowerCase(),
	);

	const uniqueLanguageIds = [...new Set(normalizedLanguageIds)];

	const bibles = await Promise.all(
		uniqueLanguageIds.map((normalizedLanguageId) =>
			getBiblesFromApi(normalizedLanguageId),
		),
	);

	return bibles.flat();
};

// – – – – – – – – – –
const writeBiblesMap = async (bibles: BibleResponse[]) => {
	const biblesMap = bibles.reduce<BiblesMap>((acc, bible) => {
		acc[bible.abbreviation] = bible.id;
		acc[bible.abbreviationLocal] = bible.id;
		return acc;
	}, {});

	await fs.promises.writeFile(
		ABB_TO_ID_MAPPING_PATH,
		JSON.stringify(biblesMap, null, 2),
	);
};

// – – – – – – – – – –
const writeBiblesData = async (bibles: BibleResponse[]) => {
	const biblesData = bibles.reduce<Record<BibleId, BibleResponse>>(
		(acc, bible) => {
			acc[bible.id] = bible;
			return acc;
		},
		{},
	);

	await fs.promises.writeFile(
		BIBLES_DATA_PATH,
		JSON.stringify(biblesData, null, 2),
	);
};

// – – – – – – – – – –
const setupBibles = async (languageIds: string[]): Promise<string> => {
	const bibles = await getBiblesInLanguages(languageIds);

	// write bible abbreviation to bible ID mapping
	await writeBiblesMap(bibles);

	// write bible ID to bible mapping
	await writeBiblesData(bibles);

	return ephremPaths.data;
};

// – – – – – – – – – –
const handleGetBooksFromApiError = (
	error: unknown,
	bibleId: string,
): BooksFetchError => {
	let errorMessage =
		"An unexpected error occurred while fetching Books from API.Bible.";
	let statusCode: number | undefined = undefined;
	let statusText: string | undefined = undefined;

	if (axios.isAxiosError(error)) {
		const response = error.response;

		if (response?.status) {
			statusCode = response.status;
		}

		if (response?.statusText) {
			statusText = response.statusText;
		}

		if (statusCode === 400) {
			errorMessage =
				"Not authorized to retrieve any Bibles or invalid `language` provided.";
		} else if (statusCode === 401) {
			errorMessage =
				"Unauthorized for API access. Missing or Invalid API Key provided.";
		}
	}

	return new BooksFetchError(errorMessage, bibleId, statusCode, statusText);
};

// – – – – – – – – – –
const getBooksFromApiConfig = (): AxiosRequestConfig => {
	if (!hasApiBibleKey()) {
		throw new ApiBibleKeyNotFoundError();
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(),
		params: {
			"include-chapters": false,
		},
		timeout: API_BIBLE_TIMEOUT,
	};
};

// – – – – – – – – – –
const getBooksFromApi = async (bibleId: string): Promise<Book[]> => {
	const config = getBooksFromApiConfig();

	try {
		const response = await axios.get<{ data: Book[] }>(
			`/v1/bibles/${bibleId}/books`,
			config,
		);

		return response.data.data;
	} catch (error) {
		throw handleGetBooksFromApiError(error, bibleId);
	}
};

// – – – – – – – – – –
const getBooksFromBibles = async (bibleIds: string[]): Promise<Book[]> => {
	const books = await Promise.all(
		bibleIds.map((bibleId) => getBooksFromApi(bibleId)),
	);

	return books.flat();
};

// – – – – – – – – – –
const getBookNamesToBibles = (books: Book[]): BooksAndBibles => {
	const bookNamesToBibles: BooksAndBibles = {};

	for (const book of books) {
		const bookName = normalizeBookName(book.name);

		if (!(bookName in bookNamesToBibles)) {
			bookNamesToBibles[bookName] = {};
		}

		if (!(book.bibleId in bookNamesToBibles[bookName])) {
			bookNamesToBibles[bookName][book.bibleId] = book.id;
		}
	}

	return bookNamesToBibles;
};

// – – – – – – – – – –
const writeBookNamesToBibles = async (books: Book[]): Promise<void> => {
	const bookNamesToBibles = getBookNamesToBibles(books);

	await fs.promises.writeFile(
		NAMES_TO_BIBLES_PATH,
		JSON.stringify(bookNamesToBibles, null, 2),
	);
};

// – – – – – – – – – –
const setupBooks = async (): Promise<string> => {
	// parse BIBLES_DATA_PATH to get bible IDs
	const biblesData = JSON.parse(
		await fs.promises.readFile(BIBLES_DATA_PATH, "utf-8"),
	) as Record<BibleId, BibleResponse>;

	const bibleIds = Object.keys(biblesData);

	// iterate over each bible and get books
	const books = await getBooksFromBibles(bibleIds);

	// write books data
	await fs.promises.writeFile(BOOKS_DATA_PATH, JSON.stringify(books, null, 2));

	// write book names to bibles mapping
	await writeBookNamesToBibles(books);

	return ephremPaths.data;
};

// – – – – – – – – – –
/**
 * Sets up the Ephrem environment by fetching and writing Bible and book data from API.Bible.
 * @param languageIds An array of language IDs (ISO-639-3; lower case) to fetch Bibles for.
 * @returns A promise that resolves to the path where the data is stored.
 */
export const setupEphrem = async (languageIds: string[]): Promise<string> => {
	await setupBibles(languageIds);
	await setupBooks();

	return ephremPaths.data;
};

// – – – – – – – – – –
const getPassageFromApiConfig = (
	passageOptions: PassageOptions,
): AxiosRequestConfig => {
	if (!hasApiBibleKey()) {
		throw new ApiBibleKeyNotFoundError();
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(),
		params: convertPassageOptionsForApi(passageOptions),
		timeout: API_BIBLE_TIMEOUT,
	};
};

// – – – – – – – – – –
const handleGetPassageFromApiError = (
	error: unknown,
	passageId: string,
	bibleId: string,
	passageOptions: PassageOptions,
): BooksFetchError => {
	let errorMessage =
		"An unexpected error occurred while fetching Passage from API.Bible.";
	let statusCode: number | undefined = undefined;
	let statusText: string | undefined = undefined;

	if (axios.isAxiosError(error)) {
		const response = error.response;

		if (response?.status) {
			statusCode = response.status;
		}

		if (response?.statusText) {
			statusText = response.statusText;
		}

		if (statusCode === 400) {
			errorMessage =
				"Not authorized to retrieve any Bibles or invalid `language` provided.";
		} else if (statusCode === 401) {
			errorMessage =
				"Unauthorized for API access. Missing or Invalid API Key provided.";
		}
	}

	return new PassageFetchError(
		errorMessage,
		passageId,
		bibleId,
		passageOptions,
		statusCode,
		statusText,
	);
};

// – – – – – – – – – –
export const getPassageFromApi = async (
	passageId: string,
	bibleId: string,
	passageOptions: PassageOptions,
): Promise<PassageAndFumsResponse> => {
	const config = getPassageFromApiConfig(passageOptions);

	try {
		const response = await axios.get<PassageAndFumsResponse>(
			`/v1/bibles/${bibleId}/passages/${passageId}`,
			config,
		);

		return response.data;
	} catch (error) {
		throw handleGetPassageFromApiError(
			error,
			passageId,
			bibleId,
			passageOptions,
		);
	}
};

// – – – – – – – – – –
/**
 * Bible abbreviations mapping file can be used to customize the abbreviations/labels that can be used to refer to a Bible.
 * This function returns the path to the Bible abbreviations mapping file.
 * @returns The file path to the Bible abbreviations mapping file.
 */
export const getBibleAbbreviationsFilepath = (): string =>
	ABB_TO_ID_MAPPING_PATH;
