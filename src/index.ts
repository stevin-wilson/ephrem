export {
	ApiBibleKeyNotFoundError,
	BiblesFetchError,
	BiblesNotAvailableError,
	BooksFetchError,
	getBibleAbbreviationsFilepath,
	InvalidLanguageIDError,
	PassageFetchError,
	setupEphrem,
} from "./api-bible.js";
import type {
	Bible,
	Book,
	Fums,
	Language,
	Passage,
	PassageAndFums,
	PassageOptions,
	PassageWithDetails,
	ScriptDirection,
} from "./api-bible.js";
import type { Reference, ReferenceWithoutBible } from "./reference.js";

export type {
	Bible,
	Book,
	Fums,
	Language,
	Passage,
	PassageAndFums,
	PassageOptions,
	PassageWithDetails,
	ScriptDirection,
};

export { BOOK_IDs } from "./book-ids.js";
export {
	BibleNotAvailableError,
	BookIdNotFoundError,
	BookNotInBibleError,
	FallbackBibleNotFoundError,
	getBibleDetails,
	getBibleIdFromAbbreviation,
	getBookDetails,
	getBookId,
	getPassage,
	getPassageFromReference,
	getPassageWithDetails,
	getPassageWithDetailsFromReference,
	InvalidReferenceError,
	parseReference,
	UnknownBibleAbbreviationError,
} from "./reference.js";

export type { Reference, ReferenceWithoutBible };
export { BaseEphremError } from "./utils.js";
