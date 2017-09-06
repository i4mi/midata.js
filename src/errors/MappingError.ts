import {MidataJSError} from "./MidataJSError";

export class MappingError extends MidataJSError {
    constructor(message?: string){
        super(message || 'Mapping failure due to FHIR Resource structure violation');
        Object.setPrototypeOf(this, MappingError.prototype);
    };
};
