"use strict";
var Midata_1 = require('./Midata');
describe('Midata', function () {
    var midata;
    function createMidataObject() {
        return new Midata_1.Midata('https://test.midata.coop:9000', 'testapp', 'mysecret', "https://test.midata.coop:9000/fhir/metadata");
    }
});
