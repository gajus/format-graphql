// @flow

import {
  print,
  parse,
} from 'graphql';
import type {ASTNode} from 'graphql';
import {getOptions} from './optionalize';
import type {OptionsType} from './optionalize';

const sortSchema = (key, node: ASTNode, options: OptionsType) => {
  const value = node[key];

  const {
    sortArguments,
    sortDefinitions,
    sortEnums,
    sortFields,
  } = options;

  if (
    sortDefinitions && key === 'definitions' ||
    sortEnums && node.kind === 'EnumTypeDefinition' && key === 'values' ||
    sortFields && key === 'fields' ||
    sortArguments && key === 'arguments'
  ) {
    return value.slice().sort((a, b) => {
      const nonNamedKinds = ['SchemaDefinition', 'SchemaExtension'];
      if (nonNamedKinds.includes(a.kind)) {
        return -1;
      }

      if (nonNamedKinds.includes(b.kind)) {
        return 1;
      }

      return a.name.value.localeCompare(b.name.value);
    });
  }

  return value;
};

/**
 * We only care about rearranging:
 * - definitions
 * - enums
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
 *       {
 *         values: [
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
 *
 * or, for enums:
 *
 *   <start> -> definitions -> values
 */
const walkAST = (node: ASTNode, options: OptionsType, key: ?string) => {
  // Map a node type to the child node type we should walk down next
  const nextKey = {
    arguments: null,
    definitions: 'fields',
    EnumTypeDefinition: 'values',
    fields: 'arguments',
  };

  if (!key) {
    return node;
  }

  if (!Array.isArray(node[key])) {
    return node;
  }

  node[key] = sortSchema(key, node, options).map((child) => {
    return walkAST(child, options, nextKey[child.kind] || nextKey[key]);
  });

  return node;
};

export default (schemaSdl: string, options?: $Shape<OptionsType>): string => {
  return print(walkAST(parse(schemaSdl), getOptions(options), 'definitions'));
};
