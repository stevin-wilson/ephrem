import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
	getBookId,
	getPassageId,
	getPassageWithDetails,
	parseReference,
	Reference,
	ReferenceWithoutBible,
} from "./reference.js";

// Mock the api-bible.js module to replace specific exports
vi.mock("./api-bible.js", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("./api-bible.js")>()),
		// Mock the constants to point to your test resources
		ABB_TO_ID_MAPPING_PATH: path.join(
			__dirname,
			"test-resources",
			"bibles-map.json",
		),
		BIBLES_DATA_PATH: path.join(__dirname, "test-resources", "bibles.json"),
		BOOKS_DATA_PATH: path.join(__dirname, "test-resources", "books.json"),
		NAMES_TO_BIBLES_PATH: path.join(
			__dirname,
			"test-resources",
			"book-names-to-bibles.json",
		),
		// Mock other exports if needed or leave it out to use actual implementations
	};
});

// – – – – – – – – – –
describe("reference to passage ID conversion", () => {
	it("single verse reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: undefined,
			chapterStart: "1",
			verseEnd: undefined,
			verseStart: "1",
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1.1");
	});

	it("single verse alternative reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: undefined,
			chapterStart: "1",
			verseEnd: "1",
			verseStart: "1",
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1.1");
	});

	it("multiple verses reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: undefined,
			chapterStart: "1",
			verseEnd: "2",
			verseStart: "1",
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1.1-1KI.1.2");
	});

	it("single chapter reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: undefined,
			chapterStart: "1",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1");
	});

	it("single chapter alternative reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: "1",
			chapterStart: "1",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1");
	});

	it("multiple chapters reference", () => {
		const reference: ReferenceWithoutBible = {
			bookId: "1KI",
			chapterEnd: "2",
			chapterStart: "1",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(getPassageId(reference)).toStrictEqual("1KI.1-1KI.2");
	});
});

// – – – – – – – – – –
describe("get Book ID", () => {
	it("should return book code/Id", async () => {
		const result = await getBookId("Genesis");

		expect(result).toBe("GEN");
	});

	it("should be compatible with other LTR languages", async () => {
		const result = await getBookId("2 ശമുവേൽ");

		expect(result).toBe("2SA");
	});

	it("should be compatible with RTL languages", async () => {
		const result = await getBookId("العبرانيين");

		expect(result).toBe("HEB");
	});
});

// – – – – – – – – – –
describe("parse References", () => {
	// single verse LTR
	// single verse LTR - fallback bible
	// multiple verses LTR
	// multiple verses LTR - fallback bible
	// whole chapter LTR
	// whole chapter LTR - fallback bible
	// multiple chapters LTR
	// multiple chapters LTR - fallback bible
	it("multiple verses - LTR citations", async () => {
		const result = await parseReference("John 3:16-20 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});

	// single verse RTL
	// single verse RTL - fallback bible
	// multiple verses RTL
	// multiple verses RTL - fallback bible
	// whole chapter RTL
	// whole chapter RTL - fallback bible
	// multiple chapters RTL
	// multiple chapters RTL - fallback bible

	it("multiple verses - RTL citations", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16-20 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
});

// – – – – – – – – – –
describe("get passage", () => {
	it("get passage with details", async () => {
		const result = await getPassageWithDetails(
			"John 3:16-20 (KJV)",
			{
				contentType: "text",
				includeChapterNumbers: false,
				includeNotes: false,
				includeTitles: false,
				includeVerseNumbers: false,
				includeVerseSpans: false,
			},
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			process.env.API_BIBLE_API_KEY!,
		);

		const expectedPassage =
			"    ¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. For God sent not his Son into the world to condemn the world; but that the world through him might be saved.\n    ¶ He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God. And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil. For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved. \n";
		const expectedBible = {
			abbreviation: "engKJV",
			abbreviationLocal: "KJV",
			audioBibles: [],
			countries: [
				{
					id: "GB",
					name: "United Kingdom of Great Britain and Northern Ireland",
					nameLocal: "United Kingdom of Great Britain and Northern Ireland",
				},
			],
			dblId: "de4e12af7f28f599",
			description: "Protestant",
			descriptionLocal: "Protestant",
			id: "de4e12af7f28f599-02",
			language: {
				id: "eng",
				name: "English",
				nameLocal: "English",
				script: "Latin",
				scriptDirection: "LTR",
			},
			name: "King James (Authorised) Version",
			nameLocal: "King James Version",
			relatedDbl: null,
			type: "text",
			updatedAt: "2024-06-29T04:04:35.000Z",
		};

		const expectedBook = {
			abbreviation: "Jhn",
			bibleId: "de4e12af7f28f599-02",
			id: "JHN",
			name: "John",
			nameLong: "THE GOSPEL ACCORDING TO ST. JOHN",
		};

		expect(result.bible).toStrictEqual(expectedBible);
		expect(result.book).toStrictEqual(expectedBook);
		expect(result.passage.content).toStrictEqual(expectedPassage);
		expect(result.passage.reference).toStrictEqual("John 3:16-20");
	});
});
