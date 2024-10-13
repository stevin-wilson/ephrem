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
export class InvalidAPIBibleKeyError extends BaseEphremError {
	public context: {
		apiBibleKey: string | undefined;
	};

	constructor(apiBibleKey: string | undefined) {
		super("API.Bible Key was not found or is invalid");
		this.name = "InvalidAPIBibleKeyError";
		this.context = { apiBibleKey };
	}
}

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

function filterUndefinedFromPassageOptions(
	options: PassageOptions,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(options).filter(([, value]) => value !== undefined),
	);
}

// – – – – – – – – – –
// Exponential back-off retry delay between requests
axiosRetry(axios, {
	retries: 5,
	retryDelay: (retryCount, error) =>
		axiosRetry.exponentialDelay(retryCount, error, 1000),
	shouldResetTimeout: true,
});

// – – – – – – – – – –
const getDefaultApiHeader = (apiBibleKey: string): RawAxiosRequestHeaders => {
	if (!apiBibleKey) {
		throw new InvalidAPIBibleKeyError(apiBibleKey);
	}
	return { Accept: "application/json", "api-key": apiBibleKey };
};

// – – – – – – – – – –
const getBiblesFromApiConfig = (
	normalizedLanguageId: string,
	apiBibleKey: string,
): AxiosRequestConfig => {
	if (!ISO_693_3_REGEX.test(normalizedLanguageId)) {
		throw new InvalidLanguageIDError(normalizedLanguageId);
	}

	if (!apiBibleKey) {
		throw new InvalidAPIBibleKeyError(apiBibleKey);
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(apiBibleKey),
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
	apiBibleKey: string,
): Promise<BibleResponse[]> => {
	const config = getBiblesFromApiConfig(normalizedLanguageId, apiBibleKey);

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
	apiBibleKey: string,
): Promise<BibleResponse[]> => {
	const normalizedLanguageIds = languageIds.map((languageId) =>
		removePunctuation(languageId).trim().toLowerCase(),
	);

	const uniqueLanguageIds = [...new Set(normalizedLanguageIds)];

	const bibles = await Promise.all(
		uniqueLanguageIds.map((normalizedLanguageId) =>
			getBiblesFromApi(normalizedLanguageId, apiBibleKey),
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
const setupBibles = async (
	languageIds: string[],
	apiBibleKey: string,
): Promise<string> => {
	const bibles = await getBiblesInLanguages(languageIds, apiBibleKey);

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
const getBooksFromApiConfig = (apiBibleKey: string): AxiosRequestConfig => {
	if (!apiBibleKey) {
		throw new InvalidAPIBibleKeyError(apiBibleKey);
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(apiBibleKey),
		params: {
			"include-chapters": false,
		},
		timeout: API_BIBLE_TIMEOUT,
	};
};

// – – – – – – – – – –
const getBooksFromApi = async (
	bibleId: string,
	apiBibleKey: string,
): Promise<Book[]> => {
	const config = getBooksFromApiConfig(apiBibleKey);

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
const getBooksFromBibles = async (
	bibleIds: string[],
	apiBibleKey: string,
): Promise<Book[]> => {
	const books = await Promise.all(
		bibleIds.map((bibleId) => getBooksFromApi(bibleId, apiBibleKey)),
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
const setupBooks = async (apiBibleKey: string): Promise<string> => {
	// parse BIBLES_DATA_PATH to get bible IDs
	const biblesData = JSON.parse(
		await fs.promises.readFile(BIBLES_DATA_PATH, "utf-8"),
	) as Record<BibleId, BibleResponse>;

	const bibleIds = Object.keys(biblesData);

	// iterate over each bible and get books
	const books = await getBooksFromBibles(bibleIds, apiBibleKey);

	// write books data
	await fs.promises.writeFile(BOOKS_DATA_PATH, JSON.stringify(books, null, 2));

	// write book names to bibles mapping
	await writeBookNamesToBibles(books);

	return ephremPaths.data;
};

// – – – – – – – – – –
export const setupEphrem = async (
	languageIds: string[],
	apiBibleKey: string,
): Promise<string> => {
	await setupBibles(languageIds, apiBibleKey);
	await setupBooks(apiBibleKey);

	return ephremPaths.data;
};

// – – – – – – – – – –
const getPassageFromApiConfig = (
	passageOptions: PassageOptions,
	apiBibleKey: string,
): AxiosRequestConfig => {
	if (!apiBibleKey) {
		throw new InvalidAPIBibleKeyError(apiBibleKey);
	}

	return {
		baseURL: API_BIBLE_BASE_URL,
		headers: getDefaultApiHeader(apiBibleKey),
		params: filterUndefinedFromPassageOptions(passageOptions),
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
	apiBibleKey: string,
): Promise<PassageAndFumsResponse> => {
	const config = getPassageFromApiConfig(passageOptions, apiBibleKey);

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
