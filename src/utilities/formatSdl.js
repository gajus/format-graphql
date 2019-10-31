// @flow

import mapObject from 'map-obj';
import {
  print,
  parse,
} from 'graphql';
import {
  isSpecialkeyword,
  specialKeywordCompare,
} from './isSpecialKeyword';

export default (schemaSdl: string): string => {
  return print(mapObject(parse(schemaSdl), (key, value) => {
    if (key === 'definitions' && Array.isArray(value)) {
      return [
        key,
        value.slice().sort((a, b) => {
          const left = a.name.value;
          const right = b.name.value;

          if (isSpecialkeyword(left) || isSpecialkeyword(right)) {
            return specialKeywordCompare(left, right);
          }

          return left.localeCompare(right);
        }),
      ];
    }

    if (key === 'fields' && Array.isArray(value)) {
      return [
        key,
        value.slice().sort((a, b) => {
          return a.name.value.localeCompare(b.name.value);
        }),
      ];
    }

    return [
      key,
      value,
    ];
  }, {
    deep: true,
  }));
};
