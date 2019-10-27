// @flow

import test from 'ava';
import formatSdl from '../../../src/utilities/formatSdl';

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
    "foo"
    foo: ID!
  }
`;

  const expectedOutput = `type Foo {
  "foo"
  foo: ID!
}
`;

  t.is(formatSdl(input), expectedOutput);
});
