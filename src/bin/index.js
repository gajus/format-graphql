#!/usr/bin/env node

// @flow

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import {
  formatSdl,
} from '../utilities';

const argv = yargs
  .env('FG')
  .help()
  .usage('$0 <sdl-path>', 'Sort GraphQL schema definition language (SDL) document.', (command) => {
    command.positional('sdl-path', {
      description: 'Path to the GraphQL schema definition (SDL) document.',
      type: 'string',
    });
  })
  .options({
    'sort-arguments': {
      default: true,
      description: 'Sort on arguments',
      type: 'boolean',
    },
    'sort-definitions': {
      default: true,
      description: 'Sort on definitions',
      type: 'boolean',
    },
    'sort-enums': {
      default: true,
      description: 'Sort on enums',
      type: 'boolean',
    },
    'sort-fields': {
      default: true,
      description: 'Sort on fields',
      type: 'boolean',
    },
    write: {
      default: false,
      description: 'Overrides contents of the SDL document.',
      type: 'boolean',
    },
  })
  .parse();

const resolvedPath = path.resolve(argv.sdlPath);

const inputSdl = fs.readFileSync(resolvedPath, 'utf8');

const {
  write,
  sortArguments,
  sortDefinitions,
  sortEnums,
  sortFields,
} = argv;

const outputSdl = formatSdl(inputSdl, {
  sortArguments,
  sortDefinitions,
  sortEnums,
  sortFields,
});

if (write) {
  fs.writeFileSync(resolvedPath, outputSdl);

  // eslint-disable-next-line no-console
  console.log('Target SDL document has been overriden with the formatted SDL.');
} else {
  // eslint-disable-next-line no-console
  console.log(outputSdl);
}
