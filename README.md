MIDATA.js
=========

2017 - Bern University of Applied Sciences - Institute for Medical Informatics (I4MI)

A collection of utility classes and functions to interact with the MIDATA.coop platform.

**Installation**
---
**1.** Register your application in the midata developer backend (see[here](https://test.midata.coop/#/developer/guide "MIDATA Developer Guide")).

**Important**: Use `http://localhost/callback` as the target redirect URI.

**2.** Create your IONIC project using the command `ionic start %YOUR_PROJECTNAME% blank` where `%YOUR_PROJECTNAME%` is the name of your IONIC project. 

**3.** Install the library

**npm**

`$ npm install https://github.com/i4mi/midata.js --save`

**bower** 

`$ bower install midata.js --save`

For details on how to use the library have a look at the[Wiki](https://github.com/i4mi/midata.js/wiki/Usage-(IONIC-2) "MIDATA.js Wiki")

##For Developers


**Initial setup**
---
    $ npm install

**Build**
--

With autocompile:

    $ npm run dev

Autorun tests:

    $ npm run test

Build for production in the `dist` directory.

    $ npm run build
