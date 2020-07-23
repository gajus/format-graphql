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

// Regression test for https://github.com/gajus/format-graphql/issues/10
test('does not fail for large schemas', (t) => {
  const input = generateSchema(1000, 1);

  // sanity check to make sure we don't blow up
  t.notThrows(() => {
    return formatSdl(input);
  });
});

