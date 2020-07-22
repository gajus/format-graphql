/**
 * @file Helper to generate a huge schema for testing purposes
 */

const getType = (typeName, numberFields) => {
  const fields = [];

  new Array(numberFields)
    .fill('')
    .forEach((_, idx) => {
      const fieldName = `dummyField${idx + 1}`;

      fields.push(
        [
          '  """',
          `  Description for field: ${fieldName}`,
          '  """',
          `  ${fieldName}: String`,
        ].join('\n'),
      );
    });

  return [
    '"""',
    `Description for type: ${typeName}`,
    '"""',
    `type ${typeName} {`,
    fields.join('\n\n'),
    '}',
  ].join('\n');
};

const generateSchema = (
  // How many types should we generate?
  numberOfTypes,

  // How many fields per type should we generate?
  fieldsPerType,
) => {
  const types = [];

  new Array(numberOfTypes)
    .fill('')
    .forEach((_, idx) => {
      types.push(getType(`DummyType${idx + 1}`, fieldsPerType));
    });

  return types.join('\n\n');
};

export default generateSchema;
