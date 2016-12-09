import { Midata } from './Midata';
import { Promise } from 'es6-promise';
import * as util from './util';
import { BodyWeight } from './resources';


describe('Midata', () => {

    var midata;

    beforeEach(() => {
        midata = new Midata(
            'https://test.midata.coop:9000',
            'testapp',
            'mysecret'
        );
    });

    describe('with valid credentials', () => {

        // beforeEach(() => {
        //     util.apiCall = jasmine.createSpy().and.callFake(() => {
        //         return Promise.resolve({
        //             message: 'Request ok',
        //             body: {
        //                 authToken: '1234',
        //                 refreshToken: 'asdf'
        //             },
        //             status: 200
        //         });
        //     });
        // });

        var login;

        beforeEach(() => {
            login = midata.login('testuser@testuser.com', 'Testuser123');
        });


        it('#login() should return the auth and refresh token', (done) => {
            login.then(response => {
                expect(response.authToken).toBeDefined();
                expect(response.refreshToken).toBeDefined();
                done();
            });
        });

        it('#login() should set the auth and refresh token', (done) => {
            expect(midata.authToken).toBeUndefined();
            expect(midata.refreshToken).toBeUndefined();

            login.then((response) => {
                expect(midata.authToken).toBeDefined();
                expect(midata.refreshToken).toBeDefined();
                done();
            });
        });

        it('#login() should set user property', (done) => {
            expect(midata.user).toBeUndefined();

            login.then((response) => {
                expect(midata.user).toEqual({name: 'testuser@testuser.com'});
                done();
            })
            .catch(() => {
                done();
            });
        });

        it('#loggedIn should be true when the user is logged in', (done) => {
            expect(midata.loggedIn).toBe(false);

            login.then((response) => {
                expect(midata.loggedIn).toBe(true);
                done();
            });
        });

        it('#logout() should reset the state', () => {
            login
            .then(() => {
                midata.logout();
                expect(midata.user).toBeUndefined();
                expect(midata.refreshToken).toBeUndefined();
                expect(midata.authToken).toBeUndefined();
                done();
            });
        });

        it('#save() should create a resource given a FHIR object', (done) => {
            let resource = {
                resourceType: 'Observation',
                status: 'final',
                code: {
                    coding: [{
                        system: 'http://loinc.org',
                        code: '3141-9',
                        display: 'Weight Measured'
                    }]
                },
                effectiveDateTime: '2016-01-01',
                valueQuantity: {
                    value: 75,
                    unit: 'kg'
                }
            };

            login.then(() => {
                return midata.save(resource);
            })
            .then((res) => {
                done();
            });
        });


        it('#save() return a rejected promise if the resource can\'t be created', (done) => {
            let resource = {
                resourceType: 'Observation',
            };

            login.then(() => {
                return midata.save(resource);
            })
            .catch(err => {
                done();
            });
        });


        it(`#save() when passed a resource object it
            should automatically convert it to FHIR`, (done) => {

            let bw = new BodyWeight(72, new Date());

            login
            .then(() => {
                return midata.save(bw);
            })
            .then(() => {
                done();
            });
        });

    });


    describe('with invalid credentials', () => {

        // beforeEach(() => {
        //     util.apiCall = jasmine.createSpy().and.callFake(() => {
        //         return Promise.reject({
        //             message: '',
        //             body: 'Wrong username or password',
        //             status: 404
        //         });
        //     });
        // });
        var login;

        beforeEach(() => {
            login = midata.login('testuser@testuser.com', 'WRONG PASSWORD');
        });


        it('#login() should return a rejected promise containing the error message', (done) => {
            login
            .catch((error) => {
                done();
            });
        });

    });

});
