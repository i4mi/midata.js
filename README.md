MIDATA.js
=========

Installation
------------

There are some examples on how to install and use the library in different setups (bower, es6, typescript) in the `examples` directory. TLDR:

### bower

Install the library

    $ bower install i4mi/midata.js#v1.3  --save

Include it in your index.html:

    <!-- Include the library from your bower components directory, i.e. 'lib' or -->
    <!-- 'bower_components' or whatver your .bowerrc file specifies. -->
    <script src="lib/midata.js/dist/midata.js"></script>

### npm

    $ npm install https://github.com/i4mi/midata.js#v1.3  --save

Usage
-----

The following example assumes you installed the library via bower.

    var md = new midata.Midata(
        'https://test.midata.coop:9000', 'my_app_name', 'my_app_secret');

    // Login
    md.login('user@example.com', 'my_password')
    .then(function() {
        console.log('Logged in!');
        console.log('User id:', md.user.id);
    });

    // Create a FHIR resource with a simplified constructor
    var weight = new midata.BodyWeight(72, new Date());

    md.save(weight)
    .then(function() {
        console.log('Resource created!');
    });

    // Or, alternatively, create a FHIR resource with a JS object
    var weight = {
        resourceType: 'Observation',
        code: {
            coding: [{
                system: 'http://loinc.org',
                code: '3141-9',
                display: 'Weight Measured'
            }]
        },
        effectiveDateTime: '2016-01-01',
        valueQuantity: {
            value: 72,
            unit: 'kg',
            system: 'http://unitsofmeasure.org'
        }
    };

    // Save the resource
    md.save(weight)
    .then(function() {
        console.log('Resource created!');
    })
    .catch(function(error) {
        console.log('There was an error!', error)
    });

    // Search for resources
    md.search('Observation', {
        code: "http://loinc.org|6690-2"
    }).then(function(resources) {
        console.log('Got resources: ', resources);
    });


Development
-----------

### Initial setup

    $ npm install

### Build

With autocompile:

    $ npm run dev

Autorun tests:

    $ npm run test

Build for production in the `dist` directory.

    $ npm run build
