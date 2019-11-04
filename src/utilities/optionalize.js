// @flow

type SortOptionsType = {|
  sortDefinitions: boolean,
  sortFields: boolean,
  sortArguments: boolean,
|};

type OptionsType = SortOptionsType;

const isBoolean = (value): %checks => {
  return typeof value === 'boolean';
};

const toBoolean = (value, defaultValue?: boolean): boolean => {
  if (isBoolean(value)) {
    return value;
  }

  return isBoolean(defaultValue) ? defaultValue : Boolean(value);
};

const getSortOptions = (options?: $Shape<SortOptionsType>): SortOptionsType => {
  const {
    sortArguments,
    sortDefinitions,
    sortFields,
  } = options || {};

  return {
    sortArguments: toBoolean(sortArguments, true),
    sortDefinitions: toBoolean(sortDefinitions, true),
    sortFields: toBoolean(sortFields, true),
  };
};

export const getOptions = (options?: $Shape<OptionsType>): OptionsType => {
  const sortOptions = getSortOptions(options);

  return sortOptions;
};

export type {OptionsType};
