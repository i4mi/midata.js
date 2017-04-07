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



export class MiTrendsObservation extends Resource {
    constructor(date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept,
                status: ObservationStatus,
                bodySite?: fhir.CodeableConcept,
                comment?: string) {
        super('Observation');
        this.addProperty('status', status);
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());

        if (bodySite) {
            this.addProperty('bodySite', bodySite); // added for MitrendS
        }

        if (comment) {
            this.addProperty('comment', comment); //
        }

        this.addProperty('component', []);
        this.addProperty('category', category);
    }

    addComponent(component: fhir.ObservationComponent) {
        this._fhir.component.push(component);
    }


    addRelated(resource: Resource){
        if (this._fhir['related'] == null){ // check null or undefined
            this.addProperty('related', []);
        }
        this._fhir.related.push({ // push reference from handed resource

            type: "has-member",
            target: {
                reference: resource.reference
            }
        });
    }
};
