import {Resource} from './Resource';
import ClaimItemDetail = fhir.ClaimItemDetail;

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


export class ValueObservation extends Observation {

    constructor(valueType: valueType,
                date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super(date, code, category);

        if (this._isValueQuantity(valueType)) {
            this.addProperty('valueQuantity', valueType._quantity);
        } else if (this._isCodeableConcept(valueType)) {
            this.addProperty('valueCodeableConcept', valueType._codeableConcept);
        } else {
            console.log("Internal Error");
        }
    }

    private _isValueQuantity(type: valueType): type is ValueQuantity {
        return (<ValueQuantity>type)._quantity !== undefined;
    }

    private _isCodeableConcept(type: valueType): type is CodeableConcept {
        return (<CodeableConcept>type)._codeableConcept !== undefined;
    }
}
;

export interface ValueQuantity {
    _quantity: fhir.Quantity
}

export interface CodeableConcept {
    _codeableConcept: fhir.CodeableConcept
}

export type valueType =

    ValueQuantity |
    CodeableConcept;