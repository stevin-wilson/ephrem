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
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { referenceGroup, useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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
    const timestamp = options.timestamp ? options.timestamp : new Date();
    const { input, delimiter = ';', defaultBibles = getDefaultBibles(), useMajorityFallback = getDefaultUseMajorityFallback(), forceUpdateBiblesCache = false, biblesCache = await loadBiblesCache({
        cacheDir: options.cacheDir,
        maxCacheAgeDays: options.maxCacheAgeDays,
        timestamp,
    }), languages = getDefaultLanguages(), biblesToExclude = getDefaultBiblesToExclude(), config = getDefaultApiConfig(), retries = getDefaultMaxRetries(), initialBackoff = getDefaultInitialBackoffMs(), delayBetweenCalls = getDefaultDelayBetweenCallsMs(), } = options;
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