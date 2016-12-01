import { Promise } from 'es6-promise';


/**
 * Structure of the error objects with which promises
 * are rejected when an API call fails.
 */
interface ApiError {
    status: number;  // HTTP error code or 0 when there was a network error
    message: string; // a descriptive error message
}


export function post(url: string, payload: any, headers?: any) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        if (headers) {
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
                console.log(key);
            });
        }

        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {  // loaded
                if (this.status  === 200) {  // successfuly
                    let body = JSON.parse(this.responseText);
                    resolve(body);
                } else {  // loaded but non-successful response
                    reject({
                        message: this.statusText,
                        body: this.responseText,
                        status: this.status
                    });
                }
            }
        };

        xhr.onerror = function() {
            reject(new Error('Network error'));
        }

        xhr.send(JSON.stringify(payload));
    });
};
