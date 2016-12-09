import { Resource } from './Resource';


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
 * An occurrence of information being transmitted; e.g. an alert that was sent
 * to a responsible provider, a public health agency was notified about a
 * reportable condition.
 *
 * https://www.hl7.org/fhir/communication.html
 */
export class Communication extends Resource {

    constructor(sender, recipient, payload) {
        super('Communication');
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
