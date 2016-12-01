import { AuthRequest, AuthResponse, RefreshAutRequest, UserRole } from './api';
import { Promise } from 'es6-promise';
import { post } from './util';
import { Resource } from './resources';


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

    get loggedIn() {
        return this._authToken !== undefined;
    }

    get authToken() {
        return this._authToken;
    }

    get refreshToken() {
        return this._refreshToken;
    }

    get user() {
        return this._user;
    }

    logout() {
        this._user = undefined;
        this._refreshToken = undefined;
        this._authToken = undefined;
    }

    // Responses: 400 with error message as payload
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

        let result = post(this._host + '/v1/auth', authRequest, {
            'Content-Type': 'application/json'
        })
        .then((response: AuthResponse) => {
            this._authToken = response.authToken;
            this._refreshToken = response.refreshToken;
            this._user = {
                name: username
            };
            return response;
        })
        .catch((error: any) => {
            return Promise.reject(error);
        });

        return result;
    }

    // TODO: Helpful error messages for different error codes:
    // 422 Unprocessable entity
    save(resource: Resource | any) {
        var fhirObject: any;
        if (resource instanceof Resource) {
            fhirObject = resource.toJson();
        } else {
            fhirObject = resource;
        }

        // TODO: FIXME, everything is created/updated via `save`
        if (fhirObject.id !== undefined) {
            throw new Error(
                `The resource you tried to create already has an id attribute!
                Did you mean to update an existing resource?
                Please use the update method for that.
            `);
        }
        if (this._authToken === undefined) {
            throw new Error(
                `Can\'t create records when no user logged in first.
                Call login() before trying to create records.`
            );
        }
        let url = `${this._host}/fhir/${fhirObject.resourceType}?_format=application/json+fhir`;
        // TODO: Return meaningful message for 201 CREATED
        return post(url, fhirObject, {
            'Authorization': 'Bearer ' + this._authToken,
            'Content-Type': 'application/json+fhir;charset=utf-8'
        })
        .then((response) => {
            // TODO: Retry create record
        })
        .catch((error) => {
            console.log(error.message);
            console.log(error.status);
            console.log(error.body);

            // return this._refresh();
        });
    }

    // update(resource: Resource)

    private _refresh() {
        let authRequest: RefreshAutRequest = {
            appname: this._appName,
            secret: this._secret,
            refreshToken: this._refreshToken
        };

        let result = post(this._host + '/v1/auth', authRequest, {
            'Content-Type': 'application/json'
        })
        .then((response: AuthResponse) => {
            this._authToken = response.authToken;
            this._refreshToken = response.refreshToken;
            return response;
        })
        .catch((error: any) => {
            return Promise.reject(error);
        });

        return result;
    }
}


