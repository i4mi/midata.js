"use strict";
var es6_promise_1 = require('es6-promise');
;
;
// TODO: Either the payload should be anything and the user has to
// specify the content-type via the headers arg or it should always
// be JSON in which case the user shouldn't need to specify the content-type
// to be application/json.
/**
 * Perform an AJAX call to an API endpoint.
 * @param args The arguments for the call.
 * @return A promise holding an object of structure ApiCallResponse.
 */
function apiCall(args) {
    var url = args.url;
    var method = args.method;
    var payload = args.payload;
    var headers = args.headers;
    var jsonBody = args.jsonBody || false;
    var jsonEncoded = args.jsonEncoded; // flag indicating json-encoding
    return new es6_promise_1.Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (headers) {
            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, headers[key]);
            });
        }
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                var status_1 = this.status;
                if (status_1 >= 200 && status_1 < 300) {
                    var body = void 0;
                    if (jsonBody) {
                        body = JSON.parse(this.responseText);
                    }
                    else {
                        body = this.responseText;
                    }
                    resolve({
                        message: 'Request successful',
                        body: body,
                        status: status_1
                    });
                }
                else {
                    reject({
                        message: this.statusText,
                        body: this.responseText,
                        status: status_1
                    });
                }
            }
        };
        xhr.onerror = function () {
            reject({
                message: 'Network error',
                body: '',
                status: 0
            });
        };
        // NOTE: Note that the payload should probably be stringified
        // before being passed into this function in order to allow
        // non-json encodings of the payload (such as url-encoded or plain text).
        // Supplement wya3: Check for JSON encoding. Additionally check if undefined in
        // order to ensure backward compatibility.
        if (payload !== undefined) {
            if (jsonEncoded || jsonEncoded == undefined) {
                xhr.send(JSON.stringify(payload));
            }
            else {
                xhr.send(payload);
            }
        }
        else {
            xhr.send();
        }
    });
}
exports.apiCall = apiCall;
;
//# sourceMappingURL=util.js.map