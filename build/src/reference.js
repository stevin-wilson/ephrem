const punctuationRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
// - - - - - - - - -
const getPassageID = (reference) => {
    const sections = [];
    let requiredSection = reference.verseStart !== undefined
        ? `${reference.book}.${reference.chapterStart}.${reference.verseStart}`
        : `${reference.book}.${reference.chapterStart}`;
    let optionalSection = undefined;
    if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
        optionalSection = `${reference.book}.${reference.chapterEnd}.${reference.verseEnd}`;
    }
    else if (reference.chapterEnd !== undefined) {
        optionalSection = `${reference.book}.${reference.chapterEnd}`;
    }
    else if (reference.verseEnd !== undefined) {
        requiredSection += `.${reference.verseEnd}`;
    }
    sections.push(requiredSection);
    if (optionalSection) {
        sections.push(optionalSection);
    }
    return sections.join('-').replace(/\s+/g, '');
};
export const isValidStringOrUndefined = (value) => {
    if (value === undefined) {
        return true;
    }
    else if (punctuationRegex.test(value)) {
        // Test if the string contains any punctuation characters
        return false;
    }
    else {
        // Check if the value is not a number or is a non-negative integer
        const parsedNumber = Number(value);
        return (isNaN(parsedNumber) ||
            (Number.isInteger(parsedNumber) && parsedNumber > 0));
    }
};
// - - - - - - - - -
export const hasValidSyntax = (reference) => {
    for (const attribute of [
        reference.chapterStart,
        reference.chapterEnd,
        reference.verseStart,
        reference.verseEnd,
    ]) {
        if (!isValidStringOrUndefined(attribute)) {
            return false;
        }
    }
    if (reference.chapterEnd !== undefined &&
        reference.chapterEnd !== reference.chapterStart &&
        reference.verseStart !== undefined &&
        reference.verseEnd === undefined) {
        return false;
    }
    return !(reference.verseEnd !== undefined && reference.verseStart === undefined);
};
// - - - - - - - - -
export const isMultiChapter = (reference) => {
    let output;
    if (reference.chapterEnd === undefined) {
        output = false;
    }
    else {
        output = reference.chapterEnd !== reference.chapterStart;
    }
    return output;
};
// - - - - - - - - -
export const isSingleChapter = (reference) => {
    let output;
    if (isMultiChapter(reference)) {
        output = false;
    }
    else {
        output = true;
    }
    return output;
};
// - - - - - - - - -
export const isSingleVerse = (reference) => {
    if (isMultiChapter(reference)) {
        return false;
    }
    if (reference.chapterEnd !== undefined &&
        reference.chapterEnd !== reference.chapterStart) {
        return false;
    }
    if (reference.verseStart === undefined) {
        return false;
    }
    if (reference.verseEnd !== undefined &&
        reference.verseEnd !== reference.verseStart) {
        return false;
    }
    return true;
};
// - - - - - - - - -
export const isSingleChapterMultipleVerses = (reference) => {
    let output;
    if (!isSingleChapter(reference)) {
        output = false;
    }
    else
        output = !isSingleVerse(reference);
    return output;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlZmVyZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLGdCQUFnQixHQUFHLHVDQUF1QyxDQUFDO0FBWWpFLG9CQUFvQjtBQUNwQixNQUFNLFlBQVksR0FBRyxDQUFDLFNBQW9CLEVBQVUsRUFBRTtJQUNwRCxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFFOUIsSUFBSSxlQUFlLEdBQ2pCLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNoQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUN2RSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVwRCxJQUFJLGVBQWUsR0FBdUIsU0FBUyxDQUFDO0lBRXBELElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUMzRSxlQUFlLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RGLENBQUM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDOUMsZUFBZSxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDaEUsQ0FBQztTQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUM1QyxlQUFlLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxDQUN0QyxLQUF5QixFQUNoQixFQUFFO0lBQ1gsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDeEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO1NBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN4Qyx5REFBeUQ7UUFDekQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO1NBQU0sQ0FBQztRQUNOLGtFQUFrRTtRQUNsRSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxDQUNMLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbkIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FDckQsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBb0IsRUFBVyxFQUFFO0lBQzlELEtBQUssTUFBTSxTQUFTLElBQUk7UUFDdEIsU0FBUyxDQUFDLFlBQVk7UUFDdEIsU0FBUyxDQUFDLFVBQVU7UUFDcEIsU0FBUyxDQUFDLFVBQVU7UUFDcEIsU0FBUyxDQUFDLFFBQVE7S0FDbkIsRUFBRSxDQUFDO1FBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDekMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVELElBQ0UsU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTO1FBQ2xDLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLFlBQVk7UUFDL0MsU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTO1FBQ2xDLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUNoQyxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsT0FBTyxDQUFDLENBQ04sU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQ3ZFLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBb0IsRUFBVyxFQUFFO0lBQzlELElBQUksTUFBZSxDQUFDO0lBQ3BCLElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLFlBQVksQ0FBQztJQUMzRCxDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxDQUFDLFNBQW9CLEVBQVcsRUFBRTtJQUMvRCxJQUFJLE1BQWUsQ0FBQztJQUVwQixJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDakIsQ0FBQztTQUFNLENBQUM7UUFDTixNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsU0FBb0IsRUFBVyxFQUFFO0lBQzdELElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDOUIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsSUFDRSxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVM7UUFDbEMsU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsWUFBWSxFQUMvQyxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQ0UsU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTO1FBQ2hDLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLFVBQVUsRUFDM0MsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLENBQzNDLFNBQW9CLEVBQ1gsRUFBRTtJQUNYLElBQUksTUFBZSxDQUFDO0lBRXBCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLENBQUM7O1FBQU0sTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9