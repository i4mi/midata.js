"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MidataJSError_1 = require("./errors/MidataJSError");
var MappingError_1 = require("./errors/MappingError");
var UnknownEndpointError_1 = require("./errors/UnknownEndpointError");
var InvalidCallError_1 = require("./errors/InvalidCallError");
var es6_promise_1 = require("es6-promise");
var util_1 = require("./util");
var ionic_native_1 = require("ionic-native");
var http_1 = require("@angular/http");
var registry_1 = require("./resources/registry");
var Resource_1 = require("./resources/Resource");
var jsSHA = require("jssha");
var Midata = (function () {
    /**
     *
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:443".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     *
     */
    function Midata(_host, _appName, _secret, _conformanceStatementEndpoint) {
        var _this = this;
        this._host = _host;
        this._appName = _appName;
        this._secret = _secret;
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint;
        /**
         *
         Helper method to create FHIR resources via a HTTP POST call.
         *
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
         *
         Helper method to create FHIR resources via a HTTP PUT call.
         *
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
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint || _host + "/fhir/metadata";
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
    Update the host and if needed the conformanceStatementEndpoint if the target server changes.
    Changing the target server will force a logout since this should only be done if no connection exists.
     */
    Midata.prototype.changePlatform = function (host, conformanceStatementEndpoint) {
        this._host = host;
        if (conformanceStatementEndpoint) {
            this._conformanceStatementEndpoint = conformanceStatementEndpoint;
        }
        else {
            this._conformanceStatementEndpoint = this._host + "/fhir/metadata";
        }
        this.logout();
    };
    /*
     Destroy all authentication information.
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
    Midata.prototype.login = function (username, password, role) {
        var _this = this;
        if (username === undefined || password === undefined) {
            return es6_promise_1.Promise.reject(new InvalidCallError_1.InvalidCallError('You need to supply a username and a password!'));
        }
        var authRequest = {
            username: username,
            password: password,
            appname: this._appName,
            secret: this._secret
        };
        if (role !== undefined) {
            authRequest.role = role;
        }
        var authResponse;
        var loginMidata = function () {
            return util_1.apiCall({
                url: _this._host + '/v1/auth',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                jsonBody: true,
                payload: authRequest
            }).then(function (response) {
                authResponse = response.body;
                var user;
                if (_this._user) {
                    _this._user.id = authResponse.owner;
                    _this._user.name = username;
                }
                else {
                    user = {
                        id: authResponse.owner,
                        name: username
                    };
                }
                _this._setLoginData(authResponse.authToken, authResponse.refreshToken, user);
                return es6_promise_1.Promise.resolve(authResponse);
            });
        };
        var fetchUserInfo = function () {
            return _this.search("Patient", { _id: _this.user.id }).then(function (response) {
                _this.setUserEmail(response[0].getProperty("telecom")[0].value);
                return es6_promise_1.Promise.resolve(response);
            });
        };
        return loginMidata()
            .then(function () {
            return fetchUserInfo();
        }).then(function () {
            return es6_promise_1.Promise.resolve(authResponse);
        }).catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    };
    ;
    /**
     *
     * This method stores a resource onto midata.
     *
     * @param resourceType The resource to be stored (e.g. HeartRate)
     * @return Promise<Resource>
     *
     */
    Midata.prototype.save = function (resource) {
        var _this = this;
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            return es6_promise_1.Promise.reject(new InvalidCallError_1.InvalidCallError('`Can\'t create records when no user logged in first. Call authenticate() before trying to create records.`'));
        }
        // Convert the resource to a FHIR-structured simple js object.
        var fhirObject;
        if (resource instanceof Resource_1.Resource) {
            fhirObject = resource.toJson();
        }
        else {
            fhirObject = resource;
        } // If the resource didn't have an id, then the resource has to be
        // created on the server.
        var shouldCreate = fhirObject.id === undefined || fhirObject.resourceType === "Bundle"; // By default
        // a bundle holds an id upon creation. Therefore, additionally check for resource type
        var apiMethod = shouldCreate ? this._create : this._update;
        var tryToMapResponse = function (response) {
            // When the resource is created, the same resource will
            // be returned (populated with an id field in case it was newly created).
            if (response.status === 201 || response.status === 200) {
                try {
                    response.body = registry_1.fromFhir(JSON.parse(response.body));
                    return response.body;
                }
                catch (mappingError) {
                    // Although storing the value onto Midata priorly succeeded, rejecting the promise
                    // at this point is fine since the response itself
                    // violates FHIR's Resource record structure.
                    throw new MappingError_1.MappingError();
                }
            }
            else {
                throw new MidataJSError_1.MidataJSError("Unexpected response status code: " + response.status);
            }
        };
        return apiMethod(fhirObject)
            .then(function (response) {
            try {
                return es6_promise_1.Promise.resolve(tryToMapResponse(response));
            }
            catch (error) {
                // Catch and re-throw the error
                return es6_promise_1.Promise.reject(error);
            }
        }, function (error) {
            // Check if the authToken is expired and a refreshToken is available
            if (error.status === 401 && _this.refreshToken) {
                return _this.refresh().then(function () {
                    // If the refresh operation succeeded,
                    // retry the operation 3 times
                    return _this._retry(3, apiMethod, fhirObject).then(function (response) {
                        try {
                            return es6_promise_1.Promise.resolve(tryToMapResponse(response));
                        }
                        catch (error) {
                            // Catch and re-throw the error
                            return es6_promise_1.Promise.reject(error);
                        }
                    }).catch(function (error) {
                        // Reject promise with error thrown within retry function
                        return es6_promise_1.Promise.reject(error);
                    });
                }, function (error) {
                    // Refreshing of token failed. Reject
                    return es6_promise_1.Promise.reject(error);
                });
            }
            else {
                // No 401 error or refreshToken not available. Reject and let the client handle...
                return es6_promise_1.Promise.reject(error);
            }
        });
    };
    ;
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
    Midata.prototype._retry = function (maxRetries, fn) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // Apply is very similar to call(), except for the type of arguments it supports.
        // You use an arguments array instead of a list of arguments (p1,p2,p3,...).
        // Thus, you do not have to know the arguments of the called object when you use
        // the apply method. The called object is then responsible for handling the arguments.
        return fn.apply(this, args).catch(function (error) {
            if (maxRetries <= 1) {
                throw new MidataJSError_1.MidataJSError("Maximum retries exceeded, abort!");
            }
            return _this._retry.apply(_this, [maxRetries - 1, fn].concat(args));
        });
    };
    ;
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
    Midata.prototype.refresh = function (withRefreshToken) {
        var _this = this;
        var tokenRefreshResponse;
        var fetchConformanceStatement = function () {
            if (_this._conformanceStatementEndpoint !== undefined) {
                if (_this._tokenEndpoint == undefined) {
                    return _this.fetchFHIRConformanceStatement().then(function (response) {
                        return es6_promise_1.Promise.resolve(response);
                    });
                }
                else {
                    return es6_promise_1.Promise.resolve({});
                }
            }
            else {
                return es6_promise_1.Promise.reject(new UnknownEndpointError_1.UnknownEndpointError());
            }
        };
        var getPayload = function () {
            var urlParams = new http_1.URLSearchParams();
            urlParams.append("grant_type", "refresh_token");
            if (withRefreshToken) {
                urlParams.append("refresh_token", withRefreshToken);
            }
            else {
                urlParams.append("refresh_token", _this._refreshToken);
            }
            var refreshRequest = {
                encodedParams: urlParams
            };
            return refreshRequest;
        };
        var refreshToken = function (fn, withRefreshToken) {
            return util_1.apiCall({
                url: _this._tokenEndpoint,
                method: 'POST',
                payload: fn(withRefreshToken).encodedParams.toString(),
                jsonBody: true,
                jsonEncoded: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(function (response) {
                tokenRefreshResponse = response.body;
                var user;
                if (_this._user) {
                    _this._user.id = tokenRefreshResponse.patient;
                }
                else {
                    user = {
                        id: tokenRefreshResponse.patient,
                    };
                }
                _this._setLoginData(tokenRefreshResponse.access_token, tokenRefreshResponse.refresh_token, user);
                return es6_promise_1.Promise.resolve(response);
            }).catch(function (error) {
                return es6_promise_1.Promise.reject(error);
            });
        };
        var fetchUserInfo = function () {
            return _this.search("Patient", { _id: _this.user.id }).then(function (response) {
                _this.setUserEmail(response[0].getProperty("telecom")[0].value);
                return es6_promise_1.Promise.resolve(response);
            }).catch(function (error) {
                return es6_promise_1.Promise.reject(error);
            });
        };
        return fetchConformanceStatement().then(function () {
            return refreshToken(getPayload, withRefreshToken);
        }).then(function () {
            return fetchUserInfo();
        }).then(function () {
            return es6_promise_1.Promise.resolve(tokenRefreshResponse);
        }).catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    };
    ;
    /**
     *
     * Query the midata API using FHIR resource types and optional params.
     *
     * @param resourceType The resource to be searched (e.g. Observation)
     * @param params Parameters refining the search call (e.g. {status: 'preliminary'})
     * @return Promise<Resource[]>
     *
     */
    Midata.prototype.search = function (resourceType, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            return es6_promise_1.Promise.reject(new InvalidCallError_1.InvalidCallError("Can't search for records when no user logged in first. Call authenticate() before trying to query the API."));
        }
        var baseUrl = this._host + "/fhir/" + resourceType;
        var tryToMapResponse = function (response) {
            if (response.status === 200) {
                if (response.body.entry != undefined) {
                    try {
                        var mappedResponse = response.body.entry.map(function (e) {
                            return registry_1.fromFhir(e.resource);
                        });
                        return es6_promise_1.Promise.resolve(mappedResponse);
                    }
                    catch (mappingError) {
                        // FHIR's Resource record structure's been violated, throw error
                        throw new MappingError_1.MappingError();
                    }
                }
                else {
                    // No entries found...
                    var entries = [];
                    return es6_promise_1.Promise.resolve(entries);
                }
            }
            else {
                throw new MidataJSError_1.MidataJSError("Unexpected response status code: " + response.status);
            }
        };
        return this._search(baseUrl, params)
            .then(function (response) {
            try {
                return es6_promise_1.Promise.resolve(tryToMapResponse(response));
            }
            catch (error) {
                // Catch and re-throw the error
                return es6_promise_1.Promise.reject(error);
            }
        }, function (error) {
            // Check if the authToken is expired and a refreshToken is available
            if (error.status === 401 && _this.refreshToken) {
                return _this.refresh().then(function () {
                    // If the refresh operation succeeded,
                    // retry the operation 3 times
                    return _this._retry(3, _this._search, baseUrl, params).then(function (response) {
                        try {
                            return es6_promise_1.Promise.resolve(tryToMapResponse(response));
                        }
                        catch (error) {
                            // Catch and re-throw the error.
                            return es6_promise_1.Promise.reject(error);
                        }
                    }).catch(function (error) {
                        // Reject promise with error thrown within retry function
                        return es6_promise_1.Promise.reject(error);
                    });
                }, function (error) {
                    // Refreshing of token failed. Reject
                    return es6_promise_1.Promise.reject(error);
                });
            }
            else {
                // No 401 error or refreshToken not available. Reject and let the client handle...
                return es6_promise_1.Promise.reject(error);
            }
        });
    };
    ;
    /**
     Helper method to query the FHIR API.
     * @param baseUrl for target API Call (e.g. Observation)
     * @param params e.g. {code: '29463-7'} for BodyWeight
     * @return Promise<ApiCallResponse>
     */
    Midata.prototype._search = function (baseUrl, params) {
        if (params === void 0) { params = {}; }
        var queryParts = Object.keys(params).map(function (key) {
            return key + '=' + params[key];
        });
        var query = queryParts.join('&');
        // if 'query' is defined, preset a question mark,
        // otherwise create an empty string...
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
        });
    };
    /**
     Login to the MIDATA platform. This method has to be called prior to
     creating or updating resources. Calling authenticate will initiate the
     oAuth2 authentication process.

     @param withDeviceID Optional parameter to allocate previously granted consents on the platform to this device.
     @return Promise<TokenResponse>
     **/
    Midata.prototype.authenticate = function (withDeviceID) {
        var _this = this;
        if (withDeviceID) {
            if (withDeviceID.length <= 3) {
                return es6_promise_1.Promise.reject(new InvalidCallError_1.InvalidCallError("Device ID must be longer than 3 characters"));
            }
        }
        var fetchConformanceStatement = function () {
            if (_this._conformanceStatementEndpoint !== undefined) {
                if (_this._authEndpoint == undefined || _this._tokenEndpoint == undefined) {
                    return _this.fetchFHIRConformanceStatement().then(function (response) {
                        return es6_promise_1.Promise.resolve(response);
                    });
                }
                else {
                    return es6_promise_1.Promise.resolve({});
                }
            }
            else {
                return es6_promise_1.Promise.reject(new UnknownEndpointError_1.UnknownEndpointError());
            }
        };
        var loginMidata = function (url) {
            return new es6_promise_1.Promise(function (resolve, reject) {
                _this._iab = new ionic_native_1.InAppBrowser(url, '_blank', 'location=yes');
                _this._iab.on('loadstart').subscribe(function (event) {
                    _this._iab.show();
                    if ((event.url).indexOf("http://localhost/callback") === 0) {
                        var _state = event.url.split("&")[0].split("=")[1];
                        if (_state && _state === _this._state) {
                            _this._authCode = event.url.split("&")[1].split("=")[1];
                            _this._iab.close();
                            resolve();
                        }
                        else {
                            _this._iab.close();
                            reject();
                        }
                    }
                }, function () {
                    reject();
                });
                _this._iab.on('exit').subscribe(function () {
                    reject();
                });
            });
        };
        return fetchConformanceStatement()
            .then(function () {
            return _this._initSessionParams(128);
        }).then(function () {
            var url = "\n                     " + _this._authEndpoint + "?response_type=code" +
                ("&client_id=" + _this._appName) +
                "&redirect_uri=http://localhost/callback" +
                ("&aud=" + _this._host + "%2Ffhir") +
                "&scope=user%2F*.*" +
                ("&state=" + _this._state) +
                ("&code_challenge=" + _this._codeChallenge) +
                "&code_challenge_method=S256";
            if (typeof _this._user != "undefined" && typeof _this._user.email != "undefined") {
                url = url + "&email=" + _this._user.email;
            }
            if (typeof _this._user != "undefined" && typeof _this._user.language != "undefined") {
                url = url + "&language=" + _this._user.language;
            }
            if (withDeviceID) {
                url = url + "&device_id=" + withDeviceID;
            }
            return loginMidata(url);
        }).then(function () {
            return _this._exchangeTokenForCode();
        }).then(function (authResponse) {
            return es6_promise_1.Promise.resolve(authResponse);
        }).catch(function (error) {
            console.log(error); // CHECK RESPONSE
            return es6_promise_1.Promise.reject(error);
        });
    };
    ;
    /**
     After successful authentication on midata this method is invoked. It exchanges the authCode
     obtained from midata with the access_token used to query the FHIR endpoint API.

     @return Promise<TokenResponse>
     **/
    Midata.prototype._exchangeTokenForCode = function () {
        var _this = this;
        var getPayload = function () {
            // because of x-www-form-urlencoded
            var urlParams = new http_1.URLSearchParams();
            urlParams.append("grant_type", "authorization_code");
            urlParams.append("code", _this._authCode);
            urlParams.append("redirect_uri", "http://localhost/callback");
            urlParams.append("client_id", _this._appName);
            urlParams.append("code_verifier", _this._codeVerifier);
            var refreshRequest = {
                encodedParams: urlParams
            };
            return refreshRequest;
        };
        var authResponse;
        var exchangeToken = function () {
            return util_1.apiCall({
                url: _this._tokenEndpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                jsonBody: true,
                payload: getPayload().encodedParams.toString(),
                jsonEncoded: false
            })
                .then(function (response) {
                authResponse = response.body;
                var user;
                if (_this._user) {
                    _this._user.id = authResponse.patient;
                }
                else {
                    user = {
                        id: authResponse.patient,
                    };
                }
                _this._setLoginData(authResponse.access_token, authResponse.refresh_token, user);
                return es6_promise_1.Promise.resolve(response);
            }).catch(function (error) {
                return es6_promise_1.Promise.reject(error);
            });
        };
        var fetchUserInfo = function () {
            return _this.search("Patient", { _id: _this.user.id }).then(function (response) {
                _this.setUserEmail(response[0].getProperty("telecom")[0].value);
                return es6_promise_1.Promise.resolve(response);
            });
        };
        return exchangeToken().then(function () {
            return fetchUserInfo();
        }).then(function () {
            return es6_promise_1.Promise.resolve(authResponse);
        }).catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    };
    ;
    /**
     Helper method to initialize the params used during the oAuth2 authentication process.

     @return Promise<void>
     **/
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
                    resolve();
                });
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    ;
    /**
     Helper method to generate a random string with a given length.
     @param length Length of the string to be generated
     @return Promise<string>
     **/
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
                reject(new InvalidCallError_1.InvalidCallError('Argument length in function call undefined or < 0'));
            }
        });
    };
    ;
    /**
     This method fetches the conformance statement identifying the OAuth authorize
     and token endpoint URLs for use in requesting authorization to access FHIR resources.
     This method is invoked whenever a new midata object is created. However, it can also
     exclusively be called in order to update existing endpoint information.

     @return Promise<Resource>
     **/
    Midata.prototype.fetchFHIRConformanceStatement = function () {
        var _this = this;
        var tryToMapResponse = function (response) {
            if (response.status === 200) {
                try {
                    response.body = registry_1.fromFhir(JSON.parse(response.body));
                    return response.body;
                }
                catch (mappingError) {
                    // FHIR's Resource record structure's been violated, throw error
                    throw new MappingError_1.MappingError();
                }
            }
            else {
                throw new MidataJSError_1.MidataJSError("Unexpected response status code: " + response.status);
            }
        };
        return util_1.apiCall({
            url: this._conformanceStatementEndpoint,
            method: 'GET'
        }).then(function (response) {
            return tryToMapResponse(response);
        }).then(function (resource) {
            _this._tokenEndpoint = resource.getProperty("rest")["0"].security.extension["0"].extension["0"].valueUri;
            _this._authEndpoint = resource.getProperty("rest")["0"].security.extension["0"].extension["1"].valueUri;
            return es6_promise_1.Promise.resolve(resource);
        }).catch(function (error) {
            console.log(error);
            return es6_promise_1.Promise.reject(error);
        });
    };
    ;
    return Midata;
}());
exports.Midata = Midata;
;
//# sourceMappingURL=Midata.js.map