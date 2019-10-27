// @flow

import mapObject from 'map-obj';
import {
  print,
  parse,
} from 'graphql';

export default (schemaSdl: string): string => {
  return print(mapObject(parse(schemaSdl), (key, value) => {
    if ((key === 'fields' || key === 'definitions') && Array.isArray(value)) {
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
