import {MidataJSError} from "./MidataJSError";

export class InvalidCallError extends MidataJSError {
    constructor(message?: string){
        super(message || 'The operation failed due to faulty function call ');
        Object.setPrototypeOf(this, InvalidCallError.prototype);
    };
};
