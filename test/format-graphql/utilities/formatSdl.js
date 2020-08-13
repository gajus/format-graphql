// @flow

import test from 'ava';
import formatSdl from '../../../src/utilities/formatSdl';
import generateSchema from '../../helpers/generateSchema';

test('sorts definitions', (t) => {
  const input = `
  type Foo {
    id: ID!
  }

  type Bar {
    id: ID!
  }
`;

  const expectedOutput = `type Bar {
  id: ID!
}

type Foo {
  id: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

test('puts schema at the top)', (t) => {
  const input = `
  type Foo {
    id: ID!
  }

  schema {
    query: Foo
  }
`;

  const expectedOutput = `schema {
  query: Foo
}

type Foo {
  id: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

test('sorts fields', (t) => {
  const input = `
  type Foo {
    foo: ID!
    bar: ID!
  }
`;

  const expectedOutput = `type Foo {
  bar: ID!
  foo: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

test('does not sort parameters', (t) => {
  const input = `
  type Foo {
    foo(bar: ID, foo: ID): ID!
  }
`;

  const expectedOutput = `type Foo {
  foo(bar: ID, foo: ID): ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

test('does not strip description', (t) => {
  const input = `
  type Foo {
    """foo"""
    foo: ID!
  }
`;

  const expectedOutput = `type Foo {
  """foo"""
  foo: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

// @see https://github.com/graphql/graphql-js/issues/2241#issuecomment-546711570
// eslint-disable-next-line ava/no-skip-test
test.skip('does not strip comments', (t) => {
  const input = `
  type Foo {
    # foo
    foo: ID!
  }
`;

  const expectedOutput = `type Foo {
  # foo
  foo: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});

test('does not sort definitions when sort argument is false', (t) => {
  const input = `
  type Foo {
    foo: ID
  }

  type Bar {
    bar: ID
  }
`;

  const expectedOutput = `type Foo {
  foo: ID
}

type Bar {
  bar: ID
}
`;

  t.is(formatSdl(input, {sortDefinitions: false}), expectedOutput);
});

test('does not sort fields when sort argument is false', (t) => {
  const input = `
  type Foo {
    apple: ID
    cat: ID
    banana: ID
  }
`;

  const expectedOutput = `type Foo {
  apple: ID
  cat: ID
  banana: ID
}
`;

  t.is(formatSdl(input, {sortFields: false}), expectedOutput);
});

test('does not sort arguments when sort argument is false', (t) => {
  const input = `
  type Foo {
    bar(banana: ID, cat: ID, apple: ID): ID!
  }
`;

  const expectedOutput = `type Foo {
  bar(banana: ID, cat: ID, apple: ID): ID!
}
`;

  t.is(formatSdl(input, {sortArguments: false}), expectedOutput);
});

test('sort whether sort options is true or non exist', (t) => {
  const input = `
  type Foo {
    apple: ID
    cat: ID
    banana: ID
  }

  type Bar {
    bar(banana: ID, cat: ID, apple: ID): ID!
  }
`;

  const expectedOutput = `type Bar {
  bar(apple: ID, banana: ID, cat: ID): ID!
}

type Foo {
  apple: ID
  banana: ID
  cat: ID
}
`;

  t.is(formatSdl(input), expectedOutput);
  t.is(formatSdl(input, {
    sortArguments: true,
    sortDefinitions: true,
    sortFields: true,
  }), expectedOutput);
});

test('sorts definitions according to their kind', (t) => {
  const input = `
  extend interface Person {
    lastName: String
  }

  extend union Union = QueryType

  extend type Foo {
    bar: String
  }

  union Union = Foo | Bar

  interface Person {
    firstName: String
  }

  interface Node {
    id: ID!
  }

  type QueryType {
    query: String
  }

  extend schema {
    mutation: Mutation
  }

  directive @upper on FIELD_DEFINITION

  type Foo {
    id: ID
  }

  directive @lower on FIELD_DEFINITION

  extend type Mutation {
    doSomethingElse: String
  }

  extend enum Flavor {
    CHOCOLATE
  }

  scalar JSON

  input Order {
    flavor: Flavor
  }

  schema {
    query: QueryType
  }

  type Mutation {
    doSomething: String
  }

  extend scalar Date @serialize

  directive @serialize on SCALAR

  enum Flavor {
    VANILLA
  }

  extend input Order {
    quantity: Int
  }

  scalar Date

  type Bar {
    id: ID
  }

  extend type Bar {
    bar: String
  }
`;

  const expectedOutput = `schema {
  query: QueryType
}

extend schema {
  mutation: Mutation
}

scalar Date

extend scalar Date @serialize

scalar JSON

directive @lower on FIELD_DEFINITION

directive @serialize on SCALAR

directive @upper on FIELD_DEFINITION

type QueryType {
  query: String
}

type Mutation {
  doSomething: String
}

extend type Mutation {
  doSomethingElse: String
}

type Bar {
  id: ID
}

extend type Bar {
  bar: String
}

type Foo {
  id: ID
}

extend type Foo {
  bar: String
}

interface Node {
  id: ID!
}

interface Person {
  firstName: String
}

extend interface Person {
  lastName: String
}

union Union = Foo | Bar

extend union Union = QueryType

input Order {
  flavor: Flavor
}

extend input Order {
  quantity: Int
}

enum Flavor {
  VANILLA
}

extend enum Flavor {
  CHOCOLATE
}
`;

  t.is(formatSdl(input), expectedOutput);
});

// Regression test for https://github.com/gajus/format-graphql/issues/10
test('does not fail for large schemas', (t) => {
  const input = generateSchema(1000, 1);

  // sanity check to make sure we don't blow up
  t.notThrows(() => {
    return formatSdl(input);
  });
});

