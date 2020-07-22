// @flow

import {
  print,
  parse,
} from 'graphql';
import type {ASTNode} from 'graphql';
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
    return value.slice().sort((a, b) => {
      if (a.kind === 'SchemaDefinition') {
        return -1;
      }

      if (b.kind === 'SchemaDefinition') {
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

  return node;
};

export default (schemaSdl: string, options?: $Shape<OptionsType>): string => {
  return print(walkAST(parse(schemaSdl), getOptions(options), 'definitions'));
};
