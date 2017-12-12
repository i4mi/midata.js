(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("midata", [], factory);
	else if(typeof exports === 'object')
		exports["midata"] = factory();
	else
		root["midata"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	var Midata_1 = __webpack_require__(1);
	exports.Midata = Midata_1.Midata;
	__export(__webpack_require__(13));
	var resources = __webpack_require__(13);
	exports.resources = resources;
	__export(__webpack_require__(29));
	var errors = __webpack_require__(29);
	exports.errors = errors;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError_1 = __webpack_require__(2);
	var MappingError_1 = __webpack_require__(3);
	var UnknownEndpointError_1 = __webpack_require__(4);
	var InvalidCallError_1 = __webpack_require__(5);
	var es6_promise_1 = __webpack_require__(6);
	var util_1 = __webpack_require__(9);
	var ionic_native_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ionic-native\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var http_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"@angular/http\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var registry_1 = __webpack_require__(10);
	var Resource_1 = __webpack_require__(11);
	var jsSHA = __webpack_require__(12);
	var Midata = /** @class */ (function () {
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
	            return es6_promise_1.Promise.reject(error);
	        });
	    };
	    ;
	    return Midata;
	}());
	exports.Midata = Midata;
	;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError = /** @class */ (function (_super) {
	    __extends(MidataJSError, _super);
	    function MidataJSError(message) {
	        var _this = _super.call(this, message || 'Internal MIDATA.js error') || this;
	        _this.name = _this.constructor.name;
	        Object.setPrototypeOf(_this, MidataJSError.prototype);
	        return _this;
	    }
	    return MidataJSError;
	}(Error));
	exports.MidataJSError = MidataJSError;
	;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError_1 = __webpack_require__(2);
	var MappingError = /** @class */ (function (_super) {
	    __extends(MappingError, _super);
	    function MappingError(message) {
	        var _this = _super.call(this, message || 'Mapping failure due to FHIR Resource structure violation') || this;
	        Object.setPrototypeOf(_this, MappingError.prototype);
	        return _this;
	    }
	    ;
	    return MappingError;
	}(MidataJSError_1.MidataJSError));
	exports.MappingError = MappingError;
	;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError_1 = __webpack_require__(2);
	var UnknownEndpointError = /** @class */ (function (_super) {
	    __extends(UnknownEndpointError, _super);
	    function UnknownEndpointError(message) {
	        var _this = _super.call(this, message || 'MIDATA conformance statement endpoint unknown! Try calling changePlatform() with a valid endpoint in order to fix this issue') || this;
	        Object.setPrototypeOf(_this, UnknownEndpointError.prototype);
	        return _this;
	    }
	    ;
	    return UnknownEndpointError;
	}(MidataJSError_1.MidataJSError));
	exports.UnknownEndpointError = UnknownEndpointError;
	;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError_1 = __webpack_require__(2);
	var InvalidCallError = /** @class */ (function (_super) {
	    __extends(InvalidCallError, _super);
	    function InvalidCallError(message) {
	        var _this = _super.call(this, message || 'The operation failed due to faulty function call ') || this;
	        Object.setPrototypeOf(_this, InvalidCallError.prototype);
	        return _this;
	    }
	    ;
	    return InvalidCallError;
	}(MidataJSError_1.MidataJSError));
	exports.InvalidCallError = InvalidCallError;
	;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   4.1.1
	 */
	
	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.ES6Promise = factory());
	}(this, (function () { 'use strict';
	
	function objectOrFunction(x) {
	  var type = typeof x;
	  return x !== null && (type === 'object' || type === 'function');
	}
	
	function isFunction(x) {
	  return typeof x === 'function';
	}
	
	var _isArray = undefined;
	if (Array.isArray) {
	  _isArray = Array.isArray;
	} else {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	}
	
	var isArray = _isArray;
	
	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;
	
	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};
	
	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}
	
	function setAsap(asapFn) {
	  asap = asapFn;
	}
	
	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';
	
	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
	
	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}
	
	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }
	
	  return useSetTimeout();
	}
	
	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });
	
	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}
	
	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}
	
	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}
	
	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];
	
	    callback(arg);
	
	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }
	
	  len = 0;
	}
	
	function attemptVertx() {
	  try {
	    var r = require;
	    var vertx = __webpack_require__(8);
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}
	
	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}
	
	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;
	
	  var parent = this;
	
	  var child = new this.constructor(noop);
	
	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }
	
	  var _state = parent._state;
	
	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }
	
	  return child;
	}
	
	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:
	
	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });
	
	  promise.then(function(value){
	    // value === 1
	  });
	  ```
	
	  Instead of writing the above, your code now simply becomes the following:
	
	  ```javascript
	  let promise = Promise.resolve(1);
	
	  promise.then(function(value){
	    // value === 1
	  });
	  ```
	
	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve$1(object) {
	  /*jshint validthis:true */
	  var Constructor = this;
	
	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }
	
	  var promise = new Constructor(noop);
	  resolve(promise, object);
	  return promise;
	}
	
	var PROMISE_ID = Math.random().toString(36).substring(16);
	
	function noop() {}
	
	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	
	var GET_THEN_ERROR = new ErrorObject();
	
	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}
	
	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}
	
	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}
	
	function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then$$1.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}
	
	function handleForeignThenable(promise, thenable, then$$1) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then$$1, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	
	      reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	    if (!sealed && error) {
	      sealed = true;
	      reject(promise, error);
	    }
	  }, promise);
	}
	
	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return resolve(promise, value);
	    }, function (reason) {
	      return reject(promise, reason);
	    });
	  }
	}
	
	function handleMaybeThenable(promise, maybeThenable, then$$1) {
	  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$1 === GET_THEN_ERROR) {
	      reject(promise, GET_THEN_ERROR.error);
	      GET_THEN_ERROR.error = null;
	    } else if (then$$1 === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$1)) {
	      handleForeignThenable(promise, maybeThenable, then$$1);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}
	
	function resolve(promise, value) {
	  if (promise === value) {
	    reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}
	
	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }
	
	  publish(promise);
	}
	
	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	
	  promise._result = value;
	  promise._state = FULFILLED;
	
	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}
	
	function reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;
	
	  asap(publishRejection, promise);
	}
	
	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;
	
	  parent._onerror = null;
	
	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;
	
	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}
	
	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;
	
	  if (subscribers.length === 0) {
	    return;
	  }
	
	  var child = undefined,
	      callback = undefined,
	      detail = promise._result;
	
	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];
	
	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }
	
	  promise._subscribers.length = 0;
	}
	
	function ErrorObject() {
	  this.error = null;
	}
	
	var TRY_CATCH_ERROR = new ErrorObject();
	
	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}
	
	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;
	
	  if (hasCallback) {
	    value = tryCatch(callback, detail);
	
	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value.error = null;
	    } else {
	      succeeded = true;
	    }
	
	    if (promise === value) {
	      reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }
	
	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      resolve(promise, value);
	    } else if (failed) {
	      reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      reject(promise, value);
	    }
	}
	
	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      resolve(promise, value);
	    }, function rejectPromise(reason) {
	      reject(promise, reason);
	    });
	  } catch (e) {
	    reject(promise, e);
	  }
	}
	
	var id = 0;
	function nextId() {
	  return id++;
	}
	
	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}
	
	function Enumerator$1(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);
	
	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }
	
	  if (isArray(input)) {
	    this.length = input.length;
	    this._remaining = input.length;
	
	    this._result = new Array(this.length);
	
	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate(input);
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    reject(this.promise, validationError());
	  }
	}
	
	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	}
	
	Enumerator$1.prototype._enumerate = function (input) {
	  for (var i = 0; this._state === PENDING && i < input.length; i++) {
	    this._eachEntry(input[i], i);
	  }
	};
	
	Enumerator$1.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$1 = c.resolve;
	
	  if (resolve$$1 === resolve$1) {
	    var _then = getThen(entry);
	
	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise$2) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$1) {
	        return resolve$$1(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$1(entry), i);
	  }
	};
	
	Enumerator$1.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;
	
	  if (promise._state === PENDING) {
	    this._remaining--;
	
	    if (state === REJECTED) {
	      reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }
	
	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};
	
	Enumerator$1.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;
	
	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};
	
	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.
	
	  Example:
	
	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];
	
	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```
	
	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:
	
	  Example:
	
	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];
	
	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```
	
	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all$1(entries) {
	  return new Enumerator$1(this, entries).promise;
	}
	
	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.
	
	  Example:
	
	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });
	
	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });
	
	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```
	
	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:
	
	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });
	
	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });
	
	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```
	
	  An example real-world use case is implementing timeouts:
	
	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```
	
	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race$1(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;
	
	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}
	
	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:
	
	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  Instead of writing the above, your code now simply becomes the following:
	
	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject$1(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  reject(promise, reason);
	  return promise;
	}
	
	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}
	
	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}
	
	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.
	
	  Terminology
	  -----------
	
	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.
	
	  A promise can be in one of three states: pending, fulfilled, or rejected.
	
	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.
	
	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.
	
	
	  Basic Usage:
	  ------------
	
	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);
	
	    // on failure
	    reject(reason);
	  });
	
	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```
	
	  Advanced Usage:
	  ---------------
	
	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.
	
	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();
	
	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();
	
	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }
	
	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```
	
	  Unlike callbacks, promises are great composable primitives.
	
	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON
	
	    return values;
	  });
	  ```
	
	  @class Promise
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise$2(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];
	
	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
	  }
	}
	
	Promise$2.all = all$1;
	Promise$2.race = race$1;
	Promise$2.resolve = resolve$1;
	Promise$2.reject = reject$1;
	Promise$2._setScheduler = setScheduler;
	Promise$2._setAsap = setAsap;
	Promise$2._asap = asap;
	
	Promise$2.prototype = {
	  constructor: Promise$2,
	
	  /**
	    The primary way of interacting with a promise is through its `then` method,
	    which registers callbacks to receive either a promise's eventual value or the
	    reason why the promise cannot be fulfilled.
	  
	    ```js
	    findUser().then(function(user){
	      // user is available
	    }, function(reason){
	      // user is unavailable, and you are given the reason why
	    });
	    ```
	  
	    Chaining
	    --------
	  
	    The return value of `then` is itself a promise.  This second, 'downstream'
	    promise is resolved with the return value of the first promise's fulfillment
	    or rejection handler, or rejected if the handler throws an exception.
	  
	    ```js
	    findUser().then(function (user) {
	      return user.name;
	    }, function (reason) {
	      return 'default name';
	    }).then(function (userName) {
	      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	      // will be `'default name'`
	    });
	  
	    findUser().then(function (user) {
	      throw new Error('Found user, but still unhappy');
	    }, function (reason) {
	      throw new Error('`findUser` rejected and we're unhappy');
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	    });
	    ```
	    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
	    ```js
	    findUser().then(function (user) {
	      throw new PedagogicalException('Upstream error');
	    }).then(function (value) {
	      // never reached
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // The `PedgagocialException` is propagated all the way down to here
	    });
	    ```
	  
	    Assimilation
	    ------------
	  
	    Sometimes the value you want to propagate to a downstream promise can only be
	    retrieved asynchronously. This can be achieved by returning a promise in the
	    fulfillment or rejection handler. The downstream promise will then be pending
	    until the returned promise is settled. This is called *assimilation*.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // The user's comments are now available
	    });
	    ```
	  
	    If the assimliated promise rejects, then the downstream promise will also reject.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // If `findCommentsByAuthor` fulfills, we'll have the value here
	    }, function (reason) {
	      // If `findCommentsByAuthor` rejects, we'll have the reason here
	    });
	    ```
	  
	    Simple Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let result;
	  
	    try {
	      result = findResult();
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	    findResult(function(result, err){
	      if (err) {
	        // failure
	      } else {
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findResult().then(function(result){
	      // success
	    }, function(reason){
	      // failure
	    });
	    ```
	  
	    Advanced Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let author, books;
	  
	    try {
	      author = findAuthor();
	      books  = findBooksByAuthor(author);
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	  
	    function foundBooks(books) {
	  
	    }
	  
	    function failure(reason) {
	  
	    }
	  
	    findAuthor(function(author, err){
	      if (err) {
	        failure(err);
	        // failure
	      } else {
	        try {
	          findBoooksByAuthor(author, function(books, err) {
	            if (err) {
	              failure(err);
	            } else {
	              try {
	                foundBooks(books);
	              } catch(reason) {
	                failure(reason);
	              }
	            }
	          });
	        } catch(error) {
	          failure(err);
	        }
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findAuthor().
	      then(findBooksByAuthor).
	      then(function(books){
	        // found books
	    }).catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method then
	    @param {Function} onFulfilled
	    @param {Function} onRejected
	    Useful for tooling.
	    @return {Promise}
	  */
	  then: then,
	
	  /**
	    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	    as the catch block of a try/catch statement.
	  
	    ```js
	    function findAuthor(){
	      throw new Error('couldn't find that author');
	    }
	  
	    // synchronous
	    try {
	      findAuthor();
	    } catch(reason) {
	      // something went wrong
	    }
	  
	    // async with promises
	    findAuthor().catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method catch
	    @param {Function} onRejection
	    Useful for tooling.
	    @return {Promise}
	  */
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};
	
	/*global self*/
	function polyfill$1() {
	    var local = undefined;
	
	    if (typeof global !== 'undefined') {
	        local = global;
	    } else if (typeof self !== 'undefined') {
	        local = self;
	    } else {
	        try {
	            local = Function('return this')();
	        } catch (e) {
	            throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	    }
	
	    var P = local.Promise;
	
	    if (P) {
	        var promiseToString = null;
	        try {
	            promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {
	            // silently ignored
	        }
	
	        if (promiseToString === '[object Promise]' && !P.cast) {
	            return;
	        }
	    }
	
	    local.Promise = Promise$2;
	}
	
	// Strange compat..
	Promise$2.polyfill = polyfill$1;
	Promise$2.Promise = Promise$2;
	
	return Promise$2;
	
	})));
	
	//# sourceMappingURL=es6-promise.map
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), (function() { return this; }())))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var es6_promise_1 = __webpack_require__(6);
	;
	;
	// TODO: Either the payload should be anything and the user has to
	// specify the content-type via the headers arg or it should always
	// be JSON in which case the user shouldn't need to specify the content-type
	// to be application/json.
	/**
	 * Perform an AJAX call to an API endpoint.
	 * @param args The arguments for the call.
	 * @return A promise holding an object of structure ApiCallResponse.
	 */
	function apiCall(args) {
	    var url = args.url;
	    var method = args.method;
	    var payload = args.payload;
	    var headers = args.headers;
	    var jsonBody = args.jsonBody || false;
	    var jsonEncoded = args.jsonEncoded; // flag indicating json-encoding
	    var DEFAULT_TIMEOUT = 20000;
	    return new es6_promise_1.Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        xhr.open(method, url, true);
	        xhr.timeout = DEFAULT_TIMEOUT;
	        if (headers) {
	            Object.keys(headers).forEach(function (key) {
	                xhr.setRequestHeader(key, headers[key]);
	            });
	        }
	        xhr.onload = function () {
	            var status = xhr.status;
	            if (status >= 200 && status < 300) {
	                var body = void 0;
	                if (jsonBody) {
	                    body = JSON.parse(xhr.responseText);
	                }
	                else {
	                    body = xhr.responseText;
	                }
	                resolve({
	                    message: 'Request successful',
	                    body: body,
	                    status: status
	                });
	            }
	            else {
	                reject({
	                    message: xhr.statusText,
	                    body: xhr.responseText,
	                    status: status
	                });
	            }
	        };
	        xhr.ontimeout = function () {
	            reject({
	                message: 'Request timed out. No answer from server received',
	                body: '',
	                status: -1
	            });
	        };
	        xhr.onerror = function () {
	            reject({
	                message: 'Error. transaction failed',
	                body: '',
	                status: 0
	            });
	        };
	        // NOTE: Note that the payload should probably be stringified
	        // before being passed into this function in order to allow
	        // non-json encodings of the payload (such as url-encoded or plain text).
	        // Supplement wya3: Check for JSON encoding. Additionally check if undefined in
	        // order to ensure backward compatibility.
	        if (payload !== undefined) {
	            if (jsonEncoded || jsonEncoded == undefined) {
	                xhr.send(JSON.stringify(payload));
	            }
	            else {
	                xhr.send(payload);
	            }
	        }
	        else {
	            xhr.send();
	        }
	    });
	}
	exports.apiCall = apiCall;
	;
	/**
	 * Generates a Base64 encoded string URL friendly,
	 * i.e. '+' and '/' are replaced with '-' and '_' also any trailing '='
	 * characters are removed
	 *
	 * @param str str the encoded string
	 * @return str the URL friendly encoded String
	 */
	function base64EncodeURL(str) {
	    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
	}
	exports.base64EncodeURL = base64EncodeURL;
	;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var registry = {
	    codes: [],
	    resourceTypes: []
	};
	function registerResource(type, key) {
	    return function (cls) {
	        if (type === "code") {
	            registry.codes[key] = cls;
	        }
	        else if (type === "resourceType") {
	            registry.resourceTypes[key] = cls;
	        }
	        w.cls = cls;
	    };
	}
	exports.registerResource = registerResource;
	;
	/**
	 * Create a resource with the type of the constructor
	 * function `cls`.
	 */
	function fromFhir(fhirObject) {
	    var tryToMap = fhirObject.code !== undefined
	        && fhirObject.code.coding !== undefined
	        && fhirObject.code.coding.length == 1
	        && fhirObject.code.coding[0].code !== undefined;
	    var mappingExists = false;
	    if (tryToMap) {
	        var coding = fhirObject.code.coding[0].code;
	        mappingExists = registry.codes[coding] !== undefined;
	    }
	    if (mappingExists) {
	        var coding = fhirObject.code.coding[0].code;
	        var resource = {
	            _fhir: fhirObject
	        };
	        var cls = registry.codes[coding];
	        resource.__proto__ = cls.prototype;
	        return resource;
	    }
	    else if (fhirObject.resourceType !== undefined) {
	        // If no mapping key for type code exists try to map the resource according to it's resourceType
	        // NOTE: Each record should have a resourceType at least. If not, throw an exception.
	        var tryToMap_1 = fhirObject.resourceType !== undefined;
	        var mappingExists = false;
	        if (tryToMap_1) {
	            var coding = fhirObject.resourceType;
	            mappingExists = registry.resourceTypes[coding] !== undefined;
	        }
	        if (mappingExists) {
	            var coding = fhirObject.resourceType;
	            var resource = {
	                _fhir: fhirObject
	            };
	            var cls = registry.resourceTypes[coding];
	            resource.__proto__ = cls.prototype;
	            return resource;
	        }
	        else {
	            // Resource type not in registry, map to base class 'resource'
	            var resource = {
	                _fhir: fhirObject
	            };
	            var cls = registry.resourceTypes["Resource"];
	            resource.__proto__ = cls.prototype;
	            return resource;
	        }
	    }
	    else {
	        // Property 'resourceType' not available, throw an error...
	        throw new Error("Mapping error: Invalid object structure!");
	    }
	}
	exports.fromFhir = fromFhir;
	var w = window;
	w.fromFhir = fromFhir;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var registry_1 = __webpack_require__(10);
	var Resource = /** @class */ (function () {
	    function Resource(resourceType) {
	        this._fhir = {};
	        this._fhir.resourceType = resourceType;
	    }
	    Resource.prototype.getProperty = function (property) {
	        return this._fhir[property];
	    };
	    Resource.prototype.addProperty = function (property, value) {
	        this._fhir[property] = value;
	    };
	    Resource.prototype.removeProperty = function (key) {
	        delete this._fhir[key];
	    };
	    Resource.prototype.toJson = function () {
	        return this._fhir;
	    };
	    Object.defineProperty(Resource.prototype, "id", {
	        get: function () {
	            return this._fhir.id;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Resource.prototype.setRelativeId = function (idParam) {
	        this._fhir.id = idParam;
	    };
	    Object.defineProperty(Resource.prototype, "resourceType", {
	        get: function () {
	            return this._fhir.resourceType;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Resource.prototype, "reference", {
	        get: function () {
	            return this._fhir.resourceType + "/" + this._fhir.id;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Resource = __decorate([
	        registry_1.registerResource('resourceType', 'Resource')
	    ], Resource);
	    return Resource;
	}());
	exports.Resource = Resource;
	;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 A JavaScript implementation of the SHA family of hashes, as
	 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
	 HMAC implementation as defined in FIPS PUB 198a
	
	 Copyright Brian Turek 2008-2017
	 Distributed under the BSD License
	 See http://caligatio.github.com/jsSHA/ for more information
	
	 Several functions taken from Paul Johnston
	*/
	'use strict';(function(Y){function C(c,a,b){var e=0,h=[],n=0,g,l,d,f,m,q,u,r,I=!1,v=[],w=[],t,y=!1,z=!1,x=-1;b=b||{};g=b.encoding||"UTF8";t=b.numRounds||1;if(t!==parseInt(t,10)||1>t)throw Error("numRounds must a integer >= 1");if("SHA-1"===c)m=512,q=K,u=Z,f=160,r=function(a){return a.slice()};else if(0===c.lastIndexOf("SHA-",0))if(q=function(a,b){return L(a,b,c)},u=function(a,b,h,e){var k,f;if("SHA-224"===c||"SHA-256"===c)k=(b+65>>>9<<4)+15,f=16;else if("SHA-384"===c||"SHA-512"===c)k=(b+129>>>10<<
	5)+31,f=32;else throw Error("Unexpected error in SHA-2 implementation");for(;a.length<=k;)a.push(0);a[b>>>5]|=128<<24-b%32;b=b+h;a[k]=b&4294967295;a[k-1]=b/4294967296|0;h=a.length;for(b=0;b<h;b+=f)e=L(a.slice(b,b+f),e,c);if("SHA-224"===c)a=[e[0],e[1],e[2],e[3],e[4],e[5],e[6]];else if("SHA-256"===c)a=e;else if("SHA-384"===c)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b];else if("SHA-512"===c)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,
	e[4].b,e[5].a,e[5].b,e[6].a,e[6].b,e[7].a,e[7].b];else throw Error("Unexpected error in SHA-2 implementation");return a},r=function(a){return a.slice()},"SHA-224"===c)m=512,f=224;else if("SHA-256"===c)m=512,f=256;else if("SHA-384"===c)m=1024,f=384;else if("SHA-512"===c)m=1024,f=512;else throw Error("Chosen SHA variant is not supported");else if(0===c.lastIndexOf("SHA3-",0)||0===c.lastIndexOf("SHAKE",0)){var F=6;q=D;r=function(a){var c=[],e;for(e=0;5>e;e+=1)c[e]=a[e].slice();return c};x=1;if("SHA3-224"===
	c)m=1152,f=224;else if("SHA3-256"===c)m=1088,f=256;else if("SHA3-384"===c)m=832,f=384;else if("SHA3-512"===c)m=576,f=512;else if("SHAKE128"===c)m=1344,f=-1,F=31,z=!0;else if("SHAKE256"===c)m=1088,f=-1,F=31,z=!0;else throw Error("Chosen SHA variant is not supported");u=function(a,c,e,b,h){e=m;var k=F,f,g=[],n=e>>>5,l=0,d=c>>>5;for(f=0;f<d&&c>=e;f+=n)b=D(a.slice(f,f+n),b),c-=e;a=a.slice(f);for(c%=e;a.length<n;)a.push(0);f=c>>>3;a[f>>2]^=k<<f%4*8;a[n-1]^=2147483648;for(b=D(a,b);32*g.length<h;){a=b[l%
	5][l/5|0];g.push(a.b);if(32*g.length>=h)break;g.push(a.a);l+=1;0===64*l%e&&D(null,b)}return g}}else throw Error("Chosen SHA variant is not supported");d=M(a,g,x);l=A(c);this.setHMACKey=function(a,b,h){var k;if(!0===I)throw Error("HMAC key already set");if(!0===y)throw Error("Cannot set HMAC key after calling update");if(!0===z)throw Error("SHAKE is not supported for HMAC");g=(h||{}).encoding||"UTF8";b=M(b,g,x)(a);a=b.binLen;b=b.value;k=m>>>3;h=k/4-1;if(k<a/8){for(b=u(b,a,0,A(c),f);b.length<=h;)b.push(0);
	b[h]&=4294967040}else if(k>a/8){for(;b.length<=h;)b.push(0);b[h]&=4294967040}for(a=0;a<=h;a+=1)v[a]=b[a]^909522486,w[a]=b[a]^1549556828;l=q(v,l);e=m;I=!0};this.update=function(a){var c,b,k,f=0,g=m>>>5;c=d(a,h,n);a=c.binLen;b=c.value;c=a>>>5;for(k=0;k<c;k+=g)f+m<=a&&(l=q(b.slice(k,k+g),l),f+=m);e+=f;h=b.slice(f>>>5);n=a%m;y=!0};this.getHash=function(a,b){var k,g,d,m;if(!0===I)throw Error("Cannot call getHash after setting HMAC key");d=N(b);if(!0===z){if(-1===d.shakeLen)throw Error("shakeLen must be specified in options");
	f=d.shakeLen}switch(a){case "HEX":k=function(a){return O(a,f,x,d)};break;case "B64":k=function(a){return P(a,f,x,d)};break;case "BYTES":k=function(a){return Q(a,f,x)};break;case "ARRAYBUFFER":try{g=new ArrayBuffer(0)}catch(p){throw Error("ARRAYBUFFER not supported by this environment");}k=function(a){return R(a,f,x)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}m=u(h.slice(),n,e,r(l),f);for(g=1;g<t;g+=1)!0===z&&0!==f%32&&(m[m.length-1]&=16777215>>>24-f%32),m=u(m,f,
	0,A(c),f);return k(m)};this.getHMAC=function(a,b){var k,g,d,p;if(!1===I)throw Error("Cannot call getHMAC without first setting HMAC key");d=N(b);switch(a){case "HEX":k=function(a){return O(a,f,x,d)};break;case "B64":k=function(a){return P(a,f,x,d)};break;case "BYTES":k=function(a){return Q(a,f,x)};break;case "ARRAYBUFFER":try{k=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}k=function(a){return R(a,f,x)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
	}g=u(h.slice(),n,e,r(l),f);p=q(w,A(c));p=u(g,f,m,p,f);return k(p)}}function b(c,a){this.a=c;this.b=a}function O(c,a,b,e){var h="";a/=8;var n,g,d;d=-1===b?3:0;for(n=0;n<a;n+=1)g=c[n>>>2]>>>8*(d+n%4*b),h+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return e.outputUpper?h.toUpperCase():h}function P(c,a,b,e){var h="",n=a/8,g,d,p,f;f=-1===b?3:0;for(g=0;g<n;g+=3)for(d=g+1<n?c[g+1>>>2]:0,p=g+2<n?c[g+2>>>2]:0,p=(c[g>>>2]>>>8*(f+g%4*b)&255)<<16|(d>>>8*(f+(g+1)%4*b)&255)<<8|p>>>8*(f+
	(g+2)%4*b)&255,d=0;4>d;d+=1)8*g+6*d<=a?h+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(p>>>6*(3-d)&63):h+=e.b64Pad;return h}function Q(c,a,b){var e="";a/=8;var h,d,g;g=-1===b?3:0;for(h=0;h<a;h+=1)d=c[h>>>2]>>>8*(g+h%4*b)&255,e+=String.fromCharCode(d);return e}function R(c,a,b){a/=8;var e,h=new ArrayBuffer(a),d,g;g=new Uint8Array(h);d=-1===b?3:0;for(e=0;e<a;e+=1)g[e]=c[e>>>2]>>>8*(d+e%4*b)&255;return h}function N(c){var a={outputUpper:!1,b64Pad:"=",shakeLen:-1};c=c||{};
	a.outputUpper=c.outputUpper||!1;!0===c.hasOwnProperty("b64Pad")&&(a.b64Pad=c.b64Pad);if(!0===c.hasOwnProperty("shakeLen")){if(0!==c.shakeLen%8)throw Error("shakeLen must be a multiple of 8");a.shakeLen=c.shakeLen}if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function M(c,a,b){switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
	}switch(c){case "HEX":c=function(a,c,d){var g=a.length,l,p,f,m,q,u;if(0!==g%2)throw Error("String of HEX type must be in byte increments");c=c||[0];d=d||0;q=d>>>3;u=-1===b?3:0;for(l=0;l<g;l+=2){p=parseInt(a.substr(l,2),16);if(isNaN(p))throw Error("String of HEX type contains invalid characters");m=(l>>>1)+q;for(f=m>>>2;c.length<=f;)c.push(0);c[f]|=p<<8*(u+m%4*b)}return{value:c,binLen:4*g+d}};break;case "TEXT":c=function(c,h,d){var g,l,p=0,f,m,q,u,r,t;h=h||[0];d=d||0;q=d>>>3;if("UTF8"===a)for(t=-1===
	b?3:0,f=0;f<c.length;f+=1)for(g=c.charCodeAt(f),l=[],128>g?l.push(g):2048>g?(l.push(192|g>>>6),l.push(128|g&63)):55296>g||57344<=g?l.push(224|g>>>12,128|g>>>6&63,128|g&63):(f+=1,g=65536+((g&1023)<<10|c.charCodeAt(f)&1023),l.push(240|g>>>18,128|g>>>12&63,128|g>>>6&63,128|g&63)),m=0;m<l.length;m+=1){r=p+q;for(u=r>>>2;h.length<=u;)h.push(0);h[u]|=l[m]<<8*(t+r%4*b);p+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(t=-1===b?2:0,l="UTF16LE"===a&&1!==b||"UTF16LE"!==a&&1===b,f=0;f<c.length;f+=1){g=c.charCodeAt(f);
	!0===l&&(m=g&255,g=m<<8|g>>>8);r=p+q;for(u=r>>>2;h.length<=u;)h.push(0);h[u]|=g<<8*(t+r%4*b);p+=2}return{value:h,binLen:8*p+d}};break;case "B64":c=function(a,c,d){var g=0,l,p,f,m,q,u,r,t;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");p=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==p&&p<a.length)throw Error("Invalid '=' found in base-64 string");c=c||[0];d=d||0;u=d>>>3;t=-1===b?3:0;for(p=0;p<a.length;p+=4){q=a.substr(p,4);for(f=m=0;f<q.length;f+=1)l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[f]),
	m|=l<<18-6*f;for(f=0;f<q.length-1;f+=1){r=g+u;for(l=r>>>2;c.length<=l;)c.push(0);c[l]|=(m>>>16-8*f&255)<<8*(t+r%4*b);g+=1}}return{value:c,binLen:8*g+d}};break;case "BYTES":c=function(a,c,d){var g,l,p,f,m,q;c=c||[0];d=d||0;p=d>>>3;q=-1===b?3:0;for(l=0;l<a.length;l+=1)g=a.charCodeAt(l),m=l+p,f=m>>>2,c.length<=f&&c.push(0),c[f]|=g<<8*(q+m%4*b);return{value:c,binLen:8*a.length+d}};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(e){throw Error("ARRAYBUFFER not supported by this environment");}c=
	function(a,c,d){var g,l,p,f,m,q;c=c||[0];d=d||0;l=d>>>3;m=-1===b?3:0;q=new Uint8Array(a);for(g=0;g<a.byteLength;g+=1)f=g+l,p=f>>>2,c.length<=p&&c.push(0),c[p]|=q[g]<<8*(m+f%4*b);return{value:c,binLen:8*a.byteLength+d}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return c}function y(c,a){return c<<a|c>>>32-a}function S(c,a){return 32<a?(a-=32,new b(c.b<<a|c.a>>>32-a,c.a<<a|c.b>>>32-a)):0!==a?new b(c.a<<a|c.b>>>32-a,c.b<<a|c.a>>>32-a):c}function w(c,a){return c>>>
	a|c<<32-a}function t(c,a){var k=null,k=new b(c.a,c.b);return k=32>=a?new b(k.a>>>a|k.b<<32-a&4294967295,k.b>>>a|k.a<<32-a&4294967295):new b(k.b>>>a-32|k.a<<64-a&4294967295,k.a>>>a-32|k.b<<64-a&4294967295)}function T(c,a){var k=null;return k=32>=a?new b(c.a>>>a,c.b>>>a|c.a<<32-a&4294967295):new b(0,c.a>>>a-32)}function aa(c,a,b){return c&a^~c&b}function ba(c,a,k){return new b(c.a&a.a^~c.a&k.a,c.b&a.b^~c.b&k.b)}function U(c,a,b){return c&a^c&b^a&b}function ca(c,a,k){return new b(c.a&a.a^c.a&k.a^a.a&
	k.a,c.b&a.b^c.b&k.b^a.b&k.b)}function da(c){return w(c,2)^w(c,13)^w(c,22)}function ea(c){var a=t(c,28),k=t(c,34);c=t(c,39);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function fa(c){return w(c,6)^w(c,11)^w(c,25)}function ga(c){var a=t(c,14),k=t(c,18);c=t(c,41);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function ha(c){return w(c,7)^w(c,18)^c>>>3}function ia(c){var a=t(c,1),k=t(c,8);c=T(c,7);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function ja(c){return w(c,17)^w(c,19)^c>>>10}function ka(c){var a=t(c,19),k=t(c,61);
	c=T(c,6);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function G(c,a){var b=(c&65535)+(a&65535);return((c>>>16)+(a>>>16)+(b>>>16)&65535)<<16|b&65535}function la(c,a,b,e){var h=(c&65535)+(a&65535)+(b&65535)+(e&65535);return((c>>>16)+(a>>>16)+(b>>>16)+(e>>>16)+(h>>>16)&65535)<<16|h&65535}function H(c,a,b,e,h){var d=(c&65535)+(a&65535)+(b&65535)+(e&65535)+(h&65535);return((c>>>16)+(a>>>16)+(b>>>16)+(e>>>16)+(h>>>16)+(d>>>16)&65535)<<16|d&65535}function ma(c,a){var d,e,h;d=(c.b&65535)+(a.b&65535);e=(c.b>>>16)+
	(a.b>>>16)+(d>>>16);h=(e&65535)<<16|d&65535;d=(c.a&65535)+(a.a&65535)+(e>>>16);e=(c.a>>>16)+(a.a>>>16)+(d>>>16);return new b((e&65535)<<16|d&65535,h)}function na(c,a,d,e){var h,n,g;h=(c.b&65535)+(a.b&65535)+(d.b&65535)+(e.b&65535);n=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(h>>>16);g=(n&65535)<<16|h&65535;h=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(n>>>16);n=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(h>>>16);return new b((n&65535)<<16|h&65535,g)}function oa(c,a,d,e,h){var n,g,l;n=(c.b&
	65535)+(a.b&65535)+(d.b&65535)+(e.b&65535)+(h.b&65535);g=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(h.b>>>16)+(n>>>16);l=(g&65535)<<16|n&65535;n=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(h.a&65535)+(g>>>16);g=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(h.a>>>16)+(n>>>16);return new b((g&65535)<<16|n&65535,l)}function B(c,a){return new b(c.a^a.a,c.b^a.b)}function A(c){var a=[],d;if("SHA-1"===c)a=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===c.lastIndexOf("SHA-",0))switch(a=
	[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c){case "SHA-224":break;case "SHA-256":a=d;break;case "SHA-384":a=[new b(3418070365,a[0]),new b(1654270250,a[1]),new b(2438529370,a[2]),new b(355462360,a[3]),new b(1731405415,a[4]),new b(41048885895,a[5]),new b(3675008525,a[6]),new b(1203062813,a[7])];break;case "SHA-512":a=[new b(d[0],4089235720),new b(d[1],2227873595),
	new b(d[2],4271175723),new b(d[3],1595750129),new b(d[4],2917565137),new b(d[5],725511199),new b(d[6],4215389547),new b(d[7],327033209)];break;default:throw Error("Unknown SHA variant");}else if(0===c.lastIndexOf("SHA3-",0)||0===c.lastIndexOf("SHAKE",0))for(c=0;5>c;c+=1)a[c]=[new b(0,0),new b(0,0),new b(0,0),new b(0,0),new b(0,0)];else throw Error("No SHA variants supported");return a}function K(c,a){var b=[],e,d,n,g,l,p,f;e=a[0];d=a[1];n=a[2];g=a[3];l=a[4];for(f=0;80>f;f+=1)b[f]=16>f?c[f]:y(b[f-
	3]^b[f-8]^b[f-14]^b[f-16],1),p=20>f?H(y(e,5),d&n^~d&g,l,1518500249,b[f]):40>f?H(y(e,5),d^n^g,l,1859775393,b[f]):60>f?H(y(e,5),U(d,n,g),l,2400959708,b[f]):H(y(e,5),d^n^g,l,3395469782,b[f]),l=g,g=n,n=y(d,30),d=e,e=p;a[0]=G(e,a[0]);a[1]=G(d,a[1]);a[2]=G(n,a[2]);a[3]=G(g,a[3]);a[4]=G(l,a[4]);return a}function Z(c,a,b,e){var d;for(d=(a+65>>>9<<4)+15;c.length<=d;)c.push(0);c[a>>>5]|=128<<24-a%32;a+=b;c[d]=a&4294967295;c[d-1]=a/4294967296|0;a=c.length;for(d=0;d<a;d+=16)e=K(c.slice(d,d+16),e);return e}function L(c,
	a,k){var e,h,n,g,l,p,f,m,q,u,r,t,v,w,y,A,z,x,F,B,C,D,E=[],J;if("SHA-224"===k||"SHA-256"===k)u=64,t=1,D=Number,v=G,w=la,y=H,A=ha,z=ja,x=da,F=fa,C=U,B=aa,J=d;else if("SHA-384"===k||"SHA-512"===k)u=80,t=2,D=b,v=ma,w=na,y=oa,A=ia,z=ka,x=ea,F=ga,C=ca,B=ba,J=V;else throw Error("Unexpected error in SHA-2 implementation");k=a[0];e=a[1];h=a[2];n=a[3];g=a[4];l=a[5];p=a[6];f=a[7];for(r=0;r<u;r+=1)16>r?(q=r*t,m=c.length<=q?0:c[q],q=c.length<=q+1?0:c[q+1],E[r]=new D(m,q)):E[r]=w(z(E[r-2]),E[r-7],A(E[r-15]),E[r-
	16]),m=y(f,F(g),B(g,l,p),J[r],E[r]),q=v(x(k),C(k,e,h)),f=p,p=l,l=g,g=v(n,m),n=h,h=e,e=k,k=v(m,q);a[0]=v(k,a[0]);a[1]=v(e,a[1]);a[2]=v(h,a[2]);a[3]=v(n,a[3]);a[4]=v(g,a[4]);a[5]=v(l,a[5]);a[6]=v(p,a[6]);a[7]=v(f,a[7]);return a}function D(c,a){var d,e,h,n,g=[],l=[];if(null!==c)for(e=0;e<c.length;e+=2)a[(e>>>1)%5][(e>>>1)/5|0]=B(a[(e>>>1)%5][(e>>>1)/5|0],new b(c[e+1],c[e]));for(d=0;24>d;d+=1){n=A("SHA3-");for(e=0;5>e;e+=1){h=a[e][0];var p=a[e][1],f=a[e][2],m=a[e][3],q=a[e][4];g[e]=new b(h.a^p.a^f.a^
	m.a^q.a,h.b^p.b^f.b^m.b^q.b)}for(e=0;5>e;e+=1)l[e]=B(g[(e+4)%5],S(g[(e+1)%5],1));for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)a[e][h]=B(a[e][h],l[e]);for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)n[h][(2*e+3*h)%5]=S(a[e][h],W[e][h]);for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)a[e][h]=B(n[e][h],new b(~n[(e+1)%5][h].a&n[(e+2)%5][h].a,~n[(e+1)%5][h].b&n[(e+2)%5][h].b));a[0][0]=B(a[0][0],X[d])}return a}var d,V,W,X;d=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,
	1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,
	2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];V=[new b(d[0],3609767458),new b(d[1],602891725),new b(d[2],3964484399),new b(d[3],2173295548),new b(d[4],4081628472),new b(d[5],3053834265),new b(d[6],2937671579),new b(d[7],3664609560),new b(d[8],2734883394),new b(d[9],1164996542),new b(d[10],1323610764),new b(d[11],3590304994),new b(d[12],4068182383),new b(d[13],991336113),new b(d[14],633803317),new b(d[15],3479774868),new b(d[16],2666613458),new b(d[17],944711139),new b(d[18],2341262773),
	new b(d[19],2007800933),new b(d[20],1495990901),new b(d[21],1856431235),new b(d[22],3175218132),new b(d[23],2198950837),new b(d[24],3999719339),new b(d[25],766784016),new b(d[26],2566594879),new b(d[27],3203337956),new b(d[28],1034457026),new b(d[29],2466948901),new b(d[30],3758326383),new b(d[31],168717936),new b(d[32],1188179964),new b(d[33],1546045734),new b(d[34],1522805485),new b(d[35],2643833823),new b(d[36],2343527390),new b(d[37],1014477480),new b(d[38],1206759142),new b(d[39],344077627),
	new b(d[40],1290863460),new b(d[41],3158454273),new b(d[42],3505952657),new b(d[43],106217008),new b(d[44],3606008344),new b(d[45],1432725776),new b(d[46],1467031594),new b(d[47],851169720),new b(d[48],3100823752),new b(d[49],1363258195),new b(d[50],3750685593),new b(d[51],3785050280),new b(d[52],3318307427),new b(d[53],3812723403),new b(d[54],2003034995),new b(d[55],3602036899),new b(d[56],1575990012),new b(d[57],1125592928),new b(d[58],2716904306),new b(d[59],442776044),new b(d[60],593698344),new b(d[61],
	3733110249),new b(d[62],2999351573),new b(d[63],3815920427),new b(3391569614,3928383900),new b(3515267271,566280711),new b(3940187606,3454069534),new b(4118630271,4000239992),new b(116418474,1914138554),new b(174292421,2731055270),new b(289380356,3203993006),new b(460393269,320620315),new b(685471733,587496836),new b(852142971,1086792851),new b(1017036298,365543100),new b(1126000580,2618297676),new b(1288033470,3409855158),new b(1501505948,4234509866),new b(1607167915,987167468),new b(1816402316,
	1246189591)];X=[new b(0,1),new b(0,32898),new b(2147483648,32906),new b(2147483648,2147516416),new b(0,32907),new b(0,2147483649),new b(2147483648,2147516545),new b(2147483648,32777),new b(0,138),new b(0,136),new b(0,2147516425),new b(0,2147483658),new b(0,2147516555),new b(2147483648,139),new b(2147483648,32905),new b(2147483648,32771),new b(2147483648,32770),new b(2147483648,128),new b(0,32778),new b(2147483648,2147483658),new b(2147483648,2147516545),new b(2147483648,32896),new b(0,2147483649),
	new b(2147483648,2147516424)];W=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]]; true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return C}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=C),exports=C):Y.jsSHA=C})(this);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	exports.Resource = Resource_1.Resource;
	var Observation_1 = __webpack_require__(14);
	exports.Observation = Observation_1.Observation;
	var BodyWeight_1 = __webpack_require__(15);
	exports.BodyWeight = BodyWeight_1.BodyWeight;
	var Temperature_1 = __webpack_require__(17);
	exports.Temperature = Temperature_1.Temperature;
	var HeartRate_1 = __webpack_require__(18);
	exports.HeartRate = HeartRate_1.HeartRate;
	var StepsCount_1 = __webpack_require__(19);
	exports.StepsCount = StepsCount_1.StepsCount;
	var BodyHeight_1 = __webpack_require__(20);
	exports.BodyHeight = BodyHeight_1.BodyHeight;
	var Questionnaire_1 = __webpack_require__(21);
	exports.Questionnaire = Questionnaire_1.Questionnaire;
	var BloodPressure_1 = __webpack_require__(22);
	exports.BloodPressure = BloodPressure_1.BloodPressure;
	var MedicationStatement_1 = __webpack_require__(23);
	exports.MedicationStatement = MedicationStatement_1.MedicationStatement;
	var Media_1 = __webpack_require__(24);
	exports.Media = Media_1.Media;
	var ImageMedia_1 = __webpack_require__(25);
	exports.ImageMedia = ImageMedia_1.ImageMedia;
	var Hemoglobin_1 = __webpack_require__(26);
	exports.Hemoglobin = Hemoglobin_1.Hemoglobin;
	var Bundle_1 = __webpack_require__(27);
	exports.Bundle = Bundle_1.Bundle;
	var Patient_1 = __webpack_require__(28);
	exports.Patient = Patient_1.Patient;
	var registry_1 = __webpack_require__(10);
	exports.registerResource = registry_1.registerResource;
	exports.fromFhir = registry_1.fromFhir;
	var categories_1 = __webpack_require__(16);
	exports.Survey = categories_1.Survey;
	exports.Laboratory = categories_1.Laboratory;
	exports.VitalSigns = categories_1.VitalSigns;
	exports.PatientSpecified = categories_1.PatientSpecified;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var registry_1 = __webpack_require__(10);
	/**
	 * Measurements and simple assertions made about a patient, device or other
	 * subject.
	 *
	 * https://www.hl7.org/fhir/observation.html
	 */
	var Observation = /** @class */ (function (_super) {
	    __extends(Observation, _super);
	    function Observation(effectiveType, code, category, valueType) {
	        var _this = _super.call(this, 'Observation') || this;
	        // check type of effective property
	        if (effectiveType) {
	            if (_this._isDateTime(effectiveType)) {
	                _this.addProperty('effectiveDateTime', effectiveType._dateTime);
	            }
	            else if (_this._isPeriod(effectiveType)) {
	                _this.addProperty('effectivePeriod', effectiveType._period);
	            }
	            else {
	                console.log("Internal Error");
	            }
	        }
	        // check type of value property
	        if (valueType) {
	            if (_this._isValueQuantity(valueType)) {
	                _this.addProperty('valueQuantity', valueType._quantity);
	            }
	            else if (_this._isCodeableConcept(valueType)) {
	                _this.addProperty('valueCodeableConcept', valueType._codeableConcept);
	            }
	            else {
	                console.log("Internal Error");
	            }
	        }
	        _this.addProperty('status', 'preliminary');
	        _this.addProperty('category', category);
	        _this.addProperty('code', code);
	        return _this;
	    }
	    // Determine the type by using user-defined type guards.
	    Observation.prototype._isValueQuantity = function (type) {
	        return type._quantity !== undefined;
	    };
	    Observation.prototype._isCodeableConcept = function (type) {
	        return type._codeableConcept !== undefined;
	    };
	    Observation.prototype._isDateTime = function (type) {
	        return type._dateTime !== undefined;
	    };
	    Observation.prototype._isPeriod = function (type) {
	        return type._period !== undefined;
	    };
	    Observation.prototype.addComponent = function (component) {
	        if (this._fhir['component'] == null) {
	            this.addProperty('component', []);
	        }
	        this._fhir.component.push(component);
	    };
	    Observation.prototype.addRelated = function (resource) {
	        if (this._fhir['related'] == null) {
	            this.addProperty('related', []);
	        }
	        // Instances of type Resource defined by the midata.js library
	        // possess a reference method. Therefore, the relative reference can be build by invoking
	        // this method. Since the relative id consists of two values (resource type and resource id)
	        // concatenated by a slash (/), the method can also build the relative id directly during invocation.
	        // This presumes, however, that passed resources hold on to the FHIR base resource definition.
	        var ref;
	        if (resource instanceof Resource_1.Resource) {
	            ref = resource.reference;
	        }
	        else if (resource.resourceType && resource.id) {
	            ref = resource.resourceType + "/" + resource.id;
	        }
	        else {
	            throw new Error("Error, invalid Object");
	        }
	        this._fhir.related.push({
	            type: "has-member",
	            target: {
	                reference: ref
	            }
	        });
	    };
	    Observation = __decorate([
	        registry_1.registerResource('resourceType', 'Observation')
	    ], Observation);
	    return Observation;
	}(Resource_1.Resource));
	exports.Observation = Observation;
	;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var BodyWeight = /** @class */ (function (_super) {
	    __extends(BodyWeight, _super);
	    function BodyWeight(weightKg, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: weightKg,
	                unit: 'kg',
	                system: 'http://unitsofmeasure.org',
	                code: 'kg'
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, {
	            coding: [{
	                    system: 'http://loinc.org',
	                    code: '29463-7',
	                    display: 'Body weight'
	                }]
	        }, categories_1.VitalSigns, quantity) || this;
	        return _this;
	    }
	    BodyWeight = __decorate([
	        registry_1.registerResource('code', '29463-7')
	    ], BodyWeight);
	    return BodyWeight;
	}(Observation_1.Observation));
	exports.BodyWeight = BodyWeight;
	;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	// All codes from system http://hl7.org/fhir/observation-category
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VitalSigns = {
	    coding: [{
	            system: 'http://hl7.org/fhir/observation-category',
	            code: 'vital-signs',
	            display: 'Vital Signs'
	        }],
	    text: 'Vital Signs'
	};
	exports.Laboratory = {
	    coding: [{
	            system: 'http://hl7.org/fhir/observation-category',
	            code: 'laboratory',
	            display: 'Laboratory'
	        }],
	    text: 'Laboratory'
	};
	exports.Survey = {
	    coding: [{
	            system: 'http://hl7.org/fhir/observation-category',
	            code: 'survey',
	            display: 'Survey'
	        }],
	    text: 'Survey'
	};
	exports.SocialHistory = {
	    coding: [{
	            system: 'http://hl7.org/fhir/observation-category',
	            code: 'social-history',
	            display: 'Social History'
	        }],
	    text: 'Social History'
	};
	// All codes from system http://hl7.org/fhir/medication-statement-category
	exports.PatientSpecified = {
	    coding: [{
	            system: 'http://hl7.org/fhir/medication-statement-category',
	            code: 'patientspecified',
	            display: 'Patient Specified'
	        }],
	    text: 'Patient Specified'
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var tempCode = {
	    "coding": [
	        {
	            "system": "http://acme.lab",
	            "code": "BT",
	            "display": "Body temperature"
	        },
	        // LOINC and SNOMED CT translations here - Note in the US the primary code
	        // will be LOINC per meaningful use.  Further SNOMED CT  has acceeded
	        // to LOINC being the primary coding system for vitals and
	        // anthropromorphic measures.  SNOMED CT is required in some
	        // countries such as the UK.
	        {
	            "system": "http://loinc.org",
	            "code": "8310-5",
	            "display": "Body temperature"
	        },
	        {
	            "system": "http://snomed.info/sct",
	            "code": "56342008",
	            "display": "Temperature taking"
	        }
	    ],
	    "text": "Body temperature"
	};
	var Temperature = /** @class */ (function (_super) {
	    __extends(Temperature, _super);
	    function Temperature(tempC, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: tempC,
	                unit: 'degrees C',
	                system: 'http://snomed.info/sct',
	                code: '258710007'
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, tempCode, categories_1.VitalSigns, quantity) || this;
	        return _this;
	    }
	    Temperature = __decorate([
	        registry_1.registerResource('code', '258710007')
	    ], Temperature);
	    return Temperature;
	}(Observation_1.Observation));
	exports.Temperature = Temperature;
	;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var HeartRate = /** @class */ (function (_super) {
	    __extends(HeartRate, _super);
	    function HeartRate(beatsPerMinute, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: beatsPerMinute,
	                unit: 'bpm',
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, {
	            coding: [{
	                    system: 'http://loinc.org',
	                    code: '8867-4',
	                    display: 'Heart Rate'
	                }]
	        }, categories_1.VitalSigns, quantity) || this;
	        return _this;
	    }
	    HeartRate = __decorate([
	        registry_1.registerResource('code', '8867-4')
	    ], HeartRate);
	    return HeartRate;
	}(Observation_1.Observation));
	exports.HeartRate = HeartRate;
	;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var StepsCount = /** @class */ (function (_super) {
	    __extends(StepsCount, _super);
	    function StepsCount(steps, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: steps,
	                unit: 'steps'
	                // TODO: UCUM steps missing?
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        // TODO: Clarify, won't this interfere with MIDATA's Fitbit import?
	        _this = _super.call(this, effectiveType, {
	            text: 'Steps [24 hour]',
	            coding: [{
	                    system: 'http://loinc.org',
	                    code: '41950-7',
	                    display: 'Steps [24 hour]'
	                }]
	        }, categories_1.VitalSigns, quantity) || this;
	        return _this;
	    }
	    StepsCount = __decorate([
	        registry_1.registerResource('code', 'activities/steps')
	    ], StepsCount);
	    return StepsCount;
	}(Observation_1.Observation));
	exports.StepsCount = StepsCount;
	;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var BodyHeight = /** @class */ (function (_super) {
	    __extends(BodyHeight, _super);
	    function BodyHeight(heightCm, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: heightCm,
	                unit: 'cm',
	                system: 'http://unitsofmeasure.org',
	                code: 'cm'
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, {
	            coding: [{
	                    system: 'http://loinc.org',
	                    code: '8302-2',
	                    display: 'Body Height'
	                }]
	        }, categories_1.VitalSigns, quantity) || this;
	        return _this;
	    }
	    BodyHeight = __decorate([
	        registry_1.registerResource('code', '8302-2')
	    ], BodyHeight);
	    return BodyHeight;
	}(Observation_1.Observation));
	exports.BodyHeight = BodyHeight;
	;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var registry_1 = __webpack_require__(10);
	var Questionnaire = /** @class */ (function (_super) {
	    __extends(Questionnaire, _super);
	    function Questionnaire(questionGroup) {
	        var _this = _super.call(this, 'Questionnaire') || this;
	        // Other possible values: draft / retired
	        _this.addProperty('status', 'published');
	        return _this;
	    }
	    Questionnaire = __decorate([
	        registry_1.registerResource('resourceType', 'Questionnaire')
	    ], Questionnaire);
	    return Questionnaire;
	}(Resource_1.Resource));
	exports.Questionnaire = Questionnaire;
	;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var BloodPressure = /** @class */ (function (_super) {
	    __extends(BloodPressure, _super);
	    function BloodPressure(systolic, diastolic, date, withPeriodEndDate) {
	        var _this = this;
	        var code = {
	            coding: [{
	                    system: "http://loinc.org",
	                    code: '55417-0',
	                    display: 'Blood Pressure'
	                }]
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, code, categories_1.VitalSigns) || this;
	        _this.addComponent({
	            code: {
	                coding: [{
	                        system: "http://loinc.org",
	                        code: "8480-6",
	                        display: "Systolic blood pressure"
	                    }]
	            },
	            valueQuantity: {
	                value: systolic,
	                unit: 'mm[Hg]',
	                code: 'mm[Hg]'
	            }
	        });
	        _this.addComponent({
	            code: {
	                coding: [{
	                        system: "http://loinc.org",
	                        code: "8462-4",
	                        display: "Diastolic blood pressure"
	                    }]
	            },
	            valueQuantity: {
	                value: diastolic,
	                unit: 'mm[Hg]',
	                system: 'http://unitsofmeasure.org',
	                code: 'mm[Hg]'
	            }
	        });
	        return _this;
	    }
	    BloodPressure = __decorate([
	        registry_1.registerResource('code', '55417-0')
	    ], BloodPressure);
	    return BloodPressure;
	}(Observation_1.Observation));
	exports.BloodPressure = BloodPressure;
	;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var registry_1 = __webpack_require__(10);
	var MedicationStatement = /** @class */ (function (_super) {
	    __extends(MedicationStatement, _super);
	    function MedicationStatement(date, medication, status, category, subject, taken) {
	        var _this = _super.call(this, 'MedicationStatement') || this;
	        _this.addProperty('status', status);
	        _this.addProperty('category', category);
	        // TODO: here also a reference to another medication entry could be provided
	        _this.addProperty('medicationCodeableConcept', medication);
	        // TODO: this could also be set to a time period
	        _this.addProperty('effectiveDateTime', date.toISOString());
	        _this.addProperty('subject', subject);
	        _this.addProperty('taken', taken);
	        return _this;
	    }
	    MedicationStatement = __decorate([
	        registry_1.registerResource('resourceType', 'MedicationStatement')
	    ], MedicationStatement);
	    return MedicationStatement;
	}(Resource_1.Resource));
	exports.MedicationStatement = MedicationStatement;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var registry_1 = __webpack_require__(10);
	var Media = /** @class */ (function (_super) {
	    __extends(Media, _super);
	    function Media(filename, mediaType, mimetype, data) {
	        var _this = _super.call(this, 'Media') || this;
	        _this.addProperty('type', mediaType);
	        _this.addProperty('content', {
	            contentType: mimetype,
	            data: data,
	            title: filename
	        });
	        return _this;
	    }
	    Media = __decorate([
	        registry_1.registerResource('resourceType', 'Media')
	    ], Media);
	    return Media;
	}(Resource_1.Resource));
	exports.Media = Media;
	;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Media_1 = __webpack_require__(24);
	var supportedImageTypes = ['png', 'gif', 'jpg'];
	var ImageMedia = /** @class */ (function (_super) {
	    __extends(ImageMedia, _super);
	    function ImageMedia(filename, data) {
	        var _this = this;
	        var type;
	        var matches = filename.match(/\.(\w+)$/);
	        if (matches !== null) {
	            type = matches[1].toLowerCase();
	            if (supportedImageTypes.indexOf(type) === -1) {
	                throw new Error("Unsupported type: " + type);
	            }
	        }
	        else {
	            throw new Error('The filename requires a file extension!');
	        }
	        _this = _super.call(this, filename, 'photo', "image/" + type, data) || this;
	        return _this;
	    }
	    return ImageMedia;
	}(Media_1.Media));
	exports.ImageMedia = ImageMedia;
	;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var categories_1 = __webpack_require__(16);
	var registry_1 = __webpack_require__(10);
	var Observation_1 = __webpack_require__(14);
	var Hemoglobin = /** @class */ (function (_super) {
	    __extends(Hemoglobin, _super);
	    function Hemoglobin(gl, date, withPeriodEndDate) {
	        var _this = this;
	        var quantity = {
	            _quantity: {
	                value: gl,
	                unit: 'g/L',
	                system: 'http://unitsofmeasure.org',
	                code: 'g/L'
	            }
	        };
	        var effectiveType;
	        if (withPeriodEndDate) {
	            effectiveType = {
	                _period: {
	                    start: date.toISOString(),
	                    end: withPeriodEndDate.toISOString()
	                }
	            };
	        }
	        else {
	            effectiveType = {
	                _dateTime: date.toISOString()
	            };
	        }
	        _this = _super.call(this, effectiveType, {
	            coding: [{
	                    system: 'http://loinc.org',
	                    code: '718-7',
	                    display: 'Hemoglobin [Mass/volume] in Blood'
	                }]
	        }, categories_1.Laboratory, quantity) || this;
	        return _this;
	    }
	    Hemoglobin = __decorate([
	        registry_1.registerResource('code', '718-7')
	    ], Hemoglobin);
	    return Hemoglobin;
	}(Observation_1.Observation));
	exports.Hemoglobin = Hemoglobin;
	;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var es6_promise_1 = __webpack_require__(6);
	var registry_1 = __webpack_require__(10);
	var Bundle = /** @class */ (function (_super) {
	    __extends(Bundle, _super);
	    function Bundle(type) {
	        var _this = _super.call(this, 'Bundle') || this;
	        _super.prototype.setRelativeId.call(_this, "bundle-transaction");
	        _this.addProperty('type', type);
	        _this.addProperty('entry', []);
	        return _this;
	    }
	    // add resource of type fhir.BundleEntry to this bundle
	    // An entry in a bundle resource - will either contain a resource,
	    // or information about a resource (transactions and history only).
	    Bundle.prototype.addEntry = function (method, url, entry) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            try {
	                var length = Number(_this._fhir.entry.length) || 0;
	                // set the relative id
	                entry.setRelativeId(String(length += 1));
	                // push entry to array
	                _this._fhir.entry.push({
	                    request: {
	                        method: method,
	                        url: url
	                    },
	                    resource: entry.toJson(),
	                });
	                resolve("Added id #: " + length);
	            }
	            catch (e) {
	                // return error message
	                reject(e.message);
	            }
	        });
	    };
	    // TODO: comment
	    Bundle.prototype.getObservationEntries = function (withCode) {
	        var observationEntries = _super.prototype.getProperty.call(this, "entry").filter(function (entry) {
	            return entry.resource.resourceType === "Observation";
	        });
	        if (withCode) {
	            var filtered = [];
	            for (var _i = 0, observationEntries_1 = observationEntries; _i < observationEntries_1.length; _i++) {
	                var entry = observationEntries_1[_i];
	                for (var _a = 0, _b = entry.resource.code.coding; _a < _b.length; _a++) {
	                    var codeValue = _b[_a];
	                    if (codeValue.code === withCode) {
	                        filtered.push(entry);
	                    }
	                }
	            }
	            return filtered;
	        }
	        else {
	            return observationEntries;
	        }
	    };
	    // TODO: comment
	    Bundle.prototype.getEntry = function (withId) {
	        for (var _i = 0, _a = _super.prototype.getProperty.call(this, "entry"); _i < _a.length; _i++) {
	            var entry = _a[_i];
	            if (entry.resource.resourceType + "/" + entry.resource.id === withId) {
	                return entry;
	            }
	        }
	    };
	    Bundle = __decorate([
	        registry_1.registerResource('resourceType', 'Bundle')
	    ], Bundle);
	    return Bundle;
	}(Resource_1.Resource));
	exports.Bundle = Bundle;
	;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Resource_1 = __webpack_require__(11);
	var registry_1 = __webpack_require__(10);
	var Patient = /** @class */ (function (_super) {
	    __extends(Patient, _super);
	    function Patient(address, birthdate, gender, identifier, name, telecom) {
	        var _this = _super.call(this, "Patient") || this;
	        _this.addProperty('address', address);
	        _this.addProperty('birthdate', birthdate);
	        _this.addProperty('gender', gender);
	        _this.addProperty('identifier', identifier);
	        _this.addProperty('name', name);
	        _this.addProperty('telecom', telecom);
	        return _this;
	    }
	    Patient = __decorate([
	        registry_1.registerResource("resourceType", "Patient")
	    ], Patient);
	    return Patient;
	}(Resource_1.Resource));
	exports.Patient = Patient;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MidataJSError_1 = __webpack_require__(2);
	exports.MidataJSError = MidataJSError_1.MidataJSError;
	var MappingError_1 = __webpack_require__(3);
	exports.MappingError = MappingError_1.MappingError;
	var UnknownEndpointError_1 = __webpack_require__(4);
	exports.UnknownEndpointError = UnknownEndpointError_1.UnknownEndpointError;
	var InvalidCallError_1 = __webpack_require__(5);
	exports.InvalidCallError = InvalidCallError_1.InvalidCallError;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=midata.js.map