import { Promise } from 'es6-promise';


/**
 * Structure of the error objects with which promises
 * are rejected when an API call fails.
 */
interface ApiError {
    status: number;  // HTTP error code or 0 when there was a network error
    message: string; // a descriptive error message
}


export type HttpMethod =
    'POST'   |
    'PUT'    |
    'GET'    |
    'DELETE' ;

export interface ApiCallArgs {
    url: string;
    method: HttpMethod;
    payload?: any;
    headers?: any;
    jsonBody?: boolean;
};

export interface ApiCallResponse {
    message: string,
    body: any,
    status: number
};

// TODO: Either the payload should be anything and the user has to
// specify the content-type via the headers arg or it should always 
// be JSON in which case the user shouldn't need to specify the content-type
// to be application/json. 
/**
 * Perform an AJAX call to an API endpoint.
 * @param args The arguments for the call.
 * @return A promise holding an object of structure ApiCallResponse.
 */
export function apiCall(args: ApiCallArgs): Promise<ApiCallResponse> {

    let url = args.url;
    let method = args.method;
    let payload = args.payload;
    let headers = args.headers;
    let jsonBody = args.jsonBody || false;

    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        if (headers) {
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });
        }

        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {  // loaded
                let status = this.status;
                if (status >= 200 && status < 300) {  // successfuly
                    let body: any;
                    if (jsonBody) {
                        body = JSON.parse(this.responseText);
                    } else {
                        body = this.responseText;
                    }
                    resolve({
                        message: 'Request successful',
                        body: body,
                        status: status
                    });
                } else {  // loaded but non-successful response
                    reject({
                        message: this.statusText,
                        body: this.responseText,
                        status: status
                    });
                }
            }
        };

        xhr.onerror = function() {
            reject({
                message: 'Network error',
                body: '',
                status: 0
            });
        }

        // NOTE: Note that the payload should probably be stringified
        // before being passed into this function in order to allow
        // non-json encodings of the payload (such as url-encoded or plain text).
        if (payload !== undefined) {
            xhr.send(JSON.stringify(payload));
        } else {
            xhr.send();
        }
    });
};
