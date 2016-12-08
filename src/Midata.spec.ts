import { Midata } from './Midata';
import { Promise } from 'es6-promise';
import * as util from './util';
import { BodyWeight } from './resources';


describe('Midata', () => {

    var midata;

    beforeEach(() => {
        midata = new Midata(
            'https://test.midata.coop:9000',
            'app',
            'seceretxyz'
        );
    });

    describe('with valid credentials', () => {

        beforeEach(() => {
            util.apiCall = jasmine.createSpy().and.callFake(() => {
                return Promise.resolve({
                    message: 'Request ok',
                    body: {
                        authToken: '1234',
                        refreshToken: 'asdf'
                    },
                    status: 200
                });
            });
        });

        it('#login() should return the auth and refresh token', (done) => {
            midata.login('testuser', '123')
            .then(response => {
                expect(response.authToken).toBe('1234');
                expect(response.refreshToken).toBe('asdf');
                done();
            });
        });

        it('#login() should set the auth and refresh token', (done) => {
            expect(midata.authToken).toBeUndefined();
            expect(midata.refreshToken).toBeUndefined();

            midata.login('testuser', '123')
            .then((response) => {
                expect(midata.authToken).toBe('1234');
                expect(midata.refreshToken).toBe('asdf');
                done();
            })
            .catch(() => {
                done();
            });
        });

        it('#login() should set user property', (done) => {
            expect(midata.user).toBeUndefined();

            midata.login('testuser', '123')
            .then((response) => {
                expect(midata.user).toEqual({name: 'testuser'});
                done();
            })
            .catch(() => {
                done();
            });
        });

        it('#loggedIn should be true when the user is logged in', (done) => {
            expect(midata.loggedIn).toBe(false);

            midata.login('testuser', '123')
            .then((response) => {
                expect(midata.loggedIn).toBe(true);
                done();
            })
            .catch(() => {
                done();
            });
        });

        it('#save() should create a resource', (done) => {
            let resource = {
                resourceType: 'Observation',
                status: 'final',
                code: {
                    'text': 'Body Weight'
                },
                effectiveDateTime: '2016-01-01',
                value: {
                    valueQuantity: {
                        value: 75,
                        unit: 'kg'
                    }
                }
            };

            midata.login('testuser', '123')
            .then(() => {
                return midata.save(resource);
            })
            .then((res) => {
                expect(res.id) == 1;
                done();
            })
            .catch((err) => {
                done();
            });
        });

        // it(`#save() when passed a resource object it
        //     should automatically convert it to FHIR`, (done) => {

        //     let bw = new BodyWeight(72, new Date());
        //     spyOn(bw, 'toJson');

        //     midata.login('testuser', '123')
        //     .then(() => {
        //         return midata.save(bw);
        //     })
        //     .then(() => {
        //         expect(bw.toJson).toHaveBeenCalled();
        //         done();
        //     })
        //     .catch(err => {
        //         // console.log(err);
        //     });
        // });

    });


    describe('with invalid credentials', () => {

        beforeEach(() => {
            util.apiCall = jasmine.createSpy().and.callFake(() => {
                return Promise.reject({
                    message: '',
                    body: 'Wrong username or password',
                    status: 404
                });
            });
        });

        it('#login() should return a rejected promise containing the error message', (done) => {
            midata.login('testuser', '123')
            .catch((error) => {
                expect(error).toMatch(/Wrong/);
                done();
            });
        });

    });


    it('#logout() should reset the state', () => {
        midata.login('testuser', '123')
        .then(() => {
            midata.logout();
            expect(midata.user).toBeUndefined();
            expect(midata.refreshToken).toBeUndefined();
            expect(midata.authToken).toBeUndefined();
            done();
        });
    });

});
