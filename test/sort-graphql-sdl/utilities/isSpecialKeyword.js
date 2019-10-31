// @flow

import test from 'ava';
import {
  isSpecialkeyword,
  specialKeywordCompare,
} from '../../../src/utilities/isSpecialKeyword';

test('test special keywords', (t) => {
  const inputs = ['Query', 'Mutation', 'Subscription', 'schema'];
  const expectedOutput = true;

  inputs.forEach((input) => {
    t.is(isSpecialkeyword(input), expectedOutput);
  });
});

test('distinguish not special keyword', (t) => {
  const input = 'User';
  const expectedOutput = false;

  t.is(isSpecialkeyword(input), expectedOutput);
});

test('distinguish falsy case as false', (t) => {
  const inputs = ['', false, null, undefined];
  const expectedOutput = false;

  inputs.forEach((input) => {
    t.is(isSpecialkeyword(input), expectedOutput);
  });
});

test('schema has highest order between special keywords', (t) => {
  const input = 'schema';
  const targets = ['Query', 'Mutation', 'Subscription'];
  const lowerThanZero = (value: number): boolean => {
    return value < 0;
  };

  targets.forEach((target) => {
    const actualOutput = specialKeywordCompare(input, target);

    t.is(lowerThanZero(actualOutput), true);
  });
});
