/// <reference types="fhir" />
import { Observation } from './Observation';
export declare class Laboratory extends Observation {
    constructor(quantity: fhir.Quantity, date: Date, code: fhir.CodeableConcept);
}
