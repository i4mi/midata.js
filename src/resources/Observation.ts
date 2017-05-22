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

    addRelated(resource: any) {
        if (this._fhir['related'] == null) {
            this.addProperty('related', []);
        }
        // Instances of type Resource defined by the midata.js library
        // possess a reference method. Therefore, the relative reference can be build by invoking
        // this method. Since the relative id consists of two values (resource type and resource id)
        // concatenated by a slash (/), the method can also build the relative id directly during invocation.
        // This presumes, however, that passed resources hold on to the FHIR base resource definition.
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

export class ValueObservation extends Observation {

    constructor(valueType: valueType,
                date: Date,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept) {
        super(date, code, category);
        // check type of value property
        if (this._isValueQuantity(valueType)) {
            this.addProperty('valueQuantity', valueType._quantity);
        } else if (this._isCodeableConcept(valueType)) {
            this.addProperty('valueCodeableConcept', valueType._codeableConcept);
        } else {
            console.log("Internal Error");
        }
    }

    // Determine the type by using user-defined type guards.

    private _isValueQuantity(type: valueType): type is ValueQuantity {
        return (<ValueQuantity>type)._quantity !== undefined;
    }
    private _isCodeableConcept(type: valueType): type is CodeableConcept {
        return (<CodeableConcept>type)._codeableConcept !== undefined;
    }
}
;

// Definition of interfaces each declaring it's property with the corresponding value[x] type (see below).

export interface ValueQuantity {
    _quantity: fhir.Quantity
}

export interface CodeableConcept {
    _codeableConcept: fhir.CodeableConcept
}

// The information determined as a result of making the observation.
// The element, Observation.value[x], has a variable name depending on the type as follows:
// valueQuantity, valueCodeableConcept, valueRatio, valueChoice, valuePeriod, valueSampleData, or valueString
// See https://www.hl7.org/fhir/observation-definitions.html#Observation.component.value_x_

export type valueType =

    ValueQuantity |
    CodeableConcept;