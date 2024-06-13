// - - - - - - - - -
/**
 *
 * @param input
 */
function isLTR(input) {
    const ltrPattern = /^\s*[^\d\s]+.*\d/; // Matches references with book name at the beginning
    return ltrPattern.test(input);
}
// - - - - - - - - -
/**
 *
 * @param input
 */
function parseLTRReference(input) {
    // Extract Bible versions if present
    const bibleVersionsMatch = input.match(/\((?<bibles>[^)]+)\)$/);
    let bibles;
    let reference = input;
    if (bibleVersionsMatch && bibleVersionsMatch.groups) {
        bibles = bibleVersionsMatch.groups.bibles.split(',').map(b => b.trim());
        reference = input.slice(0, bibleVersionsMatch.index).trim();
    }
    // Extract book name, chapter, and verse information
    const bookNameMatch = reference.match(/^(?<bookName>.+?)\s+(?<chapterVersePart>\d+(:\d+(-\d+)?)?(-\d+(:\d+(-\d+)?)?)?)$/);
    if (!bookNameMatch || !bookNameMatch.groups) {
        throw new Error('Invalid reference format');
    }
    const { bookName, chapterVersePart } = bookNameMatch.groups;
    let chapterStart, chapterEnd;
    let verseStart, verseEnd;
    // Handle different chapter and verse formats
    const chapterVerseMatch = chapterVersePart.match(/^(?<chapterStart>\d+)(:(?<verseStart>\d+))?(?:-(?<chapterEnd>\d+)(:(?<verseEnd>\d+))?)?(?:-(?<additionalChapterEnd>\d+)(:(?<additionalVerseEnd>\d+))?)?$/);
    if (chapterVerseMatch && chapterVerseMatch.groups) {
        chapterStart = chapterVerseMatch.groups.chapterStart;
        verseStart = chapterVerseMatch.groups.verseStart;
        if (chapterVerseMatch.groups.chapterEnd) {
            chapterEnd = chapterVerseMatch.groups.chapterEnd;
            verseEnd = chapterVerseMatch.groups.verseEnd;
        }
        else if (chapterVerseMatch.groups.additionalChapterEnd) {
            chapterEnd = chapterVerseMatch.groups.additionalChapterEnd;
            verseEnd = chapterVerseMatch.groups.additionalVerseEnd;
        }
        else if (chapterVerseMatch.groups.verseEnd) {
            verseEnd = chapterVerseMatch.groups.verseEnd;
        }
    }
    else {
        throw new Error('Invalid chapter and verse format');
    }
    // Construct and return the ReferenceGroup object
    const referenceGroup = {
        bookName,
        chapterStart,
        ...(chapterEnd && { chapterEnd }),
        ...(verseStart && { verseStart }),
        ...(verseEnd && { verseEnd }),
        ...(bibles && { bibles }),
    };
    return referenceGroup;
}
// - - - - - - - - -
/**
 *
 * @param input
 */
function parseRTLReference(input) {
    // Extract Bible versions if present
    const bibleVersionsMatch = input.match(/^\((?<bibles>[^)]+)\)/);
    let bibles;
    let reference = input;
    if (bibleVersionsMatch && bibleVersionsMatch.groups) {
        bibles = bibleVersionsMatch.groups.bibles.split(',').map(b => b.trim());
        reference = input.slice(bibleVersionsMatch[0].length).trim();
    }
    // Extract chapter and verse information and book name at the end
    const chapterVerseMatch = reference.match(/^(?<chapterVersePart>\d+(:\d+(-\d+)?)?(-\d+(:\d+(-\d+)?)?)?)\s+(?<bookName>.+?)$/);
    if (!chapterVerseMatch || !chapterVerseMatch.groups) {
        throw new Error('Invalid reference format');
    }
    const { chapterVersePart, bookName } = chapterVerseMatch.groups;
    let chapterStart, chapterEnd;
    let verseStart, verseEnd;
    // Handle different chapter and verse formats
    const match = chapterVersePart.match(/^(?<chapterStart>\d+)(:(?<verseStart>\d+))?(?:-(?<chapterEnd>\d+)(:(?<verseEnd>\d+))?)?(?:-(?<additionalChapterEnd>\d+)(:(?<additionalVerseEnd>\d+))?)?$/);
    if (match && match.groups) {
        chapterStart = match.groups.chapterStart;
        verseStart = match.groups.verseStart;
        if (match.groups.chapterEnd) {
            chapterEnd = match.groups.chapterEnd;
            verseEnd = match.groups.verseEnd;
        }
        else if (match.groups.additionalChapterEnd) {
            chapterEnd = match.groups.additionalChapterEnd;
            verseEnd = match.groups.additionalVerseEnd;
        }
        else if (match.groups.verseEnd) {
            verseEnd = match.groups.verseEnd;
        }
    }
    else {
        throw new Error('Invalid chapter and verse format');
    }
    // Construct and return the ReferenceGroup object
    const referenceGroup = {
        bookName,
        chapterStart,
        ...(chapterEnd && { chapterEnd }),
        ...(verseStart && { verseStart }),
        ...(verseEnd && { verseEnd }),
        ...(bibles && { bibles }),
    };
    return referenceGroup;
}
// - - - - - - - - -
/**
 *
 * @param input
 */
function parseReference(input) {
    return isLTR(input) ? parseLTRReference(input) : parseRTLReference(input);
}
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZXQtcmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLG9CQUFvQjtBQUNwQjs7O0dBR0c7QUFDSCxTQUFTLEtBQUssQ0FBQyxLQUFhO0lBQzFCLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDLENBQUMscURBQXFEO0lBQzVGLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCOzs7R0FHRztBQUNILFNBQVMsaUJBQWlCLENBQUMsS0FBYTtJQUN0QyxvQ0FBb0M7SUFDcEMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDaEUsSUFBSSxNQUE0QixDQUFDO0lBQ2pDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUV0QixJQUFJLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BELE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELG9EQUFvRDtJQUNwRCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUNuQyxrRkFBa0YsQ0FDbkYsQ0FBQztJQUNGLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFD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