// @flow

import mapObject from 'map-obj';
import {
  print,
  parse,
} from 'graphql';
import {getOptions} from './optionalize';
import type {OptionsType} from './optionalize';

const sortSchema = (key, value, options: OptionsType) => {
  const {
    sortArguments,
    sortDefinitions,
    sortFields,
  } = options;

  if (
    sortDefinitions && key === 'definitions' ||
    sortFields && key === 'fields' ||
    sortArguments && key === 'arguments'
  ) {
    return [
      key,
      value.slice().sort((a, b) => {
        if (a.kind === 'SchemaDefinition') {
          return -1;
        }

        if (b.kind === 'SchemaDefinition') {
          return 1;
        }

        return a.name.value.localeCompare(b.name.value);
      }),
    ];
  }

  return [
    key,
    value,
  ];
};

export default (schemaSdl: string, options?: $Shape<OptionsType>): string => {
  return print(mapObject(parse(schemaSdl), (key, value) => {
    if (['definitions', 'fields', 'arguments'].includes(key) && Array.isArray(value)) {
      return sortSchema(key, value, getOptions(options));
    }

    return [
      key,
      value,
    ];
  }, {
    deep: true,
  }));
};
