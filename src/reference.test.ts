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

import { getBookId, getPassageId, ReferenceWithoutBible } from "./reference.js";

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
});
