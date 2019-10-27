// @flow

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import {
  formatSdl,
} from '../utilities';

const argv = yargs
  .env('SGS')
  .help()
  .usage('$0 <sdl-path>', 'Sort GraphQL schema definition language (SDL) document.', (command) => {
    command.positional('sdl-path', {
      description: 'Path to the GraphQL schema definition (SDL) document.',
      type: 'string',
    });
  })
  .options({
    write: {
      default: false,
      description: 'Overrides contents of the SDL document.',
      type: 'string',
    },
  })
  .parse();

const resolvedPath = path.resolve(argv.sdlPath);

const inputSdl = fs.readFileSync(resolvedPath, 'utf8');

const outputSdl = formatSdl(inputSdl);

if (argv.write) {
  fs.writeFileSync(resolvedPath, outputSdl);

  // eslint-disable-next-line no-console
  console.log('Target SDL document has been overriden with the formatted SDL.');
} else {
  // eslint-disable-next-line no-console
  console.log(outputSdl);
}
