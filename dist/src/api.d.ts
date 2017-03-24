import { URLSearchParams } from "@angular/http";
/**
 * The authentication request payload.
 */
export interface AuthRequest {
    appname: string;
    secret: string;
    username: string;
    password: string;
    role?: UserRole;
}
/**
 * The user role in an authentication request.
 */
export declare type UserRole = 'member' | 'provider' | 'developer' | 'research';
/**

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
 * The token request payload
 */
export interface TokenRequest {
    encodedParams: URLSearchParams;
}
/**
 * A response to successful token request
 */
export interface TokenResponse {
    state: string;
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: string;
    patient: string;
    refresh_token: string;
}
/**
 * A response to successful token refresh request.
 */
export interface TokenRefreshResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}
/**
 * A request to create a new record.
 */
export interface CreateRecordRequest {
    authToken: string;
    name: string;
    description: string;
    format: string;
    code: string | string[];
    owner?: string;
    data: string;
}
/**
 * The response to a successful create record request.
 */
export interface CreateRecordResponse {
    _id: string;
    created: number;
}
export interface UpdateRecordRequest {
    authToken: string;
    _id: string;
    version: string;
    data: string;
}
export interface GetRecordRequest {
    authToken: string;
    fields: string;
    properties: {
        [k: string]: string;
    };
}
export declare type SummarizeLevel = 'ALL' | 'GROUP' | 'FORMAT' | 'CONTENT' | 'SINGLE';
export interface SummaryQuery {
    authToken: string;
    summarize: SummarizeLevel;
    properties: {
        [k: string]: string;
    };
}
