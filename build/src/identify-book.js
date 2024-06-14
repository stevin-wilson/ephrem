/**
 * Finds the key with the maximum value in the given voteTally object.
 * @param voteTally - The vote tally object.
 * @returns - The key with the maximum value, or undefined if voteTally is empty.
 */
const getKeyOfMaxValue = (voteTally) => {
    let maxKey;
    let maxValue = -Infinity;
    // Iterate over each key-value pair in the voteTally object
    Object.entries(voteTally).forEach(([key, value]) => {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    });
    return maxKey;
};
/**
 * Returns the book ID for the given book name, Bible abbreviation, languages, and cache.
 * If the book ID cannot be determined, undefined is returned.
 * @param bookName - The name of the book.
 * @param bibleAbbreviation - The abbreviation of the Bible.
 * @param languages - An array of languages to filter the books by.
 * @param cache - The cache object containing book reference data.
 * @returns - The book ID if found, otherwise undefined.
 */
const getBookID = (bookName, bibleAbbreviation, languages, cache) => {
    const bookReferences = cache.bookNames[bookName];
    if (bookReferences === undefined || bookReferences.length === 0) {
        return undefined;
    }
    if (bibleAbbreviation !== undefined) {
        for (const bookReference of bookReferences) {
            if (bookReference.bibles.includes(bibleAbbreviation)) {
                return bookReference.id;
            }
        }
    }
    const voteTally = {};
    for (const bookReference of bookReferences) {
        if (languages !== undefined &&
            languages.length > 0 &&
            !languages.includes(bookReference.language)) {
            continue;
        }
        const bookID = bookReference.id;
        if (voteTally[bookID] === undefined) {
            voteTally[bookID] = 0;
        }
        voteTally[bookID] += bookReference.bibles.length;
    }
    return getKeyOfMaxValue(voteTally);
};
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZnktYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pZGVudGlmeS1ib29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOzs7O0dBSUc7QUFDSCxNQUFNLGdCQUFnQixHQUFHLENBQUMsU0FBb0IsRUFBc0IsRUFBRTtJQUNwRSxJQUFJLE1BQTBCLENBQUM7SUFDL0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFFekIsMkRBQTJEO0lBQzNELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtRQUNqRCxJQUFJLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztZQUNyQixRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sU0FBUyxHQUFHLENBQ2hCLFFBQWdCLEVBQ2hCLGlCQUFxQyxFQUNyQyxTQUErQixFQUMvQixLQUFZLEVBQ1EsRUFBRTtJQUN0QixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELElBQUksY0FBYyxLQUFLLFNBQVMsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ2hFLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLGlCQUFpQixLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3BDLEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFLENBQUM7WUFDM0MsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JELE9BQU8sYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUMxQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLFNBQVMsR0FBYyxFQUFFLENBQUM7SUFDaEMsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUNFLFNBQVMsS0FBSyxTQUFTO1lBQ3ZCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNwQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUMzQyxDQUFDO1lBQ0QsU0FBUztRQUNYLENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQ2hDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNuRCxDQUFDO0lBRUQsT0FBTyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUMifQ==