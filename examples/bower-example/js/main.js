// Construct the Midata service object
var md = new midata.Midata('https://test.midata.coop:9000', 'testapp', 'mysecret');

// Create a resource
var resource = new midata.BodyWeight(23, new Date());

// Login and subsequently try to save the resource on the server
md.login('testuser@testuser.com', 'Testuser123')
.then(() => {
    md.save(resource).then(response => {
        console.log(response);
    });

    // Search for resources
    md.search('Observation', {
        code: "http://loinc.org|6690-2"
    }).then(function(resources) {
        console.log('Got resources: ', resources);
    });
});

