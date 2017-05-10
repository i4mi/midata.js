/// <reference types="fhir" />
import { Resource } from './Resource';
/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export declare class Observation extends Resource {
    constructor(date: Date, code: fhir.CodeableConcept, category: fhir.CodeableConcept);
    addComponent(component: fhir.ObservationComponent): void;
    addRelated(resource: any): void;
}
export declare class ValueObservation extends Observation {
    constructor(valueType: valueType, date: Date, code: fhir.CodeableConcept, category: fhir.CodeableConcept);
    private _isValueQuantity(type);
    private _isCodeableConcept(type);
}
export interface ValueQuantity {
    _quantity: fhir.Quantity;
}
export interface CodeableConcept {
    _codeableConcept: fhir.CodeableConcept;
}
export declare type valueType = ValueQuantity | CodeableConcept;
