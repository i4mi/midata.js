export interface User {
    name: string;
    id: string;
}
export interface MidataError {
    status: number;
    message?: string;
    response: string;
}
export declare class Midata {
    private _host;
    private _appName;
    private _secret;
    private _conformance_statement_endpoint;
    private _authToken;
    private _refreshToken;
    private _user;
    /**
     * @param host The url of the midata server, e.g. "https://test.midata.coop:9000".
     */
    constructor(_host: string, _appName: string, _secret: string, _conformance_statement_endpoint?: string);
}
