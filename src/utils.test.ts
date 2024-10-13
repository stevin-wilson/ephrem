import { describe, expect, it } from "vitest";

import { normalizeBookName, removePunctuation } from "./utils.js";

// – – – – – – – – – –
describe("removePunctuation", () => {
	it("removes all punctuation from a string", () => {
		expect(removePunctuation("Hello, world!")).toBe("Hello world");
	});

	it("returns an empty string when input is only punctuation", () => {
		expect(removePunctuation("!!!")).toBe("");
	});

	it("returns the same string when there is no punctuation", () => {
		expect(removePunctuation("Hello world")).toBe("Hello world");
	});

	it("handles mixed punctuation and letters", () => {
		expect(removePunctuation("H.e,l:l;o!")).toBe("Hello");
	});

	it("handles empty string", () => {
		expect(removePunctuation("")).toBe("");
	});

	it("handles strings with numbers and punctuation", () => {
		expect(removePunctuation("123,456.789!")).toBe("123456789");
	});

	it("handles strings with special characters", () => {
		expect(removePunctuation("Hello@world#")).toBe("Helloworld");
	});
});

// – – – – – – – – – –
describe("normalizeBookName", () => {
	it("removes punctuation and converts to lowercase", () => {
		expect(normalizeBookName("John!")).toBe("john");
	});

	it("handles empty string", () => {
		expect(normalizeBookName("")).toBe("");
	});

	it("handles string with only punctuation", () => {
		expect(normalizeBookName("!!!")).toBe("");
	});

	it("handles string with mixed case and punctuation", () => {
		expect(normalizeBookName("JoHn! 3:16")).toBe("john 316");
	});

	it("handles string with no punctuation", () => {
		expect(normalizeBookName("John")).toBe("john");
	});

	it("handles languages beside english", () => {
		expect(normalizeBookName("ഉൽപ്പത്തി")).toBe("ഉൽപ്പത്തി");
	});
});
