"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
var util_1 = require("./util");
var ionic_native_1 = require("ionic-native");
var http_1 = require("@angular/http");
var registry_1 = require("./resources/registry");
var Resource_1 = require("./resources/Resource");
var jsSHA = require("jssha");
var Midata = (function () {
    /**
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:9000".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     */
    function Midata(_host, _appName, _secret, _conformanceStatementEndpoint) {
        var _this = this;
        this._host = _host;
        this._appName = _appName;
        this._secret = _secret;
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint;
        /**
         Helper method to create FHIR resources via a HTTP POST call.
         */
        this._create = function (fhirObject) {
            var url; // for convenience
            if (fhirObject.resourceType === "Bundle") {
                url = _this._host + "/fhir";
            }
            else {
                url = _this._host + "/fhir/" + fhirObject.resourceType;
            }
            return util_1.apiCall({
                jsonBody: false,
                url: url,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + _this._authToken,
                    'Content-Type': 'application/json+fhir;charset=utf-8',
                    'Prefer': 'return=representation'
                },
                payload: fhirObject
            });
        };
        /**
         Helper method to create FHIR resources via a HTTP PUT call.
         */
        this._update = function (fhirObject) {
            var url = _this._host + "/fhir/" + fhirObject.resourceType + "/" + fhirObject.id;
            return util_1.apiCall({
                jsonBody: false,
                url: url,
                payload: fhirObject,
                headers: {
                    'Authorization': 'Bearer ' + _this._authToken,
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
        this._refresh = function (withRefreshToken) {
            return new es6_promise_1.Promise(function (resolve, reject) {
                var getEncodedParams = function () {
                    // because of x-www-form-urlencoded
                    var urlSearchParams = new http_1.URLSearchParams();
                    urlSearchParams.append("grant_type", "refresh_token");
                    if (withRefreshToken) {
                        urlSearchParams.append("refresh_token", withRefreshToken);
                    }
                    else {
                        urlSearchParams.append("refresh_token", _this._refreshToken);
                    }
                    return urlSearchParams;
                };
                var refreshTokenRequest = {
                    encodedParams: getEncodedParams()
                };
                util_1.apiCall({
                    url: _this._tokenEndpoint,
                    method: 'POST',
                    payload: refreshTokenRequest.encodedParams.toString(),
                    jsonBody: true,
                    jsonEncoded: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(function (response) {
                    var body = response.body;
                    var user;
                    if (_this._user) {
                        _this._user.id = body.patient;
                    }
                    else {
                        user = {
                            id: body.patient,
                        };
                    }
                    _this._setLoginData(body.access_token, body.refresh_token, user);
                    _this.search("Patient", { _id: body.patient }).then(function (msg) {
                        console.log(msg);
                        console.log(msg[0].telecom[0].value);
                        _this.setUserEmail(msg[0].telecom[0].value);
                        console.log("Login data refreshed! resolve...");
                        resolve(body);
                    });
                })
                    .catch(function (response) {
                    reject(response);
                });
            });
        };
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint || _host + "/fhir/metadata";
        if (this._conformanceStatementEndpoint !== undefined) {
            this.fetchFHIRConformanceStatement().then(function (response) {
                console.log("Success! (" + response.status + ", " + response.message + ")");
            }, function (error) {
                console.log("Error! " + error);
            });
        }
    }
    Object.defineProperty(Midata.prototype, "loggedIn", {
        /*
         If the user is logged in already.
         */
        get: function () {
            return this._authToken !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "authToken", {
        /*
         The currently used authentication token. If the user didn't login yet
         or recently called `logout()` this property will be undefined.
         */
        get: function () {
            return this._authToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "refreshToken", {
        /*
         The currently used refresh token. If the user didn't login yet
         or recently called `logout()` this property will be undefined.
         */
        get: function () {
            return this._refreshToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "user", {
        /*
         The current user as created upon execution of login() or authenticate(). If no user is set,
         this property will be undefined.
         */
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    /*
     Set the current user's email address.
     */
    Midata.prototype.setUserEmail = function (email) {
        if (this._user) {
            this._user.email = email;
        }
        else {
            var user = {
                email: email
            };
            this._user = user;
        }
    };
    /*
     Set the current user's language.
     */
    Midata.prototype.setUserLanguage = function (language) {
        if (this._user) {
            this._user.language = language;
        }
        else {
            var user = {
                language: language
            };
            this._user = user;
        }
    };
    /*
     Destroy all authenication information.
     */
    Midata.prototype.logout = function () {
        this._refreshToken = undefined;
        this._authToken = undefined;
        this._state = undefined;
        this._codeVerifier = undefined;
        this._codeChallenge = undefined;
        this._user = undefined;
    };
    /*
     Set login-specific properties. This method should be called either during
     startup or when the login method is called explicitly.
     */
    Midata.prototype._setLoginData = function (authToken, refreshToken, user) {
        this._authToken = authToken;
        this._refreshToken = refreshToken;
        if (user) {
            this._user = user;
        }
    };
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
    Midata.prototype.login = function (username, password, role) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (username === undefined || password === undefined) {
                throw new Error('You need to supply a username and a password!');
            }
            var authRequest = {
                username: username,
                password: password,
                appname: _this._appName,
                secret: _this._secret
            };
            if (role !== undefined) {
                authRequest.role = role;
            }
            util_1.apiCall({
                url: _this._host + '/v1/auth',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                jsonBody: true,
                payload: authRequest
            })
                .then(function (response) {
                var body = response.body;
                var user;
                if (_this._user) {
                    _this._user.id = body.owner;
                    _this._user.name = username;
                }
                else {
                    user = {
                        id: body.owner,
                        name: username
                    };
                }
                _this._setLoginData(body.authToken, body.refreshToken, user);
                _this.search("Patient", { _id: body.owner }).then(function (msg) {
                    console.log(msg);
                    console.log(msg[0].telecom[0].value);
                    _this.setUserEmail(msg[0].telecom[0].value);
                    console.log("Login data set! resolve...");
                    resolve(body);
                });
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**
     *
     * This method stores a resource onto midata.
     *
     * @param resourceType e.g. HeartRate
     * @return The promise returns the created object. In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */
    // TODO: Try to map response objects back to their class (e.g. BodyWeight)
    Midata.prototype.save = function (resource) {
        var _this = this;
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error("Can't create records when no user logged in first. Call authenticate() before trying to create records.");
        }
        // Convert the resource to a FHIR-structured simple js object.
        var fhirObject;
        if (resource instanceof Resource_1.Resource) {
            fhirObject = resource.toJson();
        }
        else {
            fhirObject = resource;
        }
        // If the resource didn't have an id, then the resource has to be
        // created on the server.
        var shouldCreate = fhirObject.id === undefined || fhirObject.resourceType === "Bundle"; // By default
        // a bundle holds an id upon creation. Therefore, additionally check for resource type
        var apiMethod = shouldCreate ? this._create : this._update;
        return apiMethod(fhirObject)
            .then(function (response) {
            // When the resource is created, the same resource will
            // be returned (populated with an id field in the case
            // it was newly created).
            if (response.status === 201) {
                return JSON.parse(response.body);
            }
            else if (response.status === 200) {
                return JSON.parse(response.body);
            }
            else {
                console.log("Unexpected response status code: " + response.status);
                return es6_promise_1.Promise.reject(response);
            }
        })
            .catch(function (response) {
            // convenience variable
            var logMsg = "Please login again using method authenticate()";
            if (response.status === 401) {
                return new es6_promise_1.Promise(function (resolve, reject) {
                    console.log("Error, " + response.message + " => Trying to refresh your tokens and save again...");
                    // retry to save resource. Proceed with logout if the operation somehow still fails.
                    // premise: existing refresh token
                    if (_this.refreshToken) {
                        // short logging of what's been going on during each case of the token recovery process.
                        // try to refresh the access token using the refresh token
                        _this.refresh().then(function (_) {
                            console.log("Success! Tokens restored. Retry action..."); // recovery successful
                            apiMethod(fhirObject).then(function (response) {
                                console.log("Success! Proceed..."); // operation successful
                                resolve(JSON.parse(response.body)); // return created object
                            }, function (error) {
                                // retry method call not successful, logout and force authentication
                                _this.logout();
                                console.log("Still receiving error, abort. " + logMsg);
                                reject(error);
                            });
                        }, function (error) {
                            // token recovery not successful, logout and force authentication
                            _this.logout();
                            console.log("Error during refresh process. " + logMsg);
                            reject(error);
                            // rather unlikely, but still...
                            // catch other errors during callback..
                        }).catch(function (error) {
                            // .. and force new authentication as well in case of such happenings
                            _this.logout();
                            console.log("Internal Error, abort. " + logMsg);
                            reject(error);
                        });
                    }
                    else {
                        // refresh token not existing. Force authentication by logging out.
                        _this.logout();
                        console.log("Refresh token not available!  " + logMsg);
                        reject(response);
                    }
                });
            }
            // No 401 error. Therefore, no retry. Return response from
            // first apiMethod call
            return es6_promise_1.Promise.reject(response);
        });
    };
    /**
     * Query the midata API using FHIR resource types and optional params.
     *
     * @param resourceType e.g. Observation
     * @param params e.g. {status: 'preliminary'}
     * @return The promise returns an array of objects matching the search param(s). In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */
    Midata.prototype.search = function (resourceType, params) {
        if (params === void 0) { params = {}; }
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error("Can't search for records when no user logged in first. Call authenticate() before trying to query the API.");
        }
        var baseUrl = this._host + "/fhir/" + resourceType;
        return this._search(baseUrl, params);
    };
    Midata.prototype._search = function (baseUrl, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var queryParts = Object.keys(params).map(function (key) {
            return key + '=' + params[key];
        });
        var query = queryParts.join('&');
        query = query && "?" + query || '';
        var url = baseUrl + query;
        return util_1.apiCall({
            url: url,
            method: 'GET',
            jsonBody: true,
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8'
            }
        })
            .then(function (response) {
            if (response.body.entry !== undefined) {
                var entries = response.body.entry;
                var resources = entries.map(function (e) {
                    return registry_1.fromFhir(e.resource);
                });
                return resources;
            }
            else {
                return [];
            }
        })
            .catch(function (response) {
            // convenience variable
            var logMsg = "Please login again using method authenticate()";
            if (response.status === 401) {
                return new es6_promise_1.Promise(function (resolve, reject) {
                    console.log("Error, " + response.message + " => Trying to refresh your tokens and save again...");
                    // retry to save resource. Proceed with logout if the operation somehow still fails.
                    // premise: existing refresh token
                    if (_this.refreshToken) {
                        // short logging of what's been going on during each case of the token recovery process.
                        // try to refresh the access token using the refresh token
                        _this.refresh().then(function (_) {
                            console.log("Success! Tokens restored. Retry action..."); // recovery successful
                            util_1.apiCall({
                                url: url,
                                method: 'GET',
                                jsonBody: true,
                                headers: {
                                    'Authorization': 'Bearer ' + _this._authToken,
                                    'Content-Type': 'application/json+fhir;charset=utf-8'
                                }
                            }).then(function (response) {
                                if (response.body.entry !== undefined) {
                                    var entries = response.body.entry;
                                    // we need Promise.all here since entries is iterable
                                    var resources = es6_promise_1.Promise.all(entries.map(function (e) {
                                        return registry_1.fromFhir(e.resource);
                                    }));
                                    resolve(resources); // return array containing results
                                }
                                else {
                                    resolve([]); // or return empty array if no results
                                }
                            }, function (error) {
                                // retry method call not successful, logout and force authentication
                                _this.logout();
                                console.log("Still receiving error, abort. " + logMsg);
                                reject(error);
                            });
                        }, function (error) {
                            // token recovery not successful, logout and force authentication
                            _this.logout();
                            console.log("Error during refresh process. " + logMsg);
                            reject(error);
                            // rather unlikely, but still...
                            // catch other errors during callback..
                        }).catch(function (error) {
                            // .. and force new authentication as well in case of such happenings
                            _this.logout();
                            console.log("Internal Error, abort. " + logMsg);
                            reject(error);
                        });
                    }
                    else {
                        // refresh token not existing. Force authentication by logging out.
                        _this.logout();
                        console.log("Refresh token not available!  " + logMsg);
                        reject(response);
                    }
                });
            }
            // No 401 error. Therefore, no retry. Return response from
            // first apiCall
            return es6_promise_1.Promise.reject(response);
        });
    };
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
    Midata.prototype.authenticate = function () {
        // wrapper method, call subsequent actions from here
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._authenticate().then(function (_) { return _this._exchangeTokenForCode(); })
                .then(function (body) {
                resolve(body);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**
     Helper method to refresh the authentication token by authorizing
     with the help of the refresh token. This will generate a new authentication as well as
     a new refresh token. On successful refresh, the old refresh_token will be invalid and
     both the access_token and the refresh_token stored in the local storage will be overwritten.
     Previous access_tokens will remain valid until their expiration timestamp is exceeded. However, possibly
     older access_tokens are neglected due to overwrite logic.
     */
    Midata.prototype.refresh = function (withRefreshToken) {
        // wrapper method, call subsequent actions from here
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._refresh(withRefreshToken).then(function (body) {
                resolve(body);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**
     The user will be redirected to midata.coop in order to login / register and grant
     the application access to his data. If the event target is equal to the callback url
     defined in the USERAUTH_ENDPOINT (and ,therefore, authentication on midata was successful)
     the authentication code is extracted in stored locally. The authentication code will then be further
     used by the method _exchangeTokenForCode().

     @return A Promise of type InAppBrowserEvent.
     **/
    Midata.prototype._authenticate = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._initSessionParams(128).then(function () {
                var endpoint = _this._authEndpoint + "?response_type=code&client_id=" + _this._appName + "&redirect_uri=http://localhost/callback&aud=" + _this._host + "%2Ffhir&scope=user%2F*.*&state=" + _this._state + "&code_challenge=" + _this._codeChallenge + "&code_challenge_method=S256";
                if (typeof _this._user != "undefined" && typeof _this._user.email != "undefined") {
                    endpoint = endpoint + "&email=" + _this._user.email;
                }
                if (typeof _this._user != "undefined" && typeof _this._user.language != "undefined") {
                    endpoint = endpoint + "&language=" + _this._user.language;
                }
                _this._iab = new ionic_native_1.InAppBrowser(endpoint, '_blank', 'location=yes');
                _this._iab.on('loadstart').subscribe(function (event) {
                    _this._iab.show();
                    if ((event.url).indexOf("http://localhost/callback") === 0) {
                        var _state = event.url.split("&")[0].split("=")[1];
                        if (_state && _state === _this._state) {
                            _this._authCode = event.url.split("&")[1].split("=")[1];
                            _this._iab.close();
                            resolve(event);
                        }
                        else {
                            _this._iab.close();
                            reject(event);
                        }
                    }
                }, function (error) {
                    console.log("Error! " + error);
                    reject(error);
                });
            });
        });
    };
    /**
     After successful authentication on midata this method is invoked. It exchanges the authCode
     obtained from midata with the access_token used to query the FHIR endpoint API.

     @return On success the resolved promise will hold a body of type TokenResponse as defined in the interface within
     the api class. On failure the catch clause will forward an error of type ApiCallResponse.
     **/
    Midata.prototype._exchangeTokenForCode = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            var getEncodedParams = function () {
                // because of x-www-form-urlencoded
                var urlSearchParams = new http_1.URLSearchParams();
                urlSearchParams.append("grant_type", "authorization_code");
                urlSearchParams.append("code", _this._authCode);
                urlSearchParams.append("redirect_uri", "http://localhost/callback");
                urlSearchParams.append("client_id", _this._appName);
                urlSearchParams.append("code_verifier", _this._codeVerifier);
                return urlSearchParams;
            };
            var tokenRequest = {
                encodedParams: getEncodedParams()
            };
            util_1.apiCall({
                url: _this._tokenEndpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                jsonBody: true,
                payload: tokenRequest.encodedParams.toString(),
                jsonEncoded: false
            })
                .then(function (response) {
                var body = response.body;
                var user;
                if (_this._user) {
                    _this._user.id = body.patient;
                }
                else {
                    user = {
                        id: body.patient,
                    };
                }
                _this._setLoginData(body.access_token, body.refresh_token, user);
                _this.search("Patient", { _id: body.patient }).then(function (msg) {
                    console.log(msg);
                    console.log(msg[0].telecom[0].value);
                    _this.setUserEmail(msg[0].telecom[0].value);
                    console.log("Login data set! resolve...");
                    resolve(body);
                });
            })
                .catch(function (response) {
                reject(response);
            });
        });
    };
    Midata.prototype._initSessionParams = function (length) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._initRndString(length).then(function (stateString) {
                _this._state = stateString;
                _this._initRndString(length).then(function (codeVerifier) {
                    _this._codeVerifier = codeVerifier;
                    // this._codeChallenge = BASE64URL-ENCODE(SHA256(ASCII(this._codeVerifier)))
                    var shaObj = new jsSHA("SHA-256", "TEXT"); // create a SHA-256 Base64 hash out of the
                    shaObj.update(_this._codeVerifier); // generated code_verifier
                    var hash = shaObj.getHash("B64"); // transform the hash value into the Base64URL encoded
                    _this._codeChallenge = util_1.base64EncodeURL(hash); // code_challenge
                    resolve("OK");
                });
            }).catch(function (error) {
                reject(error.toString());
            });
        });
    };
    Midata.prototype._initRndString = function (length) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (length && length >= 0) {
                var _state = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
                for (var i = 0; i < length; i++) {
                    _state += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                resolve(_state);
            }
            else {
                reject("Error");
            }
        });
    };
    /**
     This method fetches the conformance statement identifying the OAuth authorize
     and token endpoint URLs for use in requesting authorization to access FHIR resources.
     This method is invoked whenever a new midata object is created. However, it can also
     exclusively be called in order to update existing endpoint information.

     @return In both cases (on success & and failure) the method will return a resolved promise of type ApiCallResponse
     conforming to the interface defined within the util class.
     **/
    Midata.prototype.fetchFHIRConformanceStatement = function () {
        var _this = this;
        return util_1.apiCall({
            url: this._conformanceStatementEndpoint,
            method: 'GET'
        }).then(function (response) {
            _this._tokenEndpoint = JSON.parse(response.body).rest["0"].security.extension["0"].extension["0"].valueUri;
            _this._authEndpoint = JSON.parse(response.body).rest["0"].security.extension["0"].extension["1"].valueUri;
            return response;
        }).catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    };
    /**
     *
     * This method deletes a resource on midata.
     *
     * @param resourceType e.g. HeartRate
     * @param id (unique)
     * @return The promise returns the response body. In case of failure, an error of type
     *         ApiCallResponse will be returned.
     */
    Midata.prototype.delete = function (resourceType, id) {
        var url = this._host + "/fhir/" + resourceType + "/" + id;
        return util_1.apiCall({
            url: url,
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this._authToken
            }
        })
            .then(function (response) {
            console.log(response);
        });
    };
    return Midata;
}());
exports.Midata = Midata;
//# sourceMappingURL=Midata.js.map