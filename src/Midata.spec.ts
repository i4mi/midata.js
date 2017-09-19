import { Midata } from './Midata';
import {BodyWeight} from "./resources/BodyWeight";
import {Observation} from "./resources/Observation";
import {Promise} from "es6-promise";
import {TokenResponse} from "./api";
import * as util from './util';
import {Patient} from "./resources/Patient";
import {fromFhir} from "./resources/registry";
import {Resource} from "./resources/Resource";
import {MappingError} from "./errors/MappingError";
import {UnknownEndpointError} from "./errors/UnknownEndpointError";
import {InvalidCallError} from "./errors/InvalidCallError";
import {MidataJSError} from "./errors/MidataJSError";

const USERNAME = "%USERNAME%";
const VALID_PASSWORD = "%PASSWORD%";
const INVALID_PASSWORD = "WRONG_PASSWORD";

describe('Midata', () => {

    var midata;

    function createMidataObject() {
        return new Midata(
            'https://test.midata.coop',
            'oauth2test',
            'secret'
        );
    }

    beforeEach(() => {
        midata = createMidataObject();
    });

    var login;

    beforeEach(() => {
        login = midata.login(USERNAME, VALID_PASSWORD);
    });

    describe('with valid credentials', () => {

        it('the response after login() should contain all the properties defined in type AuthResponse', (done) => {

            login.then(response => {
                expect(response.authToken).toBeDefined();
                expect(response.refreshToken).toBeDefined();
                expect(response.status).toBeDefined();
                expect(response.owner).toBeDefined();
                done();
            });
        });

        it('login() should set the auth and refresh token', (done) => {
            expect(midata.authToken).toBeUndefined();
            expect(midata.refreshToken).toBeUndefined();

            login.then(() => {
                expect(midata.authToken).toBeDefined();
                expect(midata.refreshToken).toBeDefined();
                done();
            }).catch((err) => {
                fail(err);
            });
        });

        it('login() should set user property', (done) => {
            expect(midata.user).toBeUndefined();
            login.then(() => {
                expect(midata.user).toEqual(jasmine.objectContaining({name: USERNAME}));
                expect(midata.user).toEqual(jasmine.objectContaining({email: USERNAME}));
                expect(midata.user.id).toBeDefined();
                done();
            })
                .catch((err) => {
                    fail(err);
                });
        });

        it('loggedIn() should return true when the user is logged in', (done) => {
            expect(midata.loggedIn).toBe(false);

            login.then(() => {
                expect(midata.loggedIn).toBe(true);
                done();
            })
                .catch((err) => {
                    fail(err);
                });
        });

        it('logout() should reset the state', () => {
            midata.logout();
            expect(midata.user).toBeUndefined();
            expect(midata.refreshToken).toBeUndefined();
            expect(midata.authToken).toBeUndefined();
        });


        it('save() should create a resource given a FHIR object', (done) => {
            let resource = {
                resourceType: "Observation",
                status: "preliminary",
                category: [
                    {
                        coding: [
                            {
                                system: "http://hl7.org/fhir/observation-category",
                                code: "vital-signs",
                                display: "Vital Signs"
                            }
                        ],
                        text: "Vital Signs"
                    }
                ],
                code: {
                    coding: [
                        {
                            system: "http://loinc.org",
                            code: "29463-7",
                            display: "Body weight"
                        }
                    ]
                },
                effectiveDateTime: "2017-08-30T13:15:43.461Z",
                valueQuantity: {
                    value: 555,
                    unit: "kg",
                    system: "http://unitsofmeasure.org",
                    code: "kg"
                }
            };


            login
                .then(() => {
                    return midata.save(resource);
                })
                .then((response) => {
                    expect(response).toBeDefined();
                    expect(response._fhir).toBeDefined();
                    done();
                }).catch((err) => {
                fail(err);
                done()
                });
        });
    //
    //     /*
    //     This test is working. However, it creates the following expected exception on MIDATA everytime it's excecuted:
    //      utils.exceptions.BadRequestException: Neither code nor content-type available for record.
    //      */
    //
    //     // it('save() should return a rejected promise if the resource can\'t be created', (done) => {
    //     //     // invalid object structure
    //     //     let resource = {
    //     //         resourceType: 'Observation',
    //     //     };
    //     //
    //     //     login
    //     //         .then(() => {
    //     //             midata.save(resource).then((response) => {
    //     //
    //     //             })
    //     //                 .catch(() => {
    //     //                     done();
    //     //                 });
    //     //         });
    //     // });
    //
        it(`after save() the method should automatically convert the returned resource from MIDATA back into it's original type`, (done) => {

            let bw = new BodyWeight(72, new Date());
            login
                .then(() => {
                return midata.save(bw);
              }).then((response) => {
                expect(response).toEqual(jasmine.any(Resource));
                expect(response).toEqual(jasmine.any(BodyWeight));
                done();
            });
        });
    });

    describe('if the mapping of a resource fails', () => {
        beforeEach(() => {
            login.then(() => {
                spyOn(util, "apiCall").and.callFake(() => {
                    // Mocking a successful response holding a invalid resource object within the body
                    return Promise.resolve({
                        status: 200,
                        body: {
                            mock: "mock value"
                        },
                        message: "Request successful"
                    });
                });
            });
        });

        it('a custom Error of type \'MappingError\' should be thrown', (done) => {
            login
                .then(() => {
                    let bw = new BodyWeight(82.5, new Date());
                    return midata.save(bw);
            })
                .then(() => {
                // not called
                fail();
            }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(MappingError));
                done();
            })
        });
    });

    describe('method search()', () => {

        it('with parameter \'Observation\' should return all observation entries', (done) => {
            login
                .then(() => {
                    return midata.search("Observation");
                })
                .then((response: Resource[]) => {
                    for (let resource of response) {
                        expect(resource).toEqual(jasmine.any(Observation));
                    }
                    done();
            });
        });


        it('with parameters \'Observation\' and {\'code: \'29463-7\'}\ should only return body weight entries', (done) => {
            login
                .then(() => {
                    return midata.search('Observation', {code: '29463-7'});
                })
                .then((response: Resource[]) => {
                    for (let resource of response) {
                        expect(resource).toEqual(jasmine.any(BodyWeight));
                    }
                    done();
                });
        });
    });

    describe('method refresh()' , () => {

        let tokenPair: [string, string];

        beforeEach(() => {
            // set the token endpoint, normally this is done during authentication
            midata._tokenEndpoint = "https://test.midata.coop/v1/token";
        });

        it('should refresh the tokens', (done) => {
            login.then(() => {
                expect(midata.authToken).toBeDefined();
                expect(midata.refreshToken).toBeDefined();

                tokenPair = [midata._authToken, midata._refreshToken];

            }).then(() => {
                return midata.refresh();
            }).then((response) => {
                expect(midata.authToken).toBeDefined();
                expect(midata.refreshToken).toBeDefined();
                expect(midata.authToken).not.toEqual(tokenPair[0]);
                expect(midata.refreshToken).not.toEqual(tokenPair[1]);

                expect(midata.authToken).toEqual(response.access_token);
                expect(midata.refreshToken).toEqual(response.refresh_token);
                done();
            }).catch((error) => {
                fail();
            });
        });

        afterEach(() => {
            // logout each time this test's been made
            // otherwise, 401 error
            midata.logout();
            tokenPair = undefined;
        });
    });


    describe('with invalid credentials', () => {
        it('login() should return a rejected promise containing an error message', (done) => {
            midata.login(USERNAME, INVALID_PASSWORD)
                .then((response) => {
                    // not called
                    fail();
                }, () => {
                    done();
                });
        });
    });

    describe('before authentication, method authenticate()', () => {
        beforeEach(() => {
            // The test cannot conduct the inAppBrowser process. Therefore, this mock exists.
            spyOn(midata, "authenticate").and.callFake((): Promise<TokenResponse> => {
                midata._authCode = "123456789";
                if (midata._conformanceStatementEndpoint !== undefined){
                    if(this._authEndpoint == undefined || this._tokenEndpoint == undefined) {
                        return midata.fetchFHIRConformanceStatement();
                    }
                }
            });
        });


        it('should fetch and set the auth and token endpoints if they haven\'t been set yet', (done) => {

            expect(midata._tokenEndpoint).toBeUndefined();
            expect(midata._authEndpoint).toBeUndefined();

            midata.authenticate().then(() => {
                expect(midata._tokenEndpoint).toBeDefined();
                expect(midata._authEndpoint).toBeDefined();
                done()
            }).catch((error) => {
                fail()
            })
        })
    });

    describe('during authentication, method authenticate()', () => {
        beforeEach(() => {
            spyOn(midata, "authenticate").and.callFake((): Promise<TokenResponse> => {
                midata._authCode = "123456789";
                return midata._initSessionParams(128);
            });
        });

        it('should make the subsequent methods create the session params', (done) => {

            midata.authenticate()
                .then(() => {
                    expect(midata._state).toBeDefined();
                    expect(midata._codeVerifier).toBeDefined();
                    expect(midata._codeChallenge).toBeDefined();
                    expect(midata._authCode).toBeDefined();
                    done();
                });
        });
    });


    describe('method authenticate() should throw an error of type \'InvalidCallError\'', () => {

        it('if the optional deviceID param contains 3 or less than 3 characters', () => {
            midata.authenticate("abc")
                .then((response) => {
                    // not called
                }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(InvalidCallError));
            })
        });

    });

    describe('method _exchangeTokenForCode()', () => {

        beforeEach(() => {
            // The test cannot conduct the inAppBrowser process. Therefore, this mock exists.
            spyOn(midata, "authenticate").and.callFake((): Promise<TokenResponse> => {
                midata._authCode = "123456789";
                return midata._initSessionParams(128).then(() => {
                    return midata._exchangeTokenForCode();
                })
            });


            spyOn(util, "apiCall").and.callFake(() => {
                // Mocking a successful exchange of the accessCode and the access & refreshToken
                return Promise.resolve({
                    status: "200",
                    body: {
                        access_token: '1234',
                        refresh_token: '5678',
                        expires_in: '21600',
                        scope: 'user/*.*',
                        patient: '123456789',
                        token_type: 'Bearer'
                    },
                    message: "Request successful"
                });
            });

            spyOn(midata, "search").and.callFake(() => {
                // after the exchange, the method fetches the user information from MIDATA. Since "apiCalls" are
                // already being mocked, the search also needs to be mocked in order to ensure the test case.
                let mockPat = new Patient("Doestreet 7", "01.01.2000", "male", "123456789", [
                    {
                        family: [
                            "Doe"
                        ],
                        given: [
                            "John"
                        ]
                    }
                ], [
                    {
                        "system": "email",
                        "value": USERNAME
                    }
                ]);

                let resources: Resource[] = [];

                resources.push(fromFhir(mockPat.toJson()));
                return Promise.resolve(resources); // In order to let it map accordingly
            });
        });

        it('should run through properly and set the login properties on the midata object', (done) => {
            midata.authenticate()
                .then((response) => {
                    expect(midata._authToken).toEqual('1234');
                    expect(midata._refreshToken).toEqual('5678');
                    expect(midata._user).toBeDefined();
                    expect(midata._user.id).toEqual("123456789");
                    done();
                }).catch((error) => {
                fail(error);
            });
        });
    });

    describe('if the midata object is corrupt', () => {
        beforeEach(() => {
            // this should never happen since it's set in the constructor
            midata._conformanceStatementEndpoint = undefined;
            // subsequent method should not be called
            spyOn(midata, '_exchangeTokenForCode');
        });

        it('method authenticate() should throw an exception', (done) => {
            midata.authenticate().catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(UnknownEndpointError));
                expect(midata._exchangeTokenForCode).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('method _retry()', () => {
        beforeEach(() => {

            spyOn(midata,'_search').and.callFake(() => {
                return Promise.reject({
                    status: 401,
                    body: {
                        entry: [{mock: "mockValue"}]
                    },
                    message: "Unauthorized"
                });
            });

            spyOn(midata, 'refresh').and.callFake(() => {
                return Promise.resolve({
                    access_token: "1234",
                    refresh_token: "6789",
                    expires_in: 26200,
                    scope: "user/*.*",
                    patient: "123456789",
                    token_type: "Bearer"
                });
            });

            spyOn(midata, '_retry').and.callThrough();
        });


        it('should retry the same operation three times before it aborts the process ', (done) => {

            login
                .then(() => {
                    return midata.search("Observation");
                })
                .then(() => {
                    // not called
                }).catch((error) => {
                    expect(error).toBeDefined();
                    expect(error).toEqual(jasmine.any(MidataJSError));
                    expect(midata._retry).toHaveBeenCalledTimes(3);
                    done();
            });
        });
    });

    describe('faulty function calls', () => {

        it('should throw specific errors of type \'InvalidFunctionCall\' ', (done) => {

            let faultyLogin =
                midata.login(undefined,"").then(() => {
                // not called
            }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(InvalidCallError));
            });

            let faultySave =
                midata.save(new BodyWeight(82, new Date())).then(() => {
                // not called
            }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(InvalidCallError));
            });

            let faultySearch =
                midata.search("Observation").then(() => {
                // not called
            }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(InvalidCallError));
            });

            let faultySessionParams =
                midata._initSessionParams(undefined).then(() => {
                    // not called
            }).catch((error) => {
                expect(error).toBeDefined();
                expect(error).toEqual(jasmine.any(InvalidCallError));
                })

            Promise.all([faultyLogin, faultySave, faultySearch, faultySessionParams]).then(() => {
                done();
            });
        });
    });
});
