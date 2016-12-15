/// <reference types="fhir" />
import { Resource } from './Resource';
export declare type ObservationStatus = 'registered' | 'preliminary' | 'final' | 'amended' | 'cancelled' | 'entered-in-error' | 'unknown';
/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export declare class Observation extends Resource {
    constructor(quantity: fhir.Quantity, date: Date, code: fhir.CodeableConcept, category: fhir.CodeableConcept);
}
export declare class MultiObservation extends Resource {
    constructor(date: Date, code: fhir.CodeableConcept, category: fhir.CodeableConcept);
    addComponent(component: fhir.ObservationComponent): void;
}
