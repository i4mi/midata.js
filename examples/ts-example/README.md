TypeScript Example Project
==========================

A very small project to show how the MIDATA.js package can be consumed from
TypeScript together with NPM.

The package is listed as a dependency in `package.json`. It was added there
automatically by executing the command

    $ npm install https://github.com/i4mi/midata.js#v1.1 --save

The project can be built with webpack by simply doing the following:

    $ webpack

This will compile `src/index.ts` and all therein imported modules to the bundle
`dist/bundle.js`.
