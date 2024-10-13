import { describe, expect, it } from "vitest";

import { getPassageId, ReferenceWithoutBible } from "./reference.js";

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
