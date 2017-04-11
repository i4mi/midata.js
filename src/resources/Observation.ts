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

    // TODO: COMMENT

    addRelated(resource: any) {
        if (this._fhir['related'] == null) {
            this.addProperty('related', []);
        }

        let ref;
        if (resource instanceof Resource) {
            ref = resource.reference
        } else if (resource.resourceType && resource.id) {
            ref = `${resource.resourceType}/${resource.id}`
        } else {
            throw new Error("Error, invalid Object");
        }
        this._fhir.related.push({

            type: "has-member",
            target: {
                reference: ref
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