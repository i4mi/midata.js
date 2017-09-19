import { TokenRefreshResponse, TokenResponse, AuthResponse, UserRole } from './api';
import { Promise } from 'es6-promise';
import { Resource } from "./resources/Resource";
export interface User {
    name?: string;
    id?: string;
    email?: string;
    language?: language;
}
export declare type language = 'en' | 'de' | 'it' | 'fr';
export declare class Midata {
    private _host;
    private _appName;
    private _secret;
    private _conformanceStatementEndpoint;
    private _authToken;
    private _refreshToken;
    private _authCode;
    private _tokenEndpoint;
    private _authEndpoint;
    private _user;
    private _iab;
    private _state;
    private _codeVerifier;
    private _codeChallenge;
    /**
     *
     * @param _host The url of the midata server, e.g. "https://test.midata.coop:443".
     * @param _appName The internal application name accessing the platform (as defined on the midata platform).
     * @param _conformanceStatementEndpoint? The location of the endpoint identifying the OAuth authorize and token
     *        endpoints. Optional parameter.
     *
     */
    constructor(_host: string, _appName: string, _secret?: string, _conformanceStatementEndpoint?: string);
    readonly loggedIn: boolean;
    readonly authToken: string;
    readonly refreshToken: string;
    readonly user: User;
    setUserEmail(email: string): void;
    setUserLanguage(language: language): void;
    changePlatform(host: string, conformanceStatementEndpoint?: string): void;
    logout(): void;
    private _setLoginData(authToken, refreshToken, user?);
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
    login(username: string, password: string, role?: UserRole): Promise<AuthResponse>;
    /**
     *
     * This method stores a resource onto midata.
     *
     * @param resourceType The resource to be stored (e.g. HeartRate)
     * @return Promise<Resource>
     *
     */
    save(resource: Resource | any): Promise<Resource>;
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
    private _retry(maxRetries, fn, ...args);
    /**
     *
     Helper method to create FHIR resources via a HTTP POST call.
     *
     */
    private _create;
    /**
     *
     Helper method to create FHIR resources via a HTTP PUT call.
     *
     */
    private _update;
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
    refresh(withRefreshToken?: string): Promise<TokenRefreshResponse>;
    /**
     *
     * Query the midata API using FHIR resource types and optional params.
     *
     * @param resourceType The resource to be searched (e.g. Observation)
     * @param params Parameters refining the search call (e.g. {status: 'preliminary'})
     * @return Promise<Resource[]>
     *
     */
    search(resourceType: string, params?: any): Promise<Resource[]>;
    /**
     Helper method to query the FHIR API.
     * @param baseUrl for target API Call (e.g. Observation)
     * @param params e.g. {code: '29463-7'} for BodyWeight
     * @return Promise<ApiCallResponse>
     */
    private _search(baseUrl, params?);
    /**
     Login to the MIDATA platform. This method has to be called prior to
     creating or updating resources. Calling authenticate will initiate the
     oAuth2 authentication process.

     @param withDeviceID Optional parameter to allocate previously granted consents on the platform to this device.
     @return Promise<TokenResponse>
     **/
    authenticate(withDeviceID?: string): Promise<TokenResponse>;
    /**
     After successful authentication on midata this method is invoked. It exchanges the authCode
     obtained from midata with the access_token used to query the FHIR endpoint API.

     @return Promise<TokenResponse>
     **/
    private _exchangeTokenForCode();
    /**
     Helper method to initialize the params used during the oAuth2 authentication process.

     @return Promise<void>
     **/
    private _initSessionParams(length);
    /**
     Helper method to generate a random string with a given length.
     @param length Length of the string to be generated
     @return Promise<string>
     **/
    private _initRndString(length);
    /**
     This method fetches the conformance statement identifying the OAuth authorize
     and token endpoint URLs for use in requesting authorization to access FHIR resources.
     This method is invoked whenever a new midata object is created. However, it can also
     exclusively be called in order to update existing endpoint information.

     @return Promise<Resource>
     **/
    fetchFHIRConformanceStatement(): Promise<Resource>;
}
