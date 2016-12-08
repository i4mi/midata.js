import { Resource } from './Resource';
import { assert } from './util';


// https://www.hl7.org/fhir/valueset-observation-status.html
export type ObservationStatus =
    'registered'       |
    'preliminary'      |
    'final'            |
    'amended'          |
    'cancelled'        |
    'entered-in-error' |
    'unknown';


function formatDate(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDay() + 1;

    function pad(x: number) {
        if (x < 10) {
            return '0' + x;
        } else {
            return x.toString();
        }
    }
    return `${year}-${pad(month)}-${pad(day)}`;
}


/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export class Observation extends Resource {

    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super('Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        // TODO: Properly format date according to FHIR standard
        this.addProperty('effectiveDateTime', formatDate(date));
        this.addProperty('valueQuantity', quantity);
    }
};

export class MultiObservation extends Resource {
    constructor(code: fhir.CodeableConcept, date: Date) {
        super('Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', formatDate(date));
        this.addProperty('component', []);
    }

    addComponent(component: fhir.ObservationComponent) {
        this._fhir.component.push(component);
    }
}
