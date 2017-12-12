/// <reference types="fhir" />
import { Resource } from './Resource';
/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export declare class Observation extends Resource {
    constructor(effectiveType: effectiveType, code: fhir.CodeableConcept, category: fhir.CodeableConcept, valueType?: valueType);
    private _isValueQuantity(type);
    private _isCodeableConcept(type);
    private _isDateTime(type);
    private _isPeriod(type);
    addComponent(component: fhir.ObservationComponent): void;
    addRelated(resource: any): void;
}
export interface Quantity {
    _quantity: fhir.Quantity;
}
export interface CodeableConcept {
    _codeableConcept: fhir.CodeableConcept;
}
export interface DateTime {
    _dateTime: fhir.dateTime;
}
export interface Period {
    _period: fhir.Period;
}
export declare type valueType = Quantity | CodeableConcept;
export declare type effectiveType = DateTime | Period;
