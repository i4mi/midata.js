"use strict";
var es6_promise_1 = require('../../../node_modules/es6-promise');
var util_1 = require('./util');
var ionic_native_1 = require('ionic-native');
var http_1 = require("@angular/http");
var registry_1 = require("./resources/registry");
var Resource_1 = require("./resources/Resource");
var Midata = (function () {
    // TODO: Handle expires_in param
    // TODO: Add types to response params
    // TODO: Switch between demo and productive installation (set host)
    /**
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:9000".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     */
    function Midata(_host, _appName, _conformanceStatementEndpoint) {
        var _this = this;
        this._host = _host;
        this._appName = _appName;
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint;
        /**
         Helper method to create FHIR resources via a HTTP POST call.
         */
        this._create = function (fhirObject) {
            var url = _this._host + "/fhir/" + fhirObject.resourceType;
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
        this._refresh = function () {
            return new es6_promise_1.Promise(function (resolve, reject) {
                var getEncodedParams = function () {
                    // because of x-www-form-urlencoded
                    var urlSearchParams = new http_1.URLSearchParams();
                    urlSearchParams.append("grant_type", "refresh_token");
                    urlSearchParams.append("refresh_token", _this._refreshToken);
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
                    _this._authToken = body.access_token;
                    _this._refreshToken = body.refresh_token;
                    // set login data
                    _this._setLoginData(body.access_token, body.refresh_token);
                    console.log("login data refreshed! resolve...");
                    resolve(body);
                })
                    .catch(function (response) {
                    reject(response);
                });
            });
        };
        if (cordova && cordova.InAppBrowser) {
            window.open = cordova.InAppBrowser.open;
        }
        this._conformanceStatementEndpoint = _conformanceStatementEndpoint || "https://test.midata.coop:9000/fhir/metadata";
        if (this._conformanceStatementEndpoint !== undefined) {
            this.fetchFHIRConformanceStatement().then(function (response) {
                console.log("Success! (" + response.status + ", " + response.message + ")");
                // Check if there is previously saved login data that was
                // put there before the last page refresh. In case there is,
                // load it.
                if (window.localStorage) {
                    var value = localStorage.getItem('midataLoginData');
                    var data = JSON.parse(value);
                    if (data) {
                        _this._setLoginData(data.authToken, data.refreshToken);
                    }
                }
            }, function (error) {
                console.log("Error! (" + error.status + ", " + error.message + ")");
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
    /*
     Destroy all authenication information.
     */
    Midata.prototype.logout = function () {
        this._refreshToken = undefined;
        this._authToken = undefined;
        if (window.localStorage) {
            localStorage.removeItem('midataLoginData');
        }
    };
    /*
     Set login-specific properties. This method should be called either during
     startup or when the login method is called explicitly.
     */
    Midata.prototype._setLoginData = function (authToken, refreshToken) {
        this._authToken = authToken;
        this._refreshToken = refreshToken;
        if (window.localStorage) {
            localStorage.setItem('midataLoginData', JSON.stringify({
                authToken: authToken,
                refreshToken: refreshToken
            }));
        }
    };
    // TODO: Try to refresh authtoken when recieving a 401 and then try again.
    // TODO: Try to map response objects back to their class (e.g. BodyWeight)
    Midata.prototype.save = function (resource) {
        var _this = this;
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error("Can't create records when no user logged in first.\n        Call login() before trying to create records.");
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
        var shouldCreate = fhirObject.id === undefined;
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
            if (response.status === 401) {
                // TODO: Try to login with refresh token if there is one and
                // retry to save resource. Only if it still fails proceed with logout.
                _this.logout();
            }
            return es6_promise_1.Promise.reject(response);
        });
    };
    Midata.prototype.search = function (resourceType, params) {
        if (params === void 0) { params = {}; }
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
            if (response.status === 401) {
                // TODO: Try to login with refresh token if there is one and
                // retry the search.. Only if it still fails proceed with logout.
                _this.logout();
                return es6_promise_1.Promise.reject(response);
            }
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
    Midata.prototype.refresh = function () {
        // wrapper method, call subsequent actions from here
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._refresh().then(function (body) {
                console.log("Tokens refreshed!");
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
        var USERAUTH_ENDPOINT = function () {
            return _this._authEndpoint +
                "?response_type=" + 'code' +
                "&client_id=" + _this._appName +
                "&redirect_uri=" + 'http://localhost/callback' +
                "&aud=" + 'https:%2F%2Ftest.midata.coop:9000%2Ffhir' +
                "&scope=" + 'user%2F*.*';
        };
        return new es6_promise_1.Promise(function (resolve, reject) {
            var browser = new ionic_native_1.InAppBrowser(USERAUTH_ENDPOINT(), '_blank', 'location=yes');
            browser.on('loadstart').subscribe(function (event) {
                browser.show();
                if ((event.url).indexOf("http://localhost/callback") === 0) {
                    _this._authCode = event.url.split("&")[1].split("=")[1];
                    browser.close();
                    resolve(event);
                }
            }, function (error) {
                console.log("Error! (" + error.status + ", " + error.message + ")");
                reject(error);
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
                urlSearchParams.append("client_id", "oauth2test");
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
                // set login data
                _this._setLoginData(body.access_token, body.refresh_token);
                console.log("login data set! resolve...");
                resolve(body);
            })
                .catch(function (response) {
                reject(response);
            });
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
    return Midata;
}());
exports.Midata = Midata;
//# sourceMappingURL=Midata.js.map