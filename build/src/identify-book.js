import { needsBiblesCacheUpdate, updateBiblesCache, } from './bible-library/cache.js';
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
const getBookID = async (bookName, bibleAbbreviation, languages, cache, useMajorityFallback = true, forceUpdateCache = false, biblesToExclude = [], config = {}) => {
    useMajorityFallback ||= !bibleAbbreviation;
    const needToUpdateCache = needsBiblesCacheUpdate(bibleAbbreviation, languages, cache);
    if (needToUpdateCache || forceUpdateCache) {
        await updateBiblesCache(languages, cache, forceUpdateCache, biblesToExclude, config);
    }
    const bookReferences = cache.bookNames[bookName];
    if (!bookReferences) {
        return undefined;
    }
    let bookID = undefined;
    if (bibleAbbreviation) {
        bookID = getBookIdInBible(bookName, bibleAbbreviation, cache);
    }
    if (!bookID && useMajorityFallback) {
        bookID = getBookIdByMajority(bookName, languages, cache);
    }
    return bookID;
};
const getBookIdInBible = (bookName, bibleAbbreviation, cache) => {
    const bookReferences = cache.bookNames[bookName];
    if (!bookReferences) {
        return undefined;
    }
    if (bibleAbbreviation) {
        for (const bookReference of bookReferences) {
            if (bookReference.bibles.includes(bibleAbbreviation)) {
                return bookReference.id;
            }
        }
    }
    return undefined;
};
const getBookIdByMajority = (bookName, languages, cache) => {
    const bookReferences = cache.bookNames[bookName];
    if (!bookReferences) {
        return undefined;
    }
    const voteTally = {};
    for (const bookReference of bookReferences) {
        if (languages &&
            languages.length > 0 &&
            !languages.includes(bookReference.language)) {
            continue;
        }
        const bookID = bookReference.id;
        if (!voteTally[bookID]) {
            voteTally[bookID] = 0;
        }
        voteTally[bookID] += bookReference.bibles.length;
    }
    return getKeyOfMaxValue(voteTally);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZnktYm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pZGVudGlmeS1ib29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsaUJBQWlCLEdBQ2xCLE1BQU0sMEJBQTBCLENBQUM7QUFHbEM7Ozs7R0FJRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxTQUFvQixFQUFzQixFQUFFO0lBQ3BFLElBQUksTUFBMEIsQ0FBQztJQUMvQixJQUFJLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUV6QiwyREFBMkQ7SUFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO1FBQ2pELElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO1lBQ3JCLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDakIsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFDckIsUUFBZ0IsRUFDaEIsaUJBQXFDLEVBQ3JDLFNBQW1CLEVBQ25CLEtBQWtCLEVBQ2xCLG1CQUFtQixHQUFHLElBQUksRUFDMUIsZ0JBQWdCLEdBQUcsS0FBSyxFQUN4QixrQkFBNEIsRUFBRSxFQUM5QixTQUE2QixFQUFFLEVBQ0YsRUFBRTtJQUMvQixtQkFBbUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDO0lBRTNDLE1BQU0saUJBQWlCLEdBQUcsc0JBQXNCLENBQzlDLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxDQUNOLENBQUM7SUFFRixJQUFJLGlCQUFpQixJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFDMUMsTUFBTSxpQkFBaUIsQ0FDckIsU0FBUyxFQUNULEtB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