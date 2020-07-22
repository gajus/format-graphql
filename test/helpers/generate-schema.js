/**
 * @file Helper tool to generate a huge schema for testing purposes
 */

function getType(typeName, numFields) {
    const fields = [];

    Array(numFields)
        .fill("")
        .forEach((_, idx) => {
            const fieldName = `dummyField${idx + 1}`;

            fields.push(
                // prettier-ignore
                [
                    `  """`,
                    `  Description for field: ${fieldName}`,
                    `  """`,
                    `  ${fieldName}: String`,
                ].join("\n")
            );
        });

    return [
        // prettier-ignore
        `"""`,
        `Description for type: ${typeName}`,
        `"""`,
        `type ${typeName} {`,
        fields.join("\n\n"),
        `}`,
    ].join("\n");
}

export default function main({
    // How many types should we generate?
    numberOfTypes,
    // How many fields per type should we generate?
    fieldsPerType,
}) {
    const types = [];

    Array(numberOfTypes)
        .fill("")
        .forEach((_, idx) => {
            types.push(getType(`DummyType${idx + 1}`, fieldsPerType));
        });

    return types.join("\n\n");
}