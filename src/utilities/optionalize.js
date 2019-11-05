// @flow

type SortOptionsType = {|
  sortDefinitions: boolean,
  sortFields: boolean,
  sortArguments: boolean,
|};

type OptionsType = SortOptionsType;

// eslint-disable-next-line flowtype/no-weak-types
const isBoolean = (value: any): %checks => {
  return typeof value === 'boolean';
};

const toBoolean = <T>(value: T, defaultValue?: boolean): boolean => {
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

const getOptions = (options?: $Shape<OptionsType>): OptionsType => {
  const sortOptions = getSortOptions(options);

  return sortOptions;
};

export {
  isBoolean,
  toBoolean,
  getOptions,
};
export type {OptionsType};
