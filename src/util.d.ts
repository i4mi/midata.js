import { Promise } from 'es6-promise';
export declare type HttpMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';
export interface ApiCallArgs {
    url: string;
    method: HttpMethod;
    payload?: any;
    headers?: any;
    jsonBody?: boolean;
}
export interface ApiCallResponse {
    message: string;
    body: any;
    status: number;
}
/**
 * Perform an AJAX call to an API endpoint.
 * @param args The arguments for the call.
 * @return A promise holding an object of structure ApiCallResponse.
 */
export declare function apiCall(args: ApiCallArgs): Promise<ApiCallResponse>;
