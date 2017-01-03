ES6 Example Project
==========================

A very small project to show how the MIDATA.js package can be consumed from
ECMAScript6 (i.e. the "next JavaScript") together with NPM.

The package is listed as a dependency in `package.json`. It was added there
automatically by executing the command

    $ npm install https://github.com/i4mi/midata.js --save

The project can be built with webpack by simply doing the following:

    $ webpack  # or npm run dev

This will compile `src/index.js` and all therein imported modules to the bundle
`dist/index.js`.
