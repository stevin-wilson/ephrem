import path from "node:path";
import { describe, expect, it, vi } from "vitest";

// Mock the api-bible.js module to replace specific exports
vi.mock("./api-bible.js", () => {
	return {
		// Mock the constants to point to your test resources
		ABB_TO_ID_MAPPING_PATH: path.join(
			__dirname,
			"test-resources",
			"bibles-map.json",
		),
		NAMES_TO_BIBLES_PATH: path.join(
			__dirname,
			"test-resources",
			"book-names-to-bibles.json",
		),
		// Mock other exports if needed or leave it out to use actual implementations
	};
});

import {
	getBookId,
	getPassageId,
	parseReference,
	Reference,
	ReferenceWithoutBible,
} from "./reference.js";

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
