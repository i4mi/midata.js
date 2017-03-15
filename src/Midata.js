"use strict";
var es6_promise_1 = require('../node_modules/es6-promise');
var util_1 = require('./util');
var resources_1 = require('./resources');
var registry_1 = require('./resources/registry');
var Midata = (function () {
    /**
     * @param host The url of the midata server, e.g. "https://test.midata.coop:9000".
     */
    function Midata(_host, _appName, _secret, _CONFORMANCE_STATEMENT_ENDPOINT) {
        var _this = this;
        this._host = _host;
        this._appName = _appName;
        this._secret = _secret;
        this._CONFORMANCE_STATEMENT_ENDPOINT = _CONFORMANCE_STATEMENT_ENDPOINT;
        /**
         * Helper method to create FHIR resources via a HTTP POST call.
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
         * Helper method to create FHIR resources via a HTTP PUT call.
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
         * Helper method to refresh the authentication token by authorizing
         * with the help of the refresh token.
         * This will generate a new authentication as well as a new refresh token.
         */
        this._refresh = function () {
            var authRequest = {
                appname: _this._appName,
                secret: _this._secret,
                refreshToken: _this._refreshToken
            };
            var result = util_1.apiCall({
                url: _this._host + '/v1/auth',
                method: 'POST',
                payload: authRequest,
                jsonBody: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                var body = response.body;
                _this._authToken = body.authToken;
                _this._refreshToken = body.refreshToken;
                return body;
            })
                .catch(function (response) {
                return es6_promise_1.Promise.reject(response.body);
            });
            return result;
        };
        // Check if there is previously saved login data that was
        // put there before the last page refresh. In case there is,
        // load it.
        if (window.localStorage) {
            var value = localStorage.getItem('midataLoginData');
            var data = JSON.parse(value);
            if (data) {
                this._setLoginData(data.authToken, data.refreshToken, data.user);
            }
        }
    }
    Object.defineProperty(Midata.prototype, "loggedIn", {
        /**
         * If the user is logged in already.
         */
        get: function () {
            return this._authToken !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "authToken", {
        /**
         * The currently used authentication token. If the user didn't login yet
         * or recently called `logout()` this property will be undefined.
         */
        get: function () {
            return this._authToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "refreshToken", {
        /**
         * The currently used refresh token. If the user didn't login yet
         * or recently called `logout()` this property will be undefined.
         */
        get: function () {
            return this._refreshToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Midata.prototype, "user", {
        /**
         * A simple object holding information of the currently logged in user
         * such as his name.
         */
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Destroy all authenication information.
     */
    Midata.prototype.logout = function () {
        this._user = undefined;
        this._refreshToken = undefined;
        this._authToken = undefined;
        if (window.localStorage) {
            localStorage.removeItem('midataLoginData');
        }
    };
    Midata.prototype.getFHIRConformanceStatement = function () {
        var result = util_1.apiCall({
            url: this._CONFORMANCE_STATEMENT_ENDPOINT,
            method: 'GET'
        }).then(function (response) {
            var body = response.body;
            console.log(body);
            return body;
        })
            .catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
        return result;
    };
    /**
     * Login to the MIDATA platform. This method has to be called prior to
     * creating or updating resources.
     *
     * @param username The user's identifier, most likely an email address.
     * @param password The user's password.
     * @param role The user's role used during the login (optional).
     * @return If the login was successfull the return value will be a resolved
     *         promise that contains the newly generated authentication and
     *         refresh token. In case the login failed the return value
     *         will be a rejected promise containing the error message.
     */
    Midata.prototype.login = function (username, password, role) {
        var _this = this;
        if (username === undefined || password === undefined) {
            throw new Error('You need to supply a username and a password!');
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
        var result = util_1.apiCall({
            url: this._host + '/v1/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            jsonBody: true,
            payload: authRequest
        })
            .then(function (response) {
            var body = response.body;
            var user = {
                id: body.owner,
                name: username
            };
            _this._setLoginData(body.authToken, body.refreshToken, user);
            return body;
        })
            .catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
        return result;
    };
    /**
     * Set login-specific properties. This method should be called either during
     * startup or when the login method is called explicitly.
     */
    Midata.prototype._setLoginData = function (authToken, refreshToken, user) {
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
    };
    /**
     * Convenience method to create or update FHIR resources of the MIDATA
     * platform.
     *
     * @param resource Either a resource object (such as an instance of class
     *                 BodyWeight) or a basic JS object that adheres to the FHIR
     *                 JSON schema (see the FHIR docs).
     * @return The same object that was updated/created. In the case that the
     *         object was newly created, its id field is populated.
     */
    // TODO: Try to refresh authtoken when recieving a 401 and then try again.
    // TODO: Try to map response objects back to their class (e.g. BodyWeight).
    Midata.prototype.save = function (resource) {
        var _this = this;
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error("Can't create records when no user logged in first.\n                Call login() before trying to create records.");
        }
        // Convert the resource to a FHIR-structured simple js object.
        var fhirObject;
        if (resource instanceof resources_1.Resource) {
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
    // searchAll(params: any) {
    //     let baseUrl = `${this._host}/fhir`;
    //     return this._search(baseUrl, params);
    // }
    // searchCompartment(compartment: string, id: string, params: any = {}) {
    //     let baseUrl = `${this._host}/fhir/${compartment}/${id}`;
    // }
    // searchType(resourceType: string, params: any = {}) {
    //     return this.search(resourceType, params);
    // }
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
    return Midata;
}());
exports.Midata = Midata;
