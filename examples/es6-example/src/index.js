import {
    Midata,
    HeartRate
} from 'midata';

// Construct the Midata service object
let midata = new Midata('https://test.midata.coop:9000', 'testapp', 'mysecret');

// Create a resource
let resource = new HeartRate(23, new Date());

// Login and subsequently try to save the resource on the server
midata.login('testuser@testuser.com', 'Testuser123')
.then(() => {
    midata.save(resource).then(response => {
        console.log(response);
    });
});
