# sort-graphql-sdl

[![GitSpo Mentions](https://gitspo.com/badges/mentions/gajus/sort-graphql-sdl?style=flat-square)](https://gitspo.com/mentions/gajus/sort-graphql-sdl)
[![Travis build status](http://img.shields.io/travis/gajus/sort-graphql-sdl/master.svg?style=flat-square)](https://travis-ci.org/gajus/sort-graphql-sdl)
[![Coveralls](https://img.shields.io/coveralls/gajus/sort-graphql-sdl.svg?style=flat-square)](https://coveralls.io/github/gajus/sort-graphql-sdl)
[![NPM version](http://img.shields.io/npm/v/sort-graphql-sdl.svg?style=flat-square)](https://www.npmjs.org/package/sort-graphql-sdl)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Sort GraphQL schema definition language (SDL) document.

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
$ sort-graphql-sdl --help
Sort GraphQL schema definition language (SDL) document.
Usage: sort-graphql-sdl -f <sdl-path>

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --sdl-path  Path to the GraphQL schema definition (SDL) document.
                                                             [string] [required]
  --write     Overrides contents of the SDL document.        [string] [required]

$ # Prints formatted schema.
$ sort-graphql-sdl ./schema.graphql
$
$ # Overrides target schema.
$ sort-graphql-sdl --write ./schema.graphql

```
