// @flow

import fs from 'fs';
import yargs from 'yargs';
import {
  formatSdl,
} from '../utilities';

const argv = yargs
  .env('SGS')
  .help()
  .usage('Sort GraphQL schema definition language (SDL) document.\nUsage: $0 -f <sdl-path>')
  .options({
    'sdl-path': {
      demand: true,
      description: 'Path to the GraphQL schema definition (SDL) document.',
      type: 'string',
    },
    write: {
      demand: true,
      description: 'Overrides contents of the SDL document.',
      type: 'string',
    },
  })
  .parse();

const inputSdl = fs.readFileSync(argv.sdlPath, 'utf8');

const outputSdl = formatSdl(inputSdl);

if (argv.write) {
  fs.writeFileSync(argv.sdlPath, outputSdl);

  // eslint-disable-next-line no-console
  console.log('Target SDL document has been overriden with the formatted SDL.');
} else {
  // eslint-disable-next-line no-console
  console.log(outputSdl);
}
