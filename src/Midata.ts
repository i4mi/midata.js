import { AuthRequest, AuthResponse, RefreshAutRequest, UserRole } from './api';
import { Promise } from 'es6-promise';
import { apiCall } from './util';
import { Resource } from './resources';
import { fromFhir } from './resources/registry';


export interface User {
    name: string;
}

/**
 * Usage:
 *
 *     let auth = new MidataAuth('demo.midata.coop');
 *     auth.login({
 *         username: 'userxy',
 *         password: 'somepassword'
 *     }).then(...)
 */
export class Midata {

    private _authToken: string;
    private _refreshToken: string;
    private _user: User;

    /**
     * @param host The url of the midata server, e.g. "https://test.midata.coop:9000".
     */
    constructor(private _host: string,
                private _appName: string,
                private _secret: string) {}

    /**
     * If the user is logged in already.
     */
    get loggedIn() {
        return this._authToken !== undefined;
    }

    /**
     * The currently used authentication token. If the user didn't login yet
     * or recently called `logout()` this property will be undefined.
     */
    get authToken() {
        return this._authToken;
    }

    /**
     * The currently used refresh token. If the user didn't login yet
     * or recently called `logout()` this property will be undefined.
     */
    get refreshToken() {
        return this._refreshToken;
    }

    /**
     * A simple object holding information of the currently logged in user
     * such as his name.
     */
    get user() {
        return this._user;
    }

    /**
     * Destroy the authenication token.
     */
    logout() {
        this._user = undefined;
        this._refreshToken = undefined;
        this._authToken = undefined;
    }

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
            this._authToken = body.authToken;
            this._refreshToken = body.refreshToken;
            this._user = {
                name: username
            };
            return body;
        })
        .catch(error => {
            return Promise.reject(error.body);
        });

        return result;
    }

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
    save(resource: Resource | any) {
        // Check if the user is logged in, otherwise no record can be
        // created or updated.
        if (this._authToken === undefined) {
            throw new Error(
                `Can\'t create records when no user logged in first.
                Call login() before trying to create records.`
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
        let shouldCreate = fhirObject.id === undefined;
        let apiMethod = shouldCreate ? this._create : this._update;

        return apiMethod(fhirObject)
        .then(response => {
            // When the resource is created, the same resource will
            // be returned (populated with an id field in the case
            // it was newly created).
            if (response.status === 201) {          // created
                return response.body;
            } else if (response.status === 200)  {  // updated
                return response.body;
            } else {
                return Promise.reject(
                    `Unexpected response status code: ${response.status}`);
            }
        })
        .catch((response: any) => {
            if (response.status === 400) {
                return Promise.reject(
                    'Resource could not be parsed or failed basic FHIR validation rules.');
            }
            else if (response.status === 404) {
                return Promise.reject(
                    'Resource type not supported or not a valid FHIR end-point.');
            }
            else if (response.status === 422) {
                return Promise.reject(
                    `The proposed resource violated applicable FHIR profiles
                    or server business rules. More details should be contained
                    in the error message.`);
            }
            else if (response.status === 500) {
                return Promise.reject(response.body);
            } else {
                return Promise.reject(
                    `Unexpected error response status code: ${response.status}`);
            }
        });
    }

    /**
     * Helper method to create FHIR resources via a HTTP POST call.
     */
    private _create = (fhirObject: any) => {
        let url = `${this._host}/fhir/${fhirObject.resourceType}`;
        return apiCall({
            jsonBody: false,
            url: url,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8'
            },
            payload: fhirObject
        });
    };

    /**
     * Helper method to create FHIR resources via a HTTP PUT call.
     */
    private _update = (fhirObject: any) => {
        let url = `${this._host}/fhir/${fhirObject.resourceType}/${fhirObject.id}`;
        return apiCall({
            jsonBody: false,
            url: url,
            payload: fhirObject,
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8'
            },
            method: 'PUT'
        });
    };

    /**
     * Helper method to refresh the authentication token by authorizing
     * with the help of the refresh token.
     * This will generate a new authentication as well as a new refresh token.
     */
    private _refresh = () => {
        let authRequest: RefreshAutRequest = {
            appname: this._appName,
            secret: this._secret,
            refreshToken: this._refreshToken
        };

        let result = apiCall({
            url: this._host + '/v1/auth',
            method: 'POST',
            payload: authRequest,
            jsonBody: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response  => {
            let body: AuthResponse = response.body;
            this._authToken = body.authToken;
            this._refreshToken = body.refreshToken;
            return body;
        })
        .catch((response: any) => {
            return Promise.reject(response.body);
        });

        return result;
    };

    search(resourceType: string, params: any = {}) {
        let queryParts = Object.keys(params).map(key => {
            return key + '=' + params[key]
        });
        let query = queryParts.join('&');
        query = query && `?${query}` || '';
        let url = `${this._host}/fhir/${resourceType}${query}`;
        return apiCall({
            url: url,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this._authToken,
                'Content-Type': 'application/json+fhir;charset=utf-8'
            }
        })
        .then((response: any) => {
            let resources: any[] = [];
            if (response.body.entry) {
                let entries = response.body.entry;
                resources = entries.map((e: any) => {
                    return fromFhir(e.resource);
                });
            }
            return resources;
        })
        .catch((response: any) => {
            return Promise.reject(response.body);
        });
    }

    // delete(resourceType: string, id: number | string) {
    //     let url = `${this._host}/fhir/${resourceType}/${id}`;
    //     return apiCall({
    //         url: url,
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': 'Bearer ' + this._authToken
    //         }
    //     })
    //     .then((response: any) => {
    //         console.log(response);
    //     });
    // }
}
