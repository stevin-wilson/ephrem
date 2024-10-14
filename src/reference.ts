import fs from "node:fs";

import {
	ABB_TO_ID_MAPPING_PATH,
	BibleId,
	BibleResponse,
	BIBLES_DATA_PATH,
	BiblesMap,
	Book,
	BOOKS_DATA_PATH,
	BooksAndBibles,
	getPassageFromApi,
	NAMES_TO_BIBLES_PATH,
	PassageAndFumsResponse,
	PassageOptions,
	PassageWithDetails,
} from "./api-bible.js";
import { BOOK_IDs } from "./book-ids.js";
import { BaseEphremError, normalizeBookName } from "./utils.js";

// – – – – – – – – – –
export class BookIdNotFoundError extends BaseEphremError {
	public context: {
		bibleId: string;
		bookId: string;
	};

	constructor(bookId: string, bibleId: string) {
		super("Book ID could not be found in the Bible");
		this.name = "BookIdNotFoundError";
		this.context = { bibleId, bookId };
	}
}

// – – – – – – – – – –
export class FallbackBibleNotFoundError extends BaseEphremError {
	public context: {
		fallbackBibleAbbreviation: string | undefined;
		input: string;
	};

	constructor(input: string, fallbackBibleAbbreviation: string | undefined) {
		super(
			"Input does not indicate a bible abbreviation, and no fallback Bible Abbreviation was provided",
		);
		this.name = "FallbackBibleNotFoundError";
		this.context = { fallbackBibleAbbreviation, input };
	}
}

// – – – – – – – – – –
export class UnknownBibleAbbreviationError extends BaseEphremError {
	public context: {
		bibleAbbreviation: string;
		mappingFile: string;
	};

	constructor(bibleAbbreviation: string, mappingFile: string) {
		super("Bible Abbreviation could not be found in the mapping file");
		this.name = "UnknownBibleAbbreviationError";
		this.context = { bibleAbbreviation, mappingFile };
	}
}

// – – – – – – – – – –
export class InvalidReferenceError extends BaseEphremError {
	public context: {
		input: string;
	};

	constructor(input: string) {
		super(
			"Input reference is invalid. Please check the reference and try again.",
		);
		this.name = "InvalidReferenceError";
		this.context = { input };
	}
}

// – – – – – – – – – –
export class BookNotInBibleError extends BaseEphremError {
	public context: {
		availableBookIds: string[];
		bibleName: string;
		bibleNameLocal: string;
		bookId: string;
		input: string;
	};

	constructor(
		input: string,
		bookId: string,
		availableBookIds: string[],
		bibleName: string,
		bibleNameLocal: string,
	) {
		super(
			"Requested Book is not available in this Bible. Please check the reference and try again.",
		);
		this.name = "BookNotInBibleError";
		this.context = {
			availableBookIds,
			bibleName,
			bibleNameLocal,
			bookId,
			input,
		};
	}
}

// – – – – – – – – – –
export type VoteTally = Record<string, number>;

// – – – – – – – – – –
export interface ChaptersAndVerses {
	readonly chapterEnd?: string;
	readonly chapterStart: string;
	readonly verseEnd?: string;
	readonly verseStart?: string;
}

// – – – – – – – – – –
export interface ReferenceWithoutBible extends ChaptersAndVerses {
	bookId: keyof typeof BOOK_IDs; // Must be a USFM Book Identifier. Consider deuterocanonical books when applicable
}

// – – – – – – – – – –
export interface Reference extends ReferenceWithoutBible {
	readonly bibleId: string;
}

// – – – – – – – – – –
const bookIsInBible = (
	bookId: string,
	bibleId: string,
	books: Book[],
): boolean => {
	return books.some((book) => book.id === bookId && book.bibleId === bibleId);
};

// – – – – – – – – – –
const getBookIdInBible = (
	normalizedBookName: string,
	bibleId: string,
	bookNamesToBibles: BooksAndBibles,
): string | undefined => {
	if (!(normalizedBookName in bookNamesToBibles)) {
		return undefined;
	}

	return bookNamesToBibles[normalizedBookName][bibleId];
};

// – – – – – – – – – –
const getKeyOfMaxValue = (obj: VoteTally): string | undefined => {
	return Object.keys(obj).reduce(
		(a, b) => (obj[a] > obj[b] ? a : b),
		Object.keys(obj)[0],
	);
};

// – – – – – – – – – –
const getBookIdByMajority = (
	normalizedBookName: string,
	bibleMap: BiblesMap,
	bookNamesToBibles: BooksAndBibles,
): string | undefined => {
	if (!(normalizedBookName in bookNamesToBibles)) {
		return undefined;
	}

	const biblesWithBook = bookNamesToBibles[normalizedBookName];
	const biblesToConsider = Object.values(bibleMap);

	const voteTally: VoteTally = {};
	const alreadyConsideredBibleIds: string[] = [];
	for (const [bibleId, bookId] of Object.entries(biblesWithBook)) {
		if (
			alreadyConsideredBibleIds.includes(bibleId) ||
			!biblesToConsider.includes(bibleId)
		) {
			continue;
		}

		voteTally[bookId] ||= 0;

		voteTally[bookId] += 1;
		alreadyConsideredBibleIds.push(bibleId);
	}

	return getKeyOfMaxValue(voteTally);
};

// – – – – – – – – – –
export const getBookId = async (
	bookName: string,
	bibleId?: string,
): Promise<keyof typeof BOOK_IDs | undefined> => {
	const bookNamesToBibles = JSON.parse(
		await fs.promises.readFile(NAMES_TO_BIBLES_PATH, "utf-8"),
	) as BooksAndBibles;

	const normalizedBookName = normalizeBookName(bookName);

	let bookId: string | undefined = undefined;

	if (bibleId !== undefined) {
		bookId = getBookIdInBible(normalizedBookName, bibleId, bookNamesToBibles);
	}

	if (bookId === undefined) {
		const bibleMap = JSON.parse(
			await fs.promises.readFile(ABB_TO_ID_MAPPING_PATH, "utf-8"),
		) as BiblesMap;

		bookId = getBookIdByMajority(
			normalizedBookName,
			bibleMap,
			bookNamesToBibles,
		);
	}

	if (bookId && bookId in BOOK_IDs) {
		return bookId as keyof typeof BOOK_IDs;
	}

	return undefined;
};

// – – – – – – – – – –
const extractTranslationAndBookChapterVerse = (input: string) => {
	const bibleAbbreviation = /\(([^)]+)\)/.exec(input)?.[1];
	const bookChapterVerse = bibleAbbreviation
		? input.replace(`(${bibleAbbreviation})`, "")
		: input;

	// Validate the input format
	if (bookChapterVerse.includes("-") && bookChapterVerse.includes(":")) {
		const hyphenIndex = bookChapterVerse.indexOf("-");
		const colonIndex = bookChapterVerse.indexOf(":");

		if (hyphenIndex < colonIndex) {
			throw new InvalidReferenceError(input);
		}
	}

	return { bibleAbbreviation, bookChapterVerse };
};

// – – – – – – – – – –
const splitChapterAndVerse = (chapterVerse: string) => {
	const chapterVerseParts = chapterVerse
		.split("-")
		.map((trimPart) => trimPart.trim());

	let chapterEnd, chapterStart, verseEnd, verseStart;

	if (chapterVerseParts[0]?.includes(":")) {
		[chapterStart, verseStart] = chapterVerseParts[0].split(":");
		if (chapterVerseParts[1]) {
			chapterEnd = chapterVerseParts[1].includes(":")
				? chapterVerseParts[1].split(":")[0]
				: undefined;
			verseEnd = chapterVerseParts[1].includes(":")
				? chapterVerseParts[1].split(":")[1]
				: chapterVerseParts[1];
		}
	} else {
		[chapterStart, chapterEnd] = chapterVerseParts;
	}
	return { chapterEnd, chapterStart, verseEnd, verseStart };
};

// – – – – – – – – – –
export const parseReference = async (
	input: string,
	fallbackBibleAbbreviation?: string,
): Promise<Reference | undefined> => {
	const { bibleAbbreviation, bookChapterVerse } =
		extractTranslationAndBookChapterVerse(input);

	// eslint-disable-next-line prefer-const
	let [bookName, chapterVerse] = bookChapterVerse.split(/\s+(?=\d)/);

	if (!bookName || !chapterVerse) {
		throw new InvalidReferenceError(input);
	}

	let targetBibleAbbreviation: string;
	if (bibleAbbreviation !== undefined) {
		targetBibleAbbreviation = bibleAbbreviation;
	} else {
		if (!fallbackBibleAbbreviation) {
			throw new FallbackBibleNotFoundError(input, fallbackBibleAbbreviation);
		}

		targetBibleAbbreviation = fallbackBibleAbbreviation;
	}

	const bibleMap = JSON.parse(
		await fs.promises.readFile(ABB_TO_ID_MAPPING_PATH, "utf-8"),
	) as BiblesMap;

	if (!(targetBibleAbbreviation in bibleMap)) {
		throw new UnknownBibleAbbreviationError(
			targetBibleAbbreviation,
			ABB_TO_ID_MAPPING_PATH,
		);
	}

	const bibleId = bibleMap[targetBibleAbbreviation];

	const bookId = await getBookId(bookName.trim(), bibleId);
	if (!bookId) {
		return undefined;
	}

	const booksData = JSON.parse(
		await fs.promises.readFile(BOOKS_DATA_PATH, "utf-8"),
	) as Book[];

	const biblesData = JSON.parse(
		await fs.promises.readFile(BIBLES_DATA_PATH, "utf-8"),
	) as Record<BibleId, BibleResponse>;

	if (!bookIsInBible(bookId, bibleId, booksData)) {
		throw new BookNotInBibleError(
			input,
			bookId,
			booksData
				.filter((book) => book.bibleId === bibleId)
				.map((book) => book.id),
			biblesData[bibleId].name,
			biblesData[bibleId].nameLocal,
		);
	}

	const { chapterEnd, chapterStart, verseEnd, verseStart } =
		splitChapterAndVerse(chapterVerse);

	return {
		bibleId,
		bookId,
		chapterEnd,
		chapterStart,
		verseEnd,
		verseStart,
	};
};

// – – – – – – – – – –
const createPassageBoundary = (
	bookId: string,
	chapter: string,
	verse?: string,
): string => {
	return verse ? `${bookId}.${chapter}.${verse}` : `${bookId}.${chapter}`;
};

// – – – – – – – – – –
export const getPassageId = (reference: ReferenceWithoutBible): string => {
	const sections: string[] = [];

	const requiredSection = createPassageBoundary(
		reference.bookId,
		reference.chapterStart,
		reference.verseStart,
	);
	let optionalSection: string | undefined = undefined;

	if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
		optionalSection = createPassageBoundary(
			reference.bookId,
			reference.chapterEnd,
			reference.verseEnd,
		);
	} else if (
		reference.chapterEnd !== undefined &&
		reference.chapterEnd !== reference.chapterStart
	) {
		optionalSection = createPassageBoundary(
			reference.bookId,
			reference.chapterEnd,
		);
	} else if (
		reference.verseEnd !== undefined &&
		reference.verseStart !== reference.verseEnd
	) {
		optionalSection = createPassageBoundary(
			reference.bookId,
			reference.chapterStart,
			reference.verseEnd,
		);
	}

	sections.push(requiredSection);
	if (optionalSection) {
		sections.push(optionalSection);
	}

	return sections.join("-").replace(/\s+/g, "");
};

// – – – – – – – – – –
export const getPassage = async (
	input: string,
	passageOptions: PassageOptions,
	apiBibleKey: string,
	fallbackBibleAbbreviation?: string,
): Promise<PassageAndFumsResponse> => {
	const reference = await parseReference(input, fallbackBibleAbbreviation);

	if (!reference) {
		throw new InvalidReferenceError(input);
	}

	const passageId = getPassageId(reference);

	return await getPassageFromApi(
		passageId,
		reference.bibleId,
		passageOptions,
		apiBibleKey,
	);
};

// – – – – – – – – – –
export const getPassageWithDetails = async (
	input: string,
	passageOptions: PassageOptions,
	apiBibleKey: string,
	fallbackBibleAbbreviation?: string,
): Promise<PassageWithDetails> => {
	const passageAndFums = await getPassage(
		input,
		passageOptions,
		apiBibleKey,
		fallbackBibleAbbreviation,
	);

	const reference = await parseReference(input, fallbackBibleAbbreviation);

	if (!reference) {
		throw new InvalidReferenceError(input);
	}

	const biblesData = JSON.parse(
		await fs.promises.readFile(BIBLES_DATA_PATH, "utf-8"),
	) as Record<BibleId, BibleResponse>;

	const bible = biblesData[reference.bibleId];

	const books = JSON.parse(
		await fs.promises.readFile(BOOKS_DATA_PATH, "utf-8"),
	) as Book[];

	const book =
		books.find(
			(book) =>
				book.id === reference.bookId && book.bibleId === reference.bibleId,
		) ??
		(() => {
			throw new BookIdNotFoundError(reference.bookId, reference.bibleId);
		})();

	return {
		bible,
		book,
		fums: passageAndFums.meta,
		passage: passageAndFums.data,
	};
};
