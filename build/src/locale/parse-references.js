import { simplifyReferenceGroup } from './eng/parse-references.js';
const languagePatterns = {
    // Malayalam
    mal: /[\u0D00-\u0D7F]/,
};
// - - - - - - - - -
export const getReferenceGroups = (input, groupSeparator = ';') => {
    const referenceGrpsStrings = input
        .split(groupSeparator)
        .map(group => group.trim())
        .filter(group => group !== '');
    const output = new Map();
    for (const referenceGrpsString of referenceGrpsStrings) {
        output.set(referenceGrpsString, simplifyReferenceGroup(referenceGrpsString));
    }
    return output;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtcmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2NhbGUvcGFyc2UtcmVmZXJlbmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUVqRSxNQUFNLGdCQUFnQixHQUE0QjtJQUNoRCxZQUFZO0lBQ1osR0FBRyxFQUFFLGlCQUFpQjtDQUN2QixDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLENBQ2hDLEtBQWEsRUFDYixjQUFjLEdBQUcsR0FBRyxFQUNTLEVBQUU7SUFDL0IsTUFBTSxvQkFBb0IsR0FBRyxLQUFLO1NBQy9CLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDckIsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQztJQUVqQyxNQUFNLE1BQU0sR0FBZ0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUV0RCxLQUFLLE1BQU0sbUJBQW1CLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxNQUFNLENBQUMsR0FBRyxDQUNSLG1CQUFtQixFQUNuQixzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUM1QyxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9