/**
 * The authentication request payload.
 */
export interface AuthRequest {
    appname: string;  // internal name of the application
    secret: string;   // the secret key that has been chosen on the development portal
    username: string; // the email of the user
    password: string; // the user's password
    role?: UserRole;  // the role of the user (optional, default: "member")
}

/**
 * The authentication request payload for a new authentication.
 */
export interface RefreshAutRequest {
    appname: string;      // internal name of the application
    secret: string;       // the secret key that has been chosen on the development portal
    refreshToken: string; // the refresh token obtained from a previous login
}

/**
 * The user role in an authentication request.
 */
export type UserRole =
    'member'    |  // members of the cooperative (default)
    'provider'  |  // healthcare providers
    'developer' |  // developers
    'research'  ;  // researchers


/**
 * A response to successful authentication request.
 */
export interface AuthResponse {
    authToken: string;
    refreshToken: string;
    status: string;
    owner: string;
}

/**
 * A request to create a new record.
 */
export interface CreateRecordRequest {
    authToken: string;        // the token from the authentication request,
    name: string;             // a name for the record,
    description: string;      // a description for the record,
    format: string;           // a string describing the technical data format,
    code: string | string[];  // a string or an array of strings describing
                              // the data content (each string contains system and code),
    owner?: string;           // the id of the owner of the record. (optional, default is "self")
    data: string;             // JSON string containing the record itself.
}

/**
 * The response to a successful create record request.
 */
export interface CreateRecordResponse {
    _id: string;     // id of the new record
    created: number; // the creation timestamp of the new record
                     //(in milliseconds after 01.Jan.1970 UTC)
}

export interface UpdateRecordRequest {
    authToken: string;  // the token from the authentication request,
    _id: string;        // the identifier of the record you want to change
    version: string;    // the version field of the record that you have read before
    data: string;       // JSON string containing the record itself.
}

export interface GetRecordRequest {
    authToken: string;  // the token from the authentication request,
    fields: string;     //  a string array of field names to return,
    // A key value map with restrictions (can be empty).
    // Refer to the API docs on what query parameters are avaialable.
    properties: {[k: string]: string};
}

export type SummarizeLevel =
    'ALL'     |
    'GROUP'   |
    'FORMAT'  |
    'CONTENT' |
    'SINGLE'  ;

export interface SummaryQuery {
    authToken: string;  // the token from the authentication request,
    summarize: SummarizeLevel;  // the level of grouping required
    properties: {[k: string]: string};
}
