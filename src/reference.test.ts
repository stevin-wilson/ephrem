import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { BOOK_IDs } from "./book-ids.js";
import {
	BookNotInBibleError,
	getBookId,
	getPassageId,
	getPassageWithDetails,
	getPassageWithDetailsFromReference,
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
	it("single verse LTR", async () => {
		const result = await parseReference("John 3:16 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});

	// single verse LTR - fallback bible
	it("single verse LTR - fallback bible", async () => {
		const result = await parseReference("John 3:16", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});

	// multiple verses LTR
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

	// multiple verses LTR - fallback bible
	it("multiple verses LTR - fallback bible", async () => {
		const result = await parseReference("John 3:16-20", "KJV");

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

	// multiple chapter multiple verses LTR
	it("multiple chapter multiple verses LTR", async () => {
		const result = await parseReference("John 3:16-4:20 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapter multiple verses LTR - fallback bible
	it("multiple chapter multiple verses LTR - fallback bible", async () => {
		const result = await parseReference("John 3:16-4:20", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
	// whole chapter LTR
	it("whole chapter LTR", async () => {
		const result = await parseReference("John 3 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// whole chapter LTR - fallback bible
	it("whole chapter LTR - fallback bible", async () => {
		const result = await parseReference("John 3", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapters LTR
	it("multiple chapters LTR", async () => {
		const result = await parseReference("John 3-4 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapters LTR - fallback bible
	it("multiple chapters LTR - fallback bible", async () => {
		const result = await parseReference("John 3-4", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});

	// single verse RTL
	it("single verse RTL", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});

	// single verse RTL - fallback bible
	it("single verse RTL - fallback bible", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple verses RTL
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
	// multiple verses RTL - fallback bible
	it("multiple verses RTL - fallback bible", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16-20", "KJV");

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
	// multiple chapter multiple verses RTL
	it("multiple chapter multiple verses RTL", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16-4:20 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapter multiple verses RTL - fallback bible
	it("multiple chapter multiple verses RTL - fallback bible", async () => {
		const result = await parseReference("إنجيل يوحنا 3:16-4:20", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		expect(result).toStrictEqual(expected);
	});
	// whole chapter RTL
	it("whole chapter RTL", async () => {
		const result = await parseReference("إنجيل يوحنا 3 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// whole chapter RTL - fallback bible
	it("whole chapter RTL - fallback bible", async () => {
		const result = await parseReference("إنجيل يوحنا 3", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapters RTL
	it("multiple chapters RTL", async () => {
		const result = await parseReference("إنجيل يوحنا 3-4 (KJV)");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
	// multiple chapters RTL - fallback bible
	it("multiple chapters RTL - fallback bible", async () => {
		const result = await parseReference("إنجيل يوحنا 3-4", "KJV");

		const expected: Reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN",
			chapterEnd: "4",
			chapterStart: "3",
			verseEnd: undefined,
			verseStart: undefined,
		};

		expect(result).toStrictEqual(expected);
	});
});

// – – – – – – – – – –
describe("get passage", () => {
	it("get passage with details", async () => {
		const passageOptions = {
			contentType: "text" as "html" | "json" | "text",
			includeChapterNumbers: false,
			includeNotes: false,
			includeTitles: false,
			includeVerseNumbers: false,
			includeVerseSpans: false,
		};

		const result = await getPassageWithDetails(
			"John 3:16-20 (KJV)",
			passageOptions,
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

		const reference = {
			bibleId: "de4e12af7f28f599-02",
			bookId: "JHN" as keyof typeof BOOK_IDs,
			chapterEnd: undefined,
			chapterStart: "3",
			verseEnd: "20",
			verseStart: "16",
		};

		const resultFromReference = await getPassageWithDetailsFromReference(
			reference,
			passageOptions,
		);

		expect(resultFromReference.bible).toStrictEqual(expectedBible);
		expect(resultFromReference.book).toStrictEqual(expectedBook);
		expect(resultFromReference.passage.content).toStrictEqual(expectedPassage);
		expect(resultFromReference.passage.reference).toStrictEqual("John 3:16-20");
	});
});

// – – – – – – – – – –
describe("check if book is in bible", () => {
	it("should throw an error when the book is not in the bible", async () => {
		await expect(
			getPassageWithDetails("Judith 1:1 (BSB)", {}),
		).rejects.toThrowError(BookNotInBibleError);
	});
});
