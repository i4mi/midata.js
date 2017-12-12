import {Resource} from './Resource';
import ClaimItemDetail = fhir.ClaimItemDetail;
import {registerResource} from './registry';

/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
@registerResource('resourceType', 'Observation')
export class Observation extends Resource {

    constructor(effectiveType: effectiveType,
                code: fhir.CodeableConcept,
                category: fhir.CodeableConcept,
                valueType?: valueType) {
        super('Observation');
        
        // check type of effective property

        if (effectiveType) { // TODO: clarify; according to FHIR effective[x] property could be 0..1
            if (this._isDateTime(effectiveType)) {
                this.addProperty('effectiveDateTime', effectiveType._dateTime)
            } else if (this._isPeriod(effectiveType)) {
                this.addProperty('effectivePeriod', effectiveType._period)
            } else {
                console.log("Internal Error");
            }
        }

        // check type of value property
        if (valueType) {
            if (this._isValueQuantity(valueType)) {
                this.addProperty('valueQuantity', valueType._quantity);
            } else if (this._isCodeableConcept(valueType)) {
                this.addProperty('valueCodeableConcept', valueType._codeableConcept);
            } else {
                console.log("Internal Error");
            }
        }
        this.addProperty('status', 'preliminary');
        this.addProperty('category', category);
        this.addProperty('code', code);
    }

    // Determine the type by using user-defined type guards.

    private _isValueQuantity(type: valueType): type is Quantity {
        return (<Quantity>type)._quantity !== undefined;
    }

    private _isCodeableConcept(type: valueType): type is CodeableConcept {
        return (<CodeableConcept>type)._codeableConcept !== undefined;
    }

    private _isDateTime(type: effectiveType) : type is DateTime {
        return (<DateTime>type)._dateTime !== undefined;
    }

    private _isPeriod(type: effectiveType) : type is Period {
        return (<Period>type)._period !== undefined;
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

// Definition of interfaces each declaring it's property with the corresponding value[x] type (see below).

// Observation.value[x]
// Interfaces representing the somewhat polymorphic property value[x]
export interface Quantity {
    _quantity: fhir.Quantity
}
export interface CodeableConcept {
    _codeableConcept: fhir.CodeableConcept
}

// Observation.effective[x]
// Interfaces representing the somewhat polymorphic property effective[x]

export interface DateTime {
    _dateTime: fhir.dateTime // TODO: Clarify; Fhir defines dateTime as xs:string, though should we guard for Date here?
}

export interface Period {
    _period: fhir.Period // TODO: Clarify; Fhir defines dateTime as xs:string, though should we guard for Date here?
}


// The information determined as a result of making the observation.
// The element, Observation.value[x], has a variable name depending on the type as follows:
// valueQuantity, valueCodeableConcept, valueRatio, valueChoice, valuePeriod, valueSampleData, or valueString
// See https://www.hl7.org/fhir/observation-definitions.html#Observation.component.value_x_

export type valueType =

    Quantity |
    CodeableConcept;


// The time or time-period the observed value is asserted as being true.
// The element, Observation.effective[x], has a variable name depending on the type as follows:
// dateTime, Period
// See https://www.hl7.org/fhir/observation-definitions.html#Observation.effective_x_

export type effectiveType =

    DateTime |
    Period;