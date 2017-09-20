import {
    TokenRefreshResponse,
    TokenRequest,
    TokenResponse,
    AuthRequest,
    AuthResponse,
    UserRole
} from './api';
import {MidataJSError} from './errors/MidataJSError';
import {MappingError} from './errors/MappingError';
import {UnknownEndpointError} from './errors/UnknownEndpointError';
import {InvalidCallError} from './errors/InvalidCallError';
import {Promise} from 'es6-promise'
import {apiCall, ApiCallResponse, base64EncodeURL} from './util';
import {InAppBrowser} from 'ionic-native';
import {URLSearchParams} from "@angular/http";
import {fromFhir} from "./resources/registry";
import {Resource} from "./resources/Resource";

let jsSHA = require("jssha");

/*
The user
 */
export interface User {
    name?: string;
    id?: string;
    email?: string;
    language?: language
}

/*
Languages currently supported by MIDATA
 */
export type language =
    'en' |
    'de' |
    'it' |
    'fr';

export class Midata {

    private _authToken: string;
    private _refreshToken: string;
    private _authCode: string;
    private _tokenEndpoint: string;
    private _authEndpoint: string;
    private _user: User;
    private _iab: InAppBrowser;


    private _state: string;
    private _codeVerifier: string;
    private _codeChallenge: string;

    /**
     *
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:443".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     *
     */
    constructor(private _host: string,
                private _appName: string,
                private _secret?: string,
                private _conformanceStatementEndpoint?: string) {
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint || `${_host}/fhir/metadata`;
    }

    /*
     If the user is logged in already.
     */
    get loggedIn() {
        return this._authToken !== undefined;
    }

    /*
     The currently used authentication token. If the user didn't login yet
     or recently called `logout()` this property will be undefined.
     */
    get authToken() {
        return this._authToken;
    }

    /*
     The currently used refresh token. If the user didn't login yet
     or recently called `logout()` this property will be undefined.
     */
    get refreshToken() {
        return this._refreshToken;
    }

    /*
     The current user as created upon execution of login() or authenticate(). If no user is set,
     this property will be undefined.
     */
    get user() {
        return this._user;
    }

    /*
     Set the current user's email address.
     */
    setUserEmail(email: string) {
        if (this._user) {
            this._user.email = email;
        }
        else {
            let user: User = {
                email: email
            }
            this._user = user;
        }
    }

    /*
     Set the current user's language.
     */
    setUserLanguage(language: language) {
        if (this._user) {
            this._user.language = language
        } else {
            let user: User = {
                language: language
            }
            this._user = user;
        }
    }

    /*
    Update the host and if needed the conformanceStatementEndpoint if the target server changes.
    Changing the target server will force a logout since this should only be done if no connection exists.
     */
    changePlatform(host: string, conformanceStatementEndpoint?: string){
        this._host = host;
        if(conformanceStatementEndpoint){
            this._conformanceStatementEndpoint = conformanceStatementEndpoint;
        } else {
            this._conformanceStatementEndpoint = `${this._host}/fhir/metadata`;
        }
        this.logout();
    }

    /*
     Destroy all authentication information.
     */
    logout() {
        this._refreshToken = undefined;
        this._authToken = undefined;
        this._state = undefined;
        this._codeVerifier = undefined;
        this._codeChallenge = undefined;
        this._user = undefined;
    }

    /*
     Set login-specific properties. This method should be called either during
     startup or when the login method is called explicitly.
     */
    private _setLoginData(authToken: string, refreshToken: string, user?: User) {
        this._authToken = authToken;
        this._refreshToken = refreshToken;
        if(user){
        this._user = user;
        }
    }

    /**
     *
     * Login to the MIDATA platform. This method has to be called prior to
     * creating or updating resources.
     *
     * @deprecated only use this method if your app does not support oAuth2 authentication
     * @param username The user's identifier, most likely an email address
     * @param password The user's password
     * @param role The user's role used during the login (optional)
     * @return Promise<AuthResponse>
     *
     */
    login(username: string, password: string, role?: UserRole): Promise<AuthResponse> {

        if (username === undefined || password === undefined) {
            return Promise.reject(new InvalidCallError('You need to supply a username and a password!'));
        }
        let authRequest: AuthRequest = {
            username: username,
            password: password,
            appname: this._appName,
            secret: this._secret
        };
        if (role !== undefined) {
            authRequest.role = role;
        }

        let authResponse: AuthResponse;

        let loginMidata = (): Promise<AuthResponse> => {
            return apiCall({
                url: this._host + '/v1/auth',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                jsonBody: true,
                payload: authRequest
            }).then((response: ApiCallResponse) => {
                authResponse = response.body;
                let user: User
                if (this._user) {
                    this._user.id = authResponse.owner;
                    this._user.name = username;
                } else {
                    user = {
                        id: authResponse.owner,
                        name: username
                    };
                }
                this._setLoginData(authResponse.authToken, authResponse.refreshToken, user);
                return Promise.resolve(authResponse);
            });
        };

        let fetchUserInfo = (): Promise<Resource[]> => {
            return this.search("Patient", {_id: this.user.id}).then((response: Resource[]) => {
                this.setUserEmail(response[0].getProperty("telecom")[0].value);
                return Promise.resolve(response);
            })
        };

        return loginMidata()
        .then(() => {
            return fetchUserInfo();
        }).then(() => {
            return Promise.resolve(authResponse);
        }).catch((error) => {
            return Promise.reject(error);
            });
    };

    /**
     *
     * This method stores a resource onto midata.
     *
     * @param resourceType The resource to be stored (e.g. HeartRate)
     * @return Promise<Resource>
     *
     */
    save(resource: Resource | any) : Promise<Resource> {
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            return Promise.reject(new InvalidCallError('`Can\'t create records when no user logged in first. Call authenticate() before trying to create records.`'));
        }
        // Convert the resource to a FHIR-structured simple js object.
        let fhirObject: any;
        if (resource instanceof Resource) {
            fhirObject = resource.toJson();
        } else {
            fhirObject = resource;
        }// If the resource didn't have an id, then the resource has to be
        // created on the server.
        let shouldCreate = fhirObject.id === undefined || fhirObject.resourceType === "Bundle"; // By default
        // a bundle holds an id upon creation. Therefore, additionally check for resource type
        let apiMethod = shouldCreate ? this._create : this._update;

        let tryToMapResponse = (response: ApiCallResponse) : Resource => {
            // When the resource is created, the same resource will
            // be returned (populated with an id field in case it was newly created).
            if (response.status === 201 || response.status === 200) { // POST, PUT == 201, GET == 200
                try {
                    response.body = fromFhir(JSON.parse(response.body));
                    return response.body;
                } catch (mappingError) {
                    // Although storing the value onto Midata priorly succeeded, rejecting the promise
                    // at this point is fine since the response itself
                    // violates FHIR's Resource record structure.
                    throw new MappingError();
                }
            } else {
                throw new MidataJSError(`Unexpected response status code: ${response.status}`);
            }
        };

        return apiMethod(fhirObject)
            .then((response: ApiCallResponse) => {
                try {
                    return Promise.resolve(tryToMapResponse(response));
                } catch(error) {
                    // Catch and re-throw the error
                    return Promise.reject(error);
                }
            }, (error: ApiCallResponse) => {
                    // Check if the authToken is expired and a refreshToken is available
                    if(error.status === 401 && this.refreshToken) {
                        return this.refresh().then(() => {
                            // If the refresh operation succeeded,
                            // retry the operation 3 times
                            return this._retry(3, apiMethod, fhirObject).then((response : ApiCallResponse) => {
                                try {
                                    return Promise.resolve(tryToMapResponse(response));
                                } catch(error) {
                                    // Catch and re-throw the error
                                    return Promise.reject(error);
                                }
                            }).catch((error) => {
                                // Reject promise with error thrown within retry function
                                return Promise.reject(error);
                            })
                        }, (error) => {
                        // Refreshing of token failed. Reject
                        return Promise.reject(error);
                        })
                    } else {
                        // No 401 error or refreshToken not available. Reject and let the client handle...
                        return Promise.reject(error);
                    }
                });
    };

    /**
     *
     Helper method in order to retry a specific operation (e.g. save or search) on the API.
     *
     * @param maxRetries How many times the method should retry the operation before aborting
     * @param fn The callback function to be executed
     * @param args? Optional additional arguments that should be passed into the callback function
     * @return Promise<ApiCallResponse>
     *
     */
    private _retry(maxRetries: number, fn: any, ...args: any[]) : Promise<ApiCallResponse> {
            // Apply is very similar to call(), except for the type of arguments it supports.
            // You use an arguments array instead of a list of arguments (p1,p2,p3,...).
            // Thus, you do not have to know the arguments of the called object when you use
            // the apply method. The called object is then responsible for handling the arguments.
            return fn.apply(this, args).catch((error: any) => {
                if(maxRetries <= 1){
                    throw new MidataJSError("Maximum retries exceeded, abort!");
                }
                return this._retry(maxRetries - 1, fn, ...args);
            })
         };

    /**
     *
     Helper method to create FHIR resources via a HTTP POST call.
     *
     */
    private _create = (fhirObject: any) : Promise<ApiCallResponse> => {

        let url: string; // for convenience

        if (fhirObject.resourceType === "Bundle") {
            url = `${this._host}/fhir`;
        } else {
            url = `${this._host}/fhir/${fhirObject.resourceType}`;
        }

        return apiCall({
            jsonBody: false,  // needs to be false since no json is returned
            url: url,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8',
                'Prefer': 'return=representation'
            },
            payload: fhirObject
        });
    };

    /**
     *
     Helper method to create FHIR resources via a HTTP PUT call.
     *
     */
    private _update = (fhirObject: any) : Promise<ApiCallResponse> => {
        let url = `${this._host}/fhir/${fhirObject.resourceType}/${fhirObject.id}`;
        return apiCall({
            jsonBody: false,
            url: url,
            payload: fhirObject,
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8',
                'Prefer': 'return=representation'
            },
            method: 'PUT'
        });
    };

    /**
     *
     Tries to refresh the authentication token by authorizing with the help of the refresh token.
     This will generate a new authentication as well as a new refresh token. On successful refresh,
     the old refresh_token will be invalid and both the access_token and the refresh_token will be overwritten.
     Previous access_tokens will remain valid until their expiration timestamp is exceeded.
     *
     @param withRefreshToken? Optional refresh token coming from an external source e.g. the phone's secure storage
     @return Promise<TokenRefreshResponse>
     *
     */
    refresh(withRefreshToken?: string) : Promise<TokenRefreshResponse> {

            let tokenRefreshResponse: TokenRefreshResponse;

            let fetchConformanceStatement = () : Promise<Resource> =>  {
                if (this._conformanceStatementEndpoint !== undefined) {
                    if(this._tokenEndpoint == undefined) {
                     return this.fetchFHIRConformanceStatement().then((response) => {
                           return Promise.resolve(response);
                     });
                  } else {
                       return Promise.resolve({});
                    }
             } else {
                   return Promise.reject(new UnknownEndpointError());
                }
             };

            let getPayload = () : TokenRequest => {
                let urlParams = new URLSearchParams();
                urlParams.append("grant_type", "refresh_token");
                if (withRefreshToken) {
                    urlParams.append("refresh_token", withRefreshToken);
                } else {
                    urlParams.append("refresh_token", this._refreshToken);
                }
                let refreshRequest: TokenRequest = {
                    encodedParams: urlParams
                };

                return refreshRequest;
            };

            let refreshToken = (fn: any, withRefreshToken?: string) : Promise<TokenRefreshResponse> => {
                return apiCall({
                    url: this._tokenEndpoint,
                    method: 'POST',
                    payload: fn(withRefreshToken).encodedParams.toString(),
                    jsonBody: true,
                    jsonEncoded: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then((response : ApiCallResponse) => {
                        tokenRefreshResponse = response.body;
                        let user: User
                        if (this._user) {
                            this._user.id = tokenRefreshResponse.patient;
                        } else {
                            user = {
                                id: tokenRefreshResponse.patient,
                            };
                        }
                        this._setLoginData(tokenRefreshResponse.access_token, tokenRefreshResponse.refresh_token, user);
                        return Promise.resolve(response);
                    }).catch((error) => {
                        return Promise.reject(error);
                    });
            };

            let fetchUserInfo = () : Promise<Resource[]>  => {
            return this.search("Patient", {_id: this.user.id}).then((response: Resource[]) => {
                this.setUserEmail(response[0].getProperty("telecom")[0].value);
                return Promise.resolve(response);
                }).catch((error) => {
                return Promise.reject(error);
            })
            };

            return fetchConformanceStatement().then(() => {
                return refreshToken(getPayload, withRefreshToken);
            }).then(() => {
                return fetchUserInfo();
            }).then(() => {
                return Promise.resolve(tokenRefreshResponse);
            }).catch((error) => {
                return Promise.reject(error);
            });
    };


    /**
     *
     * Query the midata API using FHIR resource types and optional params.
     *
     * @param resourceType The resource to be searched (e.g. Observation)
     * @param params Parameters refining the search call (e.g. {status: 'preliminary'})
     * @return Promise<Resource[]>
     *
     */
    search(resourceType: string, params: any = {}) : Promise<Resource[]> {
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            return Promise.reject(new InvalidCallError(`Can\'t search for records when no user logged in first. Call authenticate() before trying to query the API.`));
        }

        let baseUrl = `${this._host}/fhir/${resourceType}`;

        let tryToMapResponse = (response: ApiCallResponse) : Promise<Resource[]> => {
            if (response.status === 200) { // GET == 200
                if (response.body.entry != undefined){
                try {
                    let mappedResponse: Resource[] = response.body.entry.map((e: any) => {
                        return fromFhir(e.resource);
                    });
                    return Promise.resolve(mappedResponse)
                } catch (mappingError){
                    // FHIR's Resource record structure's been violated, throw error
                    throw new MappingError();
                }
                } else {
                    // No entries found...
                    let entries: Resource[] = [];
                    return Promise.resolve(entries);
                }
            } else {
                throw new MidataJSError(`Unexpected response status code: ${response.status}`);
            }
        };

        return this._search(baseUrl, params)
            .then((response: ApiCallResponse) => {
            try {
                return Promise.resolve(tryToMapResponse(response));
            } catch (error) {
                // Catch and re-throw the error
                return Promise.reject(error);
            }
        }, (error: ApiCallResponse) => {
            // Check if the authToken is expired and a refreshToken is available
            if(error.status === 401 && this.refreshToken) {
                return this.refresh().then(() => {
                    // If the refresh operation succeeded,
                    // retry the operation 3 times
                    return this._retry(3, this._search, baseUrl, params).then((response : ApiCallResponse) => {
                        try {
                            return Promise.resolve(tryToMapResponse(response));
                        } catch(error) {
                            // Catch and re-throw the error.
                            return Promise.reject(error);
                        }
                    }).catch((error) => {
                        // Reject promise with error thrown within retry function
                        return Promise.reject(error);
                    })
                }, (error) => {
                    // Refreshing of token failed. Reject
                    return Promise.reject(error);
                })
            } else {
                // No 401 error or refreshToken not available. Reject and let the client handle...
                return Promise.reject(error);
            }
        })
    };


    /**
     Helper method to query the FHIR API.
     * @param baseUrl for target API Call (e.g. Observation)
     * @param params e.g. {code: '29463-7'} for BodyWeight
     * @return Promise<ApiCallResponse>
     */

    private _search(baseUrl: string, params: any = {}) : Promise<ApiCallResponse> {
        let queryParts = Object.keys(params).map(key => {
            return key + '=' + params[key]
        });
        let query = queryParts.join('&');
        // if 'query' is defined, preset a question mark,
        // otherwise create an empty string...
        query = query && `?${query}` || '';
        let url = baseUrl + query;

        return apiCall({
            url: url,
            method: 'GET',
            jsonBody: true,
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8'
            }
        });
    }

    /**
     Login to the MIDATA platform. This method has to be called prior to
     creating or updating resources. Calling authenticate will initiate the
     oAuth2 authentication process.

     @param withDeviceID Optional parameter to allocate previously granted consents on the platform to this device.
     @return Promise<TokenResponse>
     **/

     authenticate(withDeviceID?: string): Promise<TokenResponse> {

         if(withDeviceID){
             if(withDeviceID.length <= 3){
             return Promise.reject(new InvalidCallError("Device ID must be longer than 3 characters"));
             }
         }

        let fetchConformanceStatement = () : Promise<Resource> =>  {
            if (this._conformanceStatementEndpoint !== undefined) {
                if(this._authEndpoint == undefined || this._tokenEndpoint == undefined) {
                    return this.fetchFHIRConformanceStatement().then((response) => {
                        return Promise.resolve(response);
                    });
                } else {
                    return Promise.resolve({});
                }
            } else {
                return Promise.reject(new UnknownEndpointError());
            }
        };

         let loginMidata = (url: string) : Promise<void> => {

             return new Promise<void>((resolve,reject) => {

             this._iab = new InAppBrowser(url, '_blank', 'location=yes');
             this._iab.on('loadstart').subscribe((event) => {
                     this._iab.show();
                     if ((event.url).indexOf("http://localhost/callback") === 0) {
                         let _state = event.url.split("&")[0].split("=")[1];
                         if (_state && _state === this._state) {
                             this._authCode = event.url.split("&")[1].split("=")[1];
                             this._iab.close();
                             resolve();
                         } else {
                             this._iab.close();
                             reject();
                         }
                     }
                 },
                 () => {
                 reject();
             });

             this._iab.on('exit').subscribe(() => {
                 reject();
             });

             });
         };
                 return fetchConformanceStatement()
                 .then(() => {
                     return this._initSessionParams(128)
                 }).then(() => {
                     let url = `
                     ${this._authEndpoint}?response_type=code` +
                         `&client_id=${this._appName}` +
                         `&redirect_uri=http://localhost/callback` +
                         `&aud=${this._host}%2Ffhir` +
                         `&scope=user%2F*.*` +
                         `&state=${this._state}` +
                         `&code_challenge=${this._codeChallenge}` +
                         `&code_challenge_method=S256`;
                     if (typeof this._user != "undefined" && typeof this._user.email != "undefined") {
                         url = `${url}&email=${this._user.email}`}
                     if (typeof this._user != "undefined" && typeof this._user.language != "undefined") {
                         url = `${url}&language=${this._user.language}`
                     }
                     if (withDeviceID) {
                         url = `${url}&device_id=${withDeviceID}`
                     }
                     return loginMidata(url);
                 }).then(() => {
                     return this._exchangeTokenForCode();
                 }).then((authResponse: TokenResponse) => {
                     return Promise.resolve(authResponse);
                 }).catch((error) => {
                     return Promise.reject(error);
                 });
    };


    /**
     After successful authentication on midata this method is invoked. It exchanges the authCode
     obtained from midata with the access_token used to query the FHIR endpoint API.

     @return Promise<TokenResponse>
     **/

    private _exchangeTokenForCode(): Promise<TokenResponse> {
            let getPayload = () : TokenRequest => {
                // because of x-www-form-urlencoded
                let urlParams = new URLSearchParams();
                urlParams.append("grant_type", "authorization_code");
                urlParams.append("code", this._authCode);
                urlParams.append("redirect_uri", "http://localhost/callback");
                urlParams.append("client_id", this._appName);
                urlParams.append("code_verifier", this._codeVerifier);

                let refreshRequest: TokenRequest = {
                    encodedParams: urlParams
                };
                return refreshRequest;
            };

            let authResponse : TokenResponse;

            let exchangeToken = () : Promise<ApiCallResponse> => {
                 return apiCall({
                     url: this._tokenEndpoint,
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                     },
                     jsonBody: true,
                     payload: getPayload().encodedParams.toString(),
                     jsonEncoded: false
                 })
                     .then((response: ApiCallResponse) => {
                         authResponse = response.body;
                         let user: User
                         if (this._user) {
                             this._user.id = authResponse.patient;
                         } else {
                             user = {
                                 id: authResponse.patient, // TODO: Fetch and set username from response
                             };
                         }
                         this._setLoginData(authResponse.access_token, authResponse.refresh_token, user);
                         return Promise.resolve(response);
                     }).catch((error) => {
                     return Promise.reject(error);
                 });
             };

            var fetchUserInfo = () : Promise<Resource[]> => {
                return this.search("Patient", {_id: this.user.id}).then((response: Resource[]) => {
                    this.setUserEmail(response[0].getProperty("telecom")[0].value);
                    return Promise.resolve(response);
                });
            };

            return exchangeToken().then(() => {
                return fetchUserInfo();
            }).then(() => {
                return Promise.resolve(authResponse);
            }).catch((error) => {
                return Promise.reject(error);
            });
    };


    /**
     Helper method to initialize the params used during the oAuth2 authentication process.

     @return Promise<void>
     **/
    private _initSessionParams(length: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._initRndString(length).then((stateString) => {
                this._state = stateString;
                this._initRndString(length).then((codeVerifier) => {
                    this._codeVerifier = codeVerifier;
                    // this._codeChallenge = BASE64URL-ENCODE(SHA256(ASCII(this._codeVerifier)))
                    let shaObj = new jsSHA("SHA-256", "TEXT"); // create a SHA-256 Base64 hash out of the
                    shaObj.update(this._codeVerifier); // generated code_verifier
                    let hash = shaObj.getHash("B64");  // transform the hash value into the Base64URL encoded
                    this._codeChallenge = base64EncodeURL(hash); // code_challenge
                    resolve();
                })
            }).catch((error) => {
                reject(error);
            })
        })
    };

    /**
     Helper method to generate a random string with a given length.
     @param length Length of the string to be generated
     @return Promise<string>
     **/
    private _initRndString(length: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (length && length >= 0) {
                let _state = "";
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
                for (var i = 0; i < length; i++) {
                    _state += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                resolve(_state);
            } else {
                reject(new InvalidCallError('Argument length in function call undefined or < 0'));
            }
        });
    };

    /**
     This method fetches the conformance statement identifying the OAuth authorize
     and token endpoint URLs for use in requesting authorization to access FHIR resources.
     This method is invoked whenever a new midata object is created. However, it can also
     exclusively be called in order to update existing endpoint information.

     @return Promise<Resource>
     **/

    public fetchFHIRConformanceStatement(): Promise<Resource> {

        let tryToMapResponse = (response: ApiCallResponse) : Resource => {
            if (response.status === 200) {
                try {
                    response.body = fromFhir(JSON.parse(response.body));
                    return response.body;
                } catch (mappingError) {
                    // FHIR's Resource record structure's been violated, throw error
                    throw new MappingError();
                }
            } else {
                throw new MidataJSError(`Unexpected response status code: ${response.status}`);
            }
        };

        return apiCall({
            url: this._conformanceStatementEndpoint,
            method: 'GET'
        }).then((response: ApiCallResponse) => {
            return tryToMapResponse(response);
        }).then((resource) => {
            this._tokenEndpoint = resource.getProperty("rest")["0"].security.extension["0"].extension["0"].valueUri;
            this._authEndpoint = resource.getProperty("rest")["0"].security.extension["0"].extension["1"].valueUri;
            return Promise.resolve(resource);
        }).catch((error) => {
            return Promise.reject(error);
        });
    };
};