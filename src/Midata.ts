import {
    TokenRefreshResponse,
    TokenRequest,
    TokenResponse, AuthRequest, UserRole, AuthResponse
} from './api';
import {Promise} from 'es6-promise'
import {apiCall, ApiCallResponse} from './util';
import {InAppBrowser, InAppBrowserEvent} from 'ionic-native';
import {URLSearchParams} from "@angular/http";
import {fromFhir} from "./resources/registry";
import {Resource} from "./resources/Resource";

declare var window: any;

export interface User {
    name: string;
    id: string;
}

export class Midata {

    private _authToken: string;
    private _refreshToken: string;
    private _authCode: string;
    private _tokenEndpoint: string;
    private _authEndpoint: string;
    private _user: User;
    private _iab: InAppBrowser;


    /**
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:9000".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     */
    constructor(private _host: string,
                private _appName: string,
                private _secret?: string,
                private _conformanceStatementEndpoint?: string) {

        this._conformanceStatementEndpoint = _conformanceStatementEndpoint || `${_host}/fhir/metadata`;

        if (this._conformanceStatementEndpoint !== undefined) {

            this.fetchFHIRConformanceStatement().then((response) => {

                console.log(`Success! (${response.status}, ${response.message})`);

                // Check if there is previously saved login data that was
                // put there before the last page refresh. In case there is,
                // load it.

                if (window.localStorage) {
                    let
                        value = localStorage.getItem('midataLoginData');
                    let
                        data = JSON.parse(value);

                    if (data) {
                        this._setLoginData(
                            data.authToken, data.refreshToken);
                    }
                }
            }, (error) => {

                console.log(`Error! (${error.status}, ${error.message})`);

            });
        }
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
     The current user as created upon execution of login(). If no user is set,
     this property will be undefined.
     */
    get user() {
        return this._user;
    }

    /*
     Destroy all authenication information.
     */

    logout() {
        this._refreshToken = undefined;
        this._authToken = undefined;
        if (window.localStorage) {
            localStorage.removeItem('midataLoginData');
        }
    }

    /*
     Set login-specific properties. This method should be called either during
     startup or when the login method is called explicitly.
     */
    private _setLoginData(authToken: string, refreshToken: string, user?: User) {
        this._authToken = authToken;
        this._refreshToken = refreshToken;
        this._user = user;
        if (window.localStorage) {
            localStorage.setItem('midataLoginData', JSON.stringify({
                authToken: authToken,
                refreshToken: refreshToken,
                user: user
            }));
        }
    }


    /**
     * Login to the MIDATA platform. This method has to be called prior to
     * creating or updating resources.
     *
     * @deprecated only use this method if your app does not support oAuth2 authentication
     * @param username The user's identifier, most likely an email address.
     * @param password The user's password.
     * @param role The user's role used during the login (optional).
     * @return If the login was successful the return value will be a resolved
     *         promise that contains the newly generated authentication and
     *         refresh token. In case the login failed the return value
     *         will be a rejected promise containing the error message.
     */
    login(username: string, password: string, role?: UserRole): Promise<any> {
        if (username === undefined || password === undefined) {
            throw new Error('You need to supply a username and a password!');
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

        let result = apiCall({
            url: this._host + '/v1/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            jsonBody: true,
            payload: authRequest
        })
            .then(response => {
                let body: AuthResponse = response.body;
                let user = {
                    id: body.owner,
                    name: username
                };
                this._setLoginData(body.authToken, body.refreshToken, user);
                return body;
            })
            .catch(error => {
                return Promise.reject(error);
            });

        return result;
    }


    /**
     *
     * This method stores a resource onto midata.
     *
     * @param resourceType e.g. HeartRate
     * @return The promise returns the created object. In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */

    // TODO: Try to map response objects back to their class (e.g. BodyWeight)

    save(resource: Resource | any) {
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error(`Can\'t create records when no user logged in first. Call authenticate() before trying to create records.`
            );
        }
        // Convert the resource to a FHIR-structured simple js object.
        var fhirObject: any;
        if (resource instanceof Resource) {
            fhirObject = resource.toJson();
        } else {
            fhirObject = resource;
        }

        // If the resource didn't have an id, then the resource has to be
        // created on the server.
        let shouldCreate = fhirObject.id === undefined || fhirObject.resourceType === "Bundle"; // By default
        // a bundle holds an id upon creation. Therefore, additionally check for resource type
        let apiMethod = shouldCreate ? this._create : this._update;

        return apiMethod(fhirObject)
            .then(response => {
                // When the resource is created, the same resource will
                // be returned (populated with an id field in the case
                // it was newly created).
                if (response.status === 201) {          // created
                    return JSON.parse(response.body);
                } else if (response.status === 200) {  // updated
                    return JSON.parse(response.body);
                } else {
                    console.log(`Unexpected response status code: ${response.status}`);
                    return Promise.reject(response);
                }
            })
            .catch((response: any) => {

                // convenience variable
                let logMsg = `Please login again using method authenticate()`;

                if (response.status === 401) { // if token has expired

                    return new Promise<ApiCallResponse>((resolve, reject) => {

                        console.log(`Error, ${response.message} => Trying to refresh your tokens and save again...`);

                        // retry to save resource. Proceed with logout if the operation somehow still fails.

                        // premise: existing refresh token
                        if (this.refreshToken) {

                            // short logging of what's been going on during each case of the token recovery process.

                            // try to refresh the access token using the refresh token
                            this.refresh().then(_ => {
                                console.log(`Success! Tokens restored. Retry action...`); // recovery successful
                                apiMethod(fhirObject).then((response) => { // retry apiCall with new tokens
                                    console.log("Success! Proceed..."); // operation successful
                                    resolve(JSON.parse(response.body)); // return created object 
                                }, (error) => {
                                    // retry method call not successful, logout and force authentication
                                    this.logout();
                                    console.log(`Still receiving error, abort. ${logMsg}`);
                                    reject(error);
                                })
                            }, (error: any) => {
                                // token recovery not successful, logout and force authentication
                                this.logout();
                                console.log(`Error during refresh process. ${logMsg}`);
                                reject(error);
                                // rather unlikely, but still...
                                // catch other errors during callback..
                            }).catch(error => {
                                // .. and force new authentication as well in case of such happenings
                                this.logout();
                                console.log(`Internal Error, abort. ${logMsg}`);
                                reject(error);
                            });

                        } else {
                            // refresh token not existing. Force authentication by logging out.
                            this.logout();
                            console.log(`Refresh token not available!  ${logMsg}`);
                            reject(response);
                        }

                    });

                }
                // No 401 error. Therefore, no retry. Return response from
                // first apiMethod call
                return Promise.reject(response);

            });
    }

    /**
     Helper method to create FHIR resources via a HTTP POST call.
     */
    private _create = (fhirObject: any) => {

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
     Helper method to create FHIR resources via a HTTP PUT call.
     */
    private _update = (fhirObject: any) => {
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
     Helper method to refresh the authentication token by authorizing
     with the help of the refresh token. This will generate a new authentication as well as
     a new refresh token. On successful refresh, the old refresh_token will be invalid and
     both the access_token and the refresh_token stored in the local storage will be overwritten.
     Previous access_tokens will remain valid until their expiration timestamp is exceeded. However, possibly
     older access_tokens are neglected due to overwrite logic.

     @return a Promise of type TokenRefreshResponse. On failure the catch clause will forward an error
     of type ApiCallResponse.
     */

    private _refresh = () => {

        return new Promise<TokenRefreshResponse>((resolve, reject) => {

            let getEncodedParams = () => {

                // because of x-www-form-urlencoded

                let urlSearchParams = new URLSearchParams();
                urlSearchParams.append("grant_type", "refresh_token");
                urlSearchParams.append("refresh_token", this._refreshToken);
                return urlSearchParams;
            };

            let refreshTokenRequest: TokenRequest = {

                encodedParams: getEncodedParams()

            };

            apiCall({
                url: this._tokenEndpoint,
                method: 'POST',
                payload: refreshTokenRequest.encodedParams.toString(),
                jsonBody: true,
                jsonEncoded: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => {
                    let body: TokenRefreshResponse = response.body;
                    this._authToken = body.access_token;
                    this._refreshToken = body.refresh_token;

                    // set login data
                    this._setLoginData(body.access_token, body.refresh_token);

                    console.log("Login data refreshed! resolve...");
                    resolve(body);

                })
                .catch((response: ApiCallResponse) => {
                    reject(response);
                });
        })
    };

    /**
     * Query the midata API using FHIR resource types and optional params.
     *
     * @param resourceType e.g. Observation
     * @param params e.g. {status: 'preliminary'}
     * @return The promise returns an array of objects matching the search param(s). In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */

    search(resourceType: string, params: any = {}) {
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error(`Can\'t search for records when no user logged in first. Call authenticate() before trying to query the API.`
            );
        }
        let baseUrl = `${this._host}/fhir/${resourceType}`;
        return this._search(baseUrl, params);
    }

    private _search(baseUrl: string, params: any = {}) {
        let queryParts = Object.keys(params).map(key => {
            return key + '=' + params[key]
        });
        let query = queryParts.join('&');
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
        })
            .then((response: any) => {
                if (response.body.entry !== undefined) {
                    let entries = response.body.entry;
                    let resources = entries.map((e: any) => {
                        return fromFhir(e.resource);
                    });
                    return resources;
                } else {
                    return [];
                }
            })

            .catch((response: any) => {

                // convenience variable
                let logMsg = `Please login again using method authenticate()`;

                if (response.status === 401) { // if token has expired

                    return new Promise<any>((resolve, reject) => {

                        console.log(`Error, ${response.message} => Trying to refresh your tokens and save again...`);

                        // retry to save resource. Proceed with logout if the operation somehow still fails.

                        // premise: existing refresh token
                        if (this.refreshToken) {

                            // short logging of what's been going on during each case of the token recovery process.

                            // try to refresh the access token using the refresh token
                            this.refresh().then(_ => {
                                console.log(`Success! Tokens restored. Retry action...`); // recovery successful
                                apiCall({
                                    url: url,
                                    method: 'GET',
                                    jsonBody: true,
                                    headers: {
                                        'Authorization': 'Bearer ' + this._authToken,
                                        'Content-Type': 'application/json+fhir;charset=utf-8'
                                    }
                                }).then((response: any) => {
                                    if (response.body.entry !== undefined) {
                                        let entries = response.body.entry;
                                        // we need Promise.all here since entries is iterable
                                        let resources = Promise.all(entries.map((e: any) => {
                                            return fromFhir(e.resource);
                                        }));
                                        resolve(resources); // return array containing results
                                    } else {
                                        resolve([]); // or return empty array if no results
                                    }
                                }, (error) => {
                                    // retry method call not successful, logout and force authentication
                                    this.logout();
                                    console.log(`Still receiving error, abort. ${logMsg}`);
                                    reject(error);
                                })
                            }, (error: any) => {
                                // token recovery not successful, logout and force authentication
                                this.logout();
                                console.log(`Error during refresh process. ${logMsg}`);
                                reject(error);
                                // rather unlikely, but still...
                                // catch other errors during callback..
                            }).catch(error => {
                                // .. and force new authentication as well in case of such happenings
                                this.logout();
                                console.log(`Internal Error, abort. ${logMsg}`);
                                reject(error);
                            });

                        } else {
                            // refresh token not existing. Force authentication by logging out.
                            this.logout();
                            console.log(`Refresh token not available!  ${logMsg}`);
                            reject(response);
                        }

                    });

                }
                // No 401 error. Therefore, no retry. Return response from
                // first apiCall
                return Promise.reject(response);

            });
    }


    /**
     Login to the MIDATA platform. This method has to be called prior to
     creating or updating resources. Calling authenticate will initiate the
     oAuth2 authentication process. This method invokes the methods _authenticate &
     _exchangeTokenForCode.

     @return If the login process was successful the return value will be a resolved
     promise that contains the newly generated authentication and
     refresh token. In case the login failed the return value
     will be a rejected promise containing the error message (type any).
     **/

    authenticate(): Promise<TokenResponse> {

        // wrapper method, call subsequent actions from here

        return new Promise((resolve, reject) => {

            this._authenticate().then(_ => this._exchangeTokenForCode())
                .then((body) => {

                    resolve(body);
                })
                .catch((error: any) => {

                    reject(error);
                })
        });
    }


    /**
     Helper method to refresh the authentication token by authorizing
     with the help of the refresh token. This will generate a new authentication as well as
     a new refresh token. On successful refresh, the old refresh_token will be invalid and
     both the access_token and the refresh_token stored in the local storage will be overwritten.
     Previous access_tokens will remain valid until their expiration timestamp is exceeded. However, possibly
     older access_tokens are neglected due to overwrite logic.
     */

    refresh(): Promise<TokenRefreshResponse> {

        // wrapper method, call subsequent actions from here

        return new Promise((resolve, reject) => {
            this._refresh().then((body) => {
                resolve(body);

            })
                .catch((error: ApiCallResponse) => {
                    reject(error)
                })
        });
    }


    /**
     The user will be redirected to midata.coop in order to login / register and grant
     the application access to his data. If the event target is equal to the callback url
     defined in the USERAUTH_ENDPOINT (and ,therefore, authentication on midata was successful)
     the authentication code is extracted in stored locally. The authentication code will then be further
     used by the method _exchangeTokenForCode().

     @return A Promise of type InAppBrowserEvent.
     **/

    private _authenticate(): Promise<InAppBrowserEvent> {
        return new Promise((resolve, reject) => {
            let USERAUTH_ENDPOINT = () => {
                return `${this._authEndpoint}?response_type=code&client_id=${this._appName}&redirect_uri=http://localhost/callback&aud=${this._host}%2Ffhir&scope=user%2F*.*`;
            };
            this._iab = new InAppBrowser(USERAUTH_ENDPOINT(), '_blank', 'location=yes');
            this._iab.on('loadstart').subscribe((event) => {
                    this._iab.show();
                    if ((event.url).indexOf("http://localhost/callback") === 0) {
                        this._authCode = event.url.split("&")[1].split("=")[1];
                        this._iab.close();
                        resolve(event);
                    }
                },
                (error) => {
                    console.log(`Error! (${error.status}, ${error.message})`);
                    reject(error);
                });
        });
    }


    /**
     After successful authentication on midata this method is invoked. It exchanges the authCode
     obtained from midata with the access_token used to query the FHIR endpoint API.

     @return On success the resolved promise will hold a body of type TokenResponse as defined in the interface within
     the api class. On failure the catch clause will forward an error of type ApiCallResponse.
     **/

    private _exchangeTokenForCode(): Promise<TokenResponse> {

        return new Promise<TokenResponse>((resolve, reject) => {

            let getEncodedParams = () => {

                // because of x-www-form-urlencoded

                let urlSearchParams = new URLSearchParams();
                urlSearchParams.append("grant_type", "authorization_code");
                urlSearchParams.append("code", this._authCode);
                urlSearchParams.append("redirect_uri", "http://localhost/callback");
                urlSearchParams.append("client_id", "oauth2test");

                return urlSearchParams;
            };

            let tokenRequest: TokenRequest = {

                encodedParams: getEncodedParams()

            };

            apiCall({
                url: this._tokenEndpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                jsonBody: true,
                payload: tokenRequest.encodedParams.toString(),
                jsonEncoded: false
            })
                .then(response => {
                    let body: TokenResponse = response.body;

                    // set login data
                    this._setLoginData(body.access_token, body.refresh_token);

                    console.log("Login data set! resolve...");
                    resolve(body);

                })
                .catch((response: ApiCallResponse) => {
                    reject(response);
                });
        });
    }


    /**
     This method fetches the conformance statement identifying the OAuth authorize
     and token endpoint URLs for use in requesting authorization to access FHIR resources.
     This method is invoked whenever a new midata object is created. However, it can also
     exclusively be called in order to update existing endpoint information.

     @return In both cases (on success & and failure) the method will return a resolved promise of type ApiCallResponse
     conforming to the interface defined within the util class.
     **/

    public fetchFHIRConformanceStatement(): Promise<ApiCallResponse> {

        return apiCall({
            url: this._conformanceStatementEndpoint,
            method: 'GET'

        }).then((response: ApiCallResponse) => {

            this._tokenEndpoint = JSON.parse(response.body).rest["0"].security.extension["0"].extension["0"].valueUri;
            this._authEndpoint = JSON.parse(response.body).rest["0"].security.extension["0"].extension["1"].valueUri;

            return response;

        }).catch((error: ApiCallResponse) => {

            return Promise.reject(error);
        });
    }

    /**
     *
     * This method deletes a resource on midata.
     *
     * @param resourceType e.g. HeartRate
     * @param id (unique)
     * @return The promise returns the response body. In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */

    delete(resourceType: string, id: number | string) {
        let url = `${this._host}/fhir/${resourceType}/${id}`;
        return apiCall({
            url: url,
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this._authToken
            }
        })
            .then((response: any) => {
                console.log(response);
            });
    }
}
