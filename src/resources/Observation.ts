import {Resource} from './Resource';

/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export class Observation extends Resource {

    constructor(date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super('Observation');
        this.addProperty('status', 'preliminary');
        this.addProperty('category', category);
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());
    }

    addComponent(component: fhir.ObservationComponent) {

        if (this._fhir['component'] == null) {
            this.addProperty('component', []);
        }
        this._fhir.component.push(component);
    }

    addRelated(resource: Resource) {
        if (this._fhir['related'] == null) {
            this.addProperty('related', []);
        }
        this._fhir.related.push({

            type: "has-member",
            target: {
                reference: resource.reference
            }
        });
    }
}
;

export class QuantityObservation extends Observation {

    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super(date, code, category);
        this.addProperty('valueQuantity', quantity);
    }
}
;
