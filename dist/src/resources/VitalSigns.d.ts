/// <reference types="fhir" />
import { QuantityObservation } from "./Observation";
export declare class VitalSigns extends QuantityObservation {
    constructor(quantity: fhir.Quantity, date: Date, code: fhir.CodeableConcept);
}
