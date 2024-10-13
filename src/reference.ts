import fs from "node:fs";

import {
	ABB_TO_ID_MAPPING_PATH,
	BiblesMap,
	BooksAndBibles,
	NAMES_TO_BIBLES_PATH,
} from "./api-bible.js";
import { BOOK_IDs } from "./book-ids.js";

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
const getBookIdInBible = (
	bookName: string,
	bibleId: string,
	bookNamesToBibles: BooksAndBibles,
): string | undefined => {
	if (!(bookName in bookNamesToBibles)) {
		return undefined;
	}

	return bookNamesToBibles[bookName][bibleId];
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
	bookName: string,
	bibleMap: BiblesMap,
	bookNamesToBibles: BooksAndBibles,
): string | undefined => {
	if (!(bookName in bookNamesToBibles)) {
		return undefined;
	}

	const biblesWithBook = bookNamesToBibles[bookName];
	const biblesToConsider = Object.values(bibleMap);

	const voteTally: VoteTally = {};
	for (const [bibleId, bookId] of Object.entries(biblesWithBook)) {
		if (!biblesToConsider.includes(bibleId)) {
			continue;
		}

		voteTally[bookId] ||= 0;

		voteTally[bookId] += 1;
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

	let bookId: string | undefined = undefined;

	if (bibleId !== undefined) {
		bookId = getBookIdInBible(bookName, bibleId, bookNamesToBibles);
	}

	if (bookId === undefined) {
		const bibleMap = JSON.parse(
			await fs.promises.readFile(ABB_TO_ID_MAPPING_PATH, "utf-8"),
		) as BiblesMap;

		bookId = getBookIdByMajority(bookName, bibleMap, bookNamesToBibles);
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
			throw new Error(`Invalid format for Reference: ${input}`);
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
		throw new Error(`Invalid format for Reference: ${input}`);
	}

	let targetBibleAbbreviation: string;
	if (bibleAbbreviation !== undefined) {
		targetBibleAbbreviation = bibleAbbreviation;
	} else {
		if (!fallbackBibleAbbreviation) {
			throw new Error("No fallback Bible Abbreviation provided");
		}

		targetBibleAbbreviation = fallbackBibleAbbreviation;
	}

	const bibleMap = JSON.parse(
		await fs.promises.readFile(ABB_TO_ID_MAPPING_PATH, "utf-8"),
	) as BiblesMap;

	if (!(targetBibleAbbreviation in bibleMap)) {
		throw new Error(`Invalid Bible Abbreviation: ${targetBibleAbbreviation}`);
	}

	const bibleId = bibleMap[targetBibleAbbreviation];

	const bookId = await getBookId(bookName.trim(), bibleId);
	if (!bookId) {
		return undefined;
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
