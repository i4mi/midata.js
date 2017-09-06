import {MidataJSError} from "./MidataJSError";

export class UnknownEndpointError extends MidataJSError {
    constructor(message?: string){
        super(message || 'MIDATA conformance statement endpoint unknown! Try calling changePlatform() with a valid endpoint in order to fix this issue');
        Object.setPrototypeOf(this, UnknownEndpointError.prototype);
    };
};