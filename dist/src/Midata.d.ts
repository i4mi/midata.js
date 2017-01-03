import { UserRole } from './api';
import { Promise } from 'es6-promise';
import { Resource } from './resources';
export interface User {
    name: string;
    id: string;
}
export declare class Midata {
    private _host;
    private _appName;
    private _secret;
    private _authToken;
    private _refreshToken;
    private _user;
    /**
     * @param host The url of the midata server, e.g. "https://test.midata.coop:9000".
     */
    constructor(_host: string, _appName: string, _secret: string);
    /**
     * If the user is logged in already.
     */
    readonly loggedIn: boolean;
    /**
     * The currently used authentication token. If the user didn't login yet
     * or recently called `logout()` this property will be undefined.
     */
    readonly authToken: string;
    /**
     * The currently used refresh token. If the user didn't login yet
     * or recently called `logout()` this property will be undefined.
     */
    readonly refreshToken: string;
    /**
     * A simple object holding information of the currently logged in user
     * such as his name.
     */
    readonly user: User;
    /**
     * Destroy all authenication information.
     */
    logout(): void;
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
    login(username: string, password: string, role?: UserRole): Promise<any>;
    /**
     * Set login-specific properties. This method should be called either during
     * startup or when the login method is called explicitly.
     */
    private _setLoginData(authToken, refreshToken, user);
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
    save(resource: Resource | any): Promise<{}>;
    /**
     * Helper method to create FHIR resources via a HTTP POST call.
     */
    private _create;
    /**
     * Helper method to create FHIR resources via a HTTP PUT call.
     */
    private _update;
    /**
     * Helper method to refresh the authentication token by authorizing
     * with the help of the refresh token.
     * This will generate a new authentication as well as a new refresh token.
     */
    private _refresh;
    search(resourceType: string, params?: any): Promise<{}>;
    private _search(baseUrl, params?);
}
