// @flow

import test from 'ava';
import {getOptions} from '../../../src/utilities/optionalize';

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

// test('get sort options when argv value is in-proper', (t) => {
//   const inputs = [false, null, '', 0, NaN];
//   const expected = {
//     sortArguments: true,
//     sortDefinitions: true,
//     sortFields: true,
//   };

//   inputs.forEach((input) => {
//     t.deepEqual(getOptions(input), expected);
//   });
// });

// test('get sort options when option value is in-proper', (t) => {
//   const inputs = [undefined, null, '', 0, NaN];
//   const expected = {
//     sortArguments: true,
//     sortDefinitions: true,
//     sortFields: true,
//   };

//   inputs.forEach((value) => {
//     t.deepEqual(getOptions({
//       sortDefinitions: value,
//     }), expected);
//   });
// });