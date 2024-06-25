export const getPassageID = (reference) => {
    // Ensure reference is an object
    if (typeof reference !== 'object' || reference === null) {
        throw new Error('Reference must be an object');
    }
    const sections = [];
    const requiredSection = createPassageBoundary(reference.book, reference.chapterStart, reference.verseStart);
    let optionalSection = undefined;
    if (reference.chapterEnd !== undefined && reference.verseEnd !== undefined) {
        optionalSection = createPassageBoundary(reference.book, reference.chapterEnd, reference.verseEnd);
    }
    else if (reference.chapterEnd !== undefined) {
        optionalSection = createPassageBoundary(reference.book, reference.chapterEnd);
    }
    else if (reference.verseEnd !== undefined) {
        optionalSection = createPassageBoundary(reference.book, reference.chapterStart, reference.verseEnd);
    }
    sections.push(requiredSection);
    if (optionalSection) {
        sections.push(optionalSection);
    }
    return sections.join('-').replace(/\s+/g, '');
};
const createPassageBoundary = (book, chapter, verse) => {
    return verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2FnZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYXNzYWdlL3Bhc3NhZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBb0IsRUFBVSxFQUFFO0lBQzNELGdDQUFnQztJQUNoQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFFOUIsTUFBTSxlQUFlLEdBQUcscUJBQXFCLENBQzNDLFNBQVMsQ0FBQyxJQUFJLEVBQ2QsU0FBUyxDQUFDLFlBQVksRUFDdEIsU0FBUyxDQUFDLFVBQVUsQ0FDckIsQ0FBQztJQUNGLElBQUksZUFBZSxHQUF1QixTQUFTLENBQUM7SUFFcEQsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQzNFLGVBQWUsR0FBRyxxQkFBcUIsQ0FDckMsU0FBUyxDQUFDLElBQUksRUFDZCxTQUFTLENBQUMsVUFBVSxFQUNwQixTQUFTLENBQUMsUUFBUSxDQUNuQixDQUFDO0lBQ0osQ0FBQztTQUFNLElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUM5QyxlQUFlLEdBQUcscUJBQXFCLENBQ3JDLFNBQVMsQ0FBQyxJQUFJLEVBQ2QsU0FBUyxDQUFDLFVBQVUsQ0FDckIsQ0FBQztJQUNKLENBQUM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDNUMsZUFBZSxHQUFHLHFCQUFxQixDQUNyQyxTQUFTLENBQUMsSUFBSSxFQUNkLFNBQVMsQ0FBQyxZQUFZLEVBQ3RCLFNBQVMsQ0FBQyxRQUFRLENBQ25CLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQztBQUNGLE1BQU0scUJBQXFCLEdBQUcsQ0FDNUIsSUFBWSxFQUNaLE9BQWdCLEVBQ2hCLEtBQWMsRUFDTixFQUFFO0lBQ1YsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksT0FBTyxFQUFFLENBQUM7QUFDdEUsQ0FBQyxDQUFDIn0=