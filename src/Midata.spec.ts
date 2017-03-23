import { Midata } from './Midata';
import { Promise } from 'es6-promise';
import * as util from './util';
import { BodyWeight } from './resources';


describe('Midata', () => {

    var midata;

    function createMidataObject() {
        return new Midata(
            'https://test.midata.coop:9000',
            'testapp',
            'mysecret',
            "https://test.midata.coop:9000/fhir/metadata"
        );
    }




