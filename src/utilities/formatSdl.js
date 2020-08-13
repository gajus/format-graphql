// @flow

import {
  print,
  parse,
  Kind,
} from 'graphql';
import type {ASTNode, DocumentNode, SchemaDefinitionNode, SchemaExtensionNode} from 'graphql';
import {getOptions} from './optionalize';
import type {OptionsType} from './optionalize';

type SchemaDefinitionOrExtensionType = SchemaDefinitionNode | SchemaExtensionNode;

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
    return value.slice().sort((a, b) => {
      const sortOrder = a.name?.value.localeCompare(b.name?.value);

      // If the names match, make sure any extensions are after the definition
      if (sortOrder === 0 || sortOrder === undefined) {
        if (a.kind.includes('Extension') && b.kind.includes('Definition')) {
          return 1;
        } else if (b.kind.includes('Extension') && a.kind.includes('Definition')) {
          return -1;
        }
      }

      return sortOrder;
    });
  }

  return value;
};

const getSchemaOperationTypes = (definitions: $ReadOnlyArray<SchemaDefinitionOrExtensionType>) => {
  const operationTypes = {
    mutation: 'Mutation',
    query: 'Query',
    subscription: 'Subscription',
  };
  definitions.forEach((definition) => {
    if (definition.operationTypes) {
      definition.operationTypes.forEach((operationType) => {
        operationTypes[operationType.operation] = operationType.type.name.value;
      });
    }
  });

  return operationTypes;
};

const sortDefinitionsByKind = ({definitions}: DocumentNode): DocumentNode => {
  const schemas = definitions.filter((definition) => {
    return definition.kind === Kind.SCHEMA_DEFINITION || definition.kind === Kind.SCHEMA_EXTENSION;
  });
  // eslint-disable-next-line flowtype/no-weak-types, no-extra-parens
  const {query, mutation, subscription} = getSchemaOperationTypes((schemas: any));
  const scalars = definitions.filter((definition) => {
    return definition.kind === Kind.SCALAR_TYPE_DEFINITION || definition.kind === Kind.SCALAR_TYPE_EXTENSION;
  });
  const directives = definitions.filter((definition) => {
    return definition.kind === Kind.DIRECTIVE_DEFINITION;
  });
  const allObjectTypes = definitions.filter((definition) => {
    return definition.kind === Kind.OBJECT_TYPE_DEFINITION || definition.kind === Kind.OBJECT_TYPE_EXTENSION;
  });
  // eslint-disable-next-line flowtype/no-weak-types
  const queryTypes = allObjectTypes.filter((definition: any) => {
    return definition.name.value === query;
  });
  // eslint-disable-next-line flowtype/no-weak-types
  const mutationTypes = allObjectTypes.filter((definition: any) => {
    return definition.name.value === mutation;
  });
  // eslint-disable-next-line flowtype/no-weak-types
  const subscriptionTypes = allObjectTypes.filter((definition: any) => {
    return definition.name.value === subscription;
  });
  // eslint-disable-next-line flowtype/no-weak-types
  const otherObjectTypes = allObjectTypes.filter((definition: any) => {
    return ![query, mutation, subscription].includes(definition.name.value);
  });
  const interfaces = definitions.filter((definition) => {
    return definition.kind === Kind.INTERFACE_TYPE_DEFINITION || definition.kind === Kind.INTERFACE_TYPE_EXTENSION;
  });
  const unions = definitions.filter((definition) => {
    return definition.kind === Kind.UNION_TYPE_DEFINITION || definition.kind === Kind.UNION_TYPE_EXTENSION;
  });
  const inputObjectTypes = definitions.filter((definition) => {
    return definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION || definition.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION;
  });
  const enums = definitions.filter((definition) => {
    return definition.kind === Kind.ENUM_TYPE_DEFINITION || definition.kind === Kind.ENUM_TYPE_EXTENSION;
  });

  return {
    definitions: [
      ...schemas,
      ...scalars,
      ...directives,
      ...queryTypes,
      ...mutationTypes,
      ...subscriptionTypes,
      ...otherObjectTypes,
      ...interfaces,
      ...unions,
      ...inputObjectTypes,
      ...enums,
    ],
    kind: Kind.DOCUMENT,
  };
};

/**
 * We only care about rearranging:
 * - definitions
 * - fields
 * - arguments
 *
 * A GraphQL Schema AST looks something like this:
 *
 *   {
 *     "definitions": [
 *       {
 *         fields: [
 *           {
 *             arguments: [
 *               ...
 *             ]
 *           }
 *           ...
 *         ],
 *       },
 *       ...
 *     ]
 *   }
 *
 * Note that there are no cycles -  we don't need to recurse through the whole
 * AST. There's a finite nest depth of 3 node types for us to walk down:
 *
 *   <start> -> definitions -> fields -> arguments
 */
const walkAST = (node: ASTNode, options: OptionsType, key: ?string) => {
  // Map a node type to the child node type we should walk down next
  const nextKey = {
    arguments: null,
    definitions: 'fields',
    fields: 'arguments',
  };

  if (!key) {
    return node;
  }

  if (!Array.isArray(node[key])) {
    return node;
  }

  node[key] = sortSchema(key, node[key], options).map((child) => {
    return walkAST(child, options, nextKey[key]);
  });

  if (node.kind === Kind.DOCUMENT && options.sortDefinitions) {
    return sortDefinitionsByKind(node);
  }

  return node;
};

export default (schemaSdl: string, options?: $Shape<OptionsType>): string => {
  return print(walkAST(parse(schemaSdl), getOptions(options), 'definitions'));
};
