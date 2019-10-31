// @flow

type CheckType = string | boolean | null;

/* eslint-disable sort-keys */
// Order for special keywords
const highestPriority = {
  schema: 0,
  Query: 1,
  Mutation: 2,
  Subscription: 3,
};
/* eslint-enable sort-keys */

const getSpecialKeywordOrder = (name: string): number => {
  return highestPriority[name];
};

export const isSpecialkeyword = (name: ?CheckType): boolean => {
  return typeof name === 'string' && typeof getSpecialKeywordOrder(name) === 'number';
};

export const specialKeywordCompare = (left: string, right: string): number => {
  const leftIsSpecial = isSpecialkeyword(left);
  const rightIsSpecial = isSpecialkeyword(right);

  if (leftIsSpecial && rightIsSpecial) {
    return getSpecialKeywordOrder(left) - getSpecialKeywordOrder(right);
  } else if (leftIsSpecial) {
    return -1;
  } else if (rightIsSpecial) {
    return 1;
  }

  return 0;
};
