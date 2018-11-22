/// <reference types="fhir" />
import { Resource } from './resource';
import { Promise } from "es6-promise";
import { BundleType, HTTPVerb } from '../basicTypes';
export declare class Bundle extends Resource {
    constructor(type: BundleType);
    addEntry(method: HTTPVerb, url: fhir.uri, entry: Resource): Promise<string>;
    getObservationEntries(withCode?: fhir.code): any;
    getQuestionnaireResponseEntries(withCode?: fhir.code): any;
    getEntries(resType: String, withCode?: fhir.code): any;
    getEntry(withId: string): fhir.BundleEntry;
}
