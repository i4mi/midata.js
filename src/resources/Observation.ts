import { Resource } from './Resource';


// https://www.hl7.org/fhir/valueset-observation-status.html
export type ObservationStatus =
    'registered'       |
    'preliminary'      |
    'final'            |
    'amended'          |
    'cancelled'        |
    'entered-in-error' |
    'unknown';

/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export class Observation extends Resource {

    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super('Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());
        this.addProperty('valueQuantity', quantity);
        this.addProperty('category', category);
    }
};

export class MultiObservation extends Resource {
    constructor(date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super('Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());
        this.addProperty('component', []);
        this.addProperty('category', category);
    }

    addComponent(component: fhir.ObservationComponent) {
        this._fhir.component.push(component);
    }
};
