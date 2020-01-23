// @flow

import test from 'ava';
import {getOptions, toBoolean, isBoolean} from '../../../src/utilities/optionalize';

test('get sort options when no args', (t) => {
  const input = undefined;
  const expected = {
    sortArguments: true,
    sortDefinitions: true,
    sortFields: true,
  };
  const actual = getOptions(input);

  t.deepEqual(actual, expected);
});

test('get sort options when empty object', (t) => {
  const input = {};
  const expected = {
    sortArguments: true,
    sortDefinitions: true,
    sortFields: true,
  };
  const actual = getOptions(input);

  t.deepEqual(actual, expected);
});

test('get sort options when proper value type addressed', (t) => {
  const input = {
    sortDefinitions: false,
  };
  const expected = {
    sortArguments: true,
    sortDefinitions: false,
    sortFields: true,
  };
  const actual = getOptions(input);

  t.deepEqual(actual, expected);
});

test('to boolean with proper value addressed', (t) => {
  const inputs = [true, false];

  inputs.forEach((input) => {
    const actual = isBoolean(toBoolean(input));

    t.true(actual);
  });
});

test('to boolean with in-proper value addressed', (t) => {
  const inputs = [null, undefined, 0, '', NaN];

  inputs.forEach((input) => {
    const actual = toBoolean(input);

    t.false(actual);
  });
});

test('to boolean with in-proper value addressed and default true', (t) => {
  const inputs = [null, undefined, 0, '', NaN];

  inputs.forEach((input) => {
    const actual = toBoolean(input, true);

    t.true(actual);
  });
});
