# format-graphql

[![GitSpo Mentions](https://gitspo.com/badges/mentions/gajus/format-graphql?style=flat-square)](https://gitspo.com/mentions/gajus/format-graphql)
[![Travis build status](http://img.shields.io/travis/gajus/format-graphql/master.svg?style=flat-square)](https://travis-ci.org/gajus/format-graphql)
[![Coveralls](https://img.shields.io/coveralls/gajus/format-graphql.svg?style=flat-square)](https://coveralls.io/github/gajus/format-graphql)
[![NPM version](http://img.shields.io/npm/v/format-graphql.svg?style=flat-square)](https://www.npmjs.org/package/format-graphql)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Format GraphQL schema definition language (SDL) document.

## Behaviour

Alphabetically sorts definitions and fields.

### Example

Input:

```graphql
type Query {
  bananas: [Banana!]!
  apples: [Apple!]!
}

type Apple {
  name: String!
  id: ID!
}

type Banana {
  name: String!
  id: ID!
}

```

Output:

```graphql
type Apple {
  id: ID!
  name: String!
}

type Banana {
  id: ID!
  name: String!
}

type Query {
  apples: [Apple!]!
  bananas: [Banana!]!
}

```

## Usage

```bash
$ format-graphql --help
Sort GraphQL schema definition language (SDL) document.
Usage: format-graphql -f <sdl-path>

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --sdl-path  Path to the GraphQL schema definition (SDL) document.
                                                             [string] [required]
  --write     Overrides contents of the SDL document.        [string] [required]

$ # Prints formatted schema.
$ format-graphql ./schema.graphql
$
$ # Overrides target schema.
$ format-graphql --write ./schema.graphql

```
