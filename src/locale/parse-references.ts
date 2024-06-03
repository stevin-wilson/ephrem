import {ReferenceGroup} from './common.js';
import {simplifyReferenceGroup} from './eng/parse-references.js';

const languagePatterns: {[key: string]: RegExp} = {
  // Malayalam
  mal: /[\u0D00-\u0D7F]/,
};

// - - - - - - - - -
export const getReferenceGroups = (
  input: string,
  groupSeparator = ';'
): Map<string, ReferenceGroup> => {
  const referenceGrpsStrings = input
    .split(groupSeparator)
    .map(group => group.trim())
    .filter(group => group !== '');

  const output: Map<string, ReferenceGroup> = new Map();

  for (const referenceGrpsString of referenceGrpsStrings) {
    output.set(
      referenceGrpsString,
      simplifyReferenceGroup(referenceGrpsString)
    );
  }

  return output;
};
