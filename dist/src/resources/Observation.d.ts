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
export declare class QuantityObservation extends Observation {
    constructor(quantity: fhir.Quantity, date: Date, code: fhir.CodeableConcept, category: fhir.CodeableConcept);
}
