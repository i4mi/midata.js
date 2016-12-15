/// <reference types="fhir" />
import { Observation } from './Observation';
export declare class VitalSigns extends Observation {
    constructor(quantity: fhir.Quantity, date: Date, code: fhir.CodeableConcept);
}
