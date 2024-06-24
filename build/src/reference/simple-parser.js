import { loadBiblesCache } from '../cache/cache-use-bibles.js';
import { getBookID } from './identify-book.js';
import { getDefaultApiConfig, getDefaultDelayBetweenCallsMs, getDefaultInitialBackoffMs, getDefaultLanguages, getDefaultMaxRetries, } from '../api-bible/api-utils.js';
import { getDefaultBibles, getDefaultBiblesToExclude, } from '../cache/cache-utils.js';
import { getDefaultUseMajorityFallback } from './reference-utils.js';
const extractTranslationsAndBookChapterVerse = (input) => {
    const translations = input.match(/\(([^)]+)\)/)?.[1];
    const bookChapterVerse = translations
        ? input.replace(`(${translations})`, '')
        : input;
    // Validate the input format
    if (bookChapterVerse.includes('-') && bookChapterVerse.includes(':')) {
        const hyphenIndex = bookChapterVerse.indexOf('-');
        const colonIndex = bookChapterVerse.indexOf(':');
        if (hyphenIndex < colonIndex) {
            throw new Error(`Invalid format for Reference: ${input}`);
        }
    }
    return { translations, bookChapterVerse };
};
const splitChapterAndVerse = (chapterVerse) => {
    const chapterVerseParts = chapterVerse
        .split('-')
        .map(trimPart => trimPart.trim());
    let chapterStart, chapterEnd, verseStart, verseEnd;
    if (chapterVerseParts[0]?.includes(':')) {
        [chapterStart, verseStart] = chapterVerseParts[0].split(':');
        if (chapterVerseParts[1]) {
            chapterEnd = chapterVerseParts[1].includes(':')
                ? chapterVerseParts[1].split(':')[0]
                : undefined;
            verseEnd = chapterVerseParts[1].includes(':')
                ? chapterVerseParts[1].split(':')[1]
                : chapterVerseParts[1];
        }
    }
    else {
        [chapterStart, chapterEnd] = chapterVerseParts;
    }
    return { chapterStart, chapterEnd, verseStart, verseEnd };
};
// - - - - - - - - -
export const parseReferenceGroup = (input, defaultBibles = getDefaultBibles()) => {
    const { translations, bookChapterVerse } = extractTranslationsAndBookChapterVerse(input);
    // eslint-disable-next-line prefer-const
    let [bookName, chapterVerse] = bookChapterVerse.split(/\s+(?=\d)/);
    if (!bookName || !chapterVerse) {
        throw new Error(`Invalid format for Reference: ${input}`);
    }
    bookName = bookName.trim();
    const { chapterStart, chapterEnd, verseStart, verseEnd } = splitChapterAndVerse(chapterVerse);
    const bibles = translations?.split(',').map(bible => bible.trim());
    return {
        bookName,
        chapterStart,
        chapterEnd,
        verseStart,
        verseEnd,
        bibles: bibles || defaultBibles,
    };
};
export const splitReferenceGroup = async (options) => {
    const { referenceGroup, useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    const references = [];
    for (const bibleAbbreviation of referenceGroup.bibles) {
        const bookName = referenceGroup.bookName;
        const bookId = await getBookID({
            bookName,
            biblesCache,
            bibleAbbreviation,
            languages,
            useMajorityFallback,
            forceUpdateBiblesCache,
            biblesToExclude,
            config,
            timestamp,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
        if (!bookId) {
            continue;
        }
        const reference = {
            book: bookId,
            chapterStart: referenceGroup.chapterStart,
            chapterEnd: referenceGroup.chapterEnd,
            verseStart: referenceGroup.verseStart,
            verseEnd: referenceGroup.verseEnd,
            bible: bibleAbbreviation,
        };
        references.push(reference);
    }
    return references;
};
export const parseReferences = async (options) => {
    const { input, delimiter = ';', defaultBibles = getDefaultBibles(), useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache(), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), timestamp = new Date(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
    if ([',', '.', ' '].includes(delimiter)) {
        throw Error;
    }
    const referenceGrpsStrings = input
        .split(delimiter)
        .map(group => group.trim())
        .filter(group => group !== '');
    const references = {};
    for (const referenceGroupString of referenceGrpsStrings) {
        const referenceGroup = parseReferenceGroup(referenceGroupString, defaultBibles);
        references[referenceGroupString] = await splitReferenceGroup({
            referenceGroup,
            biblesCache,
            languages,
            useMajorityFallback,
            forceUpdateBiblesCache,
            biblesToExclude,
            config,
            timestamp,
            retries,
            initialBackoff,
            delayBetweenCalls,
        });
    }
    return references;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWZlcmVuY2Uvc2ltcGxlLXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzdDLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsNkJBQTZCLEVBQzdCLDBCQUEwQixFQUMxQixtQkFBbUIsRUFDbkIsb0JBQW9CLEdBQ3JCLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUNMLGdCQUFnQixFQUNoQix5QkFBeUIsR0FDMUIsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVuRSxNQUFNLHNDQUFzQyxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDL0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sZ0JBQWdCLEdBQUcsWUFBWTtRQUNuQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFlBQVksR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRVYsNEJBQTRCO0lBQzVCLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3JFLE1BQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakQsSUFBSSxXQUFXLEdBQUcsVUFB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