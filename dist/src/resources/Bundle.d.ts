/// <reference types="fhir" />
import { Resource } from './Resource';
import { Promise } from "es6-promise";
export declare type BundleType = 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
export declare class Bundle extends Resource {
    constructor(type: BundleType);
    addEntry(method: fhir.code, url: fhir.uri, entry: Resource): Promise<string>;
}
