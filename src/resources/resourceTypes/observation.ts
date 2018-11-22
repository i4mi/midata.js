import { Resource } from './resource';
import { InvalidCallError } from '../../errors/InvalidCallError'
import { registerResource } from '../registry';
import { ObservationEffective, ObservationValue, EffectiveDateTime, EffectivePeriod, 
         ValueQuantity, ValueDateTime, ValueTime, ValueString, ValueAttachment, 
         ValueCodeableConcept, ValueRange, ValueRatio, ValueSampledData, ValuePeriod, 
         ObservationStatus } from '../basicTypes';

/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
@registerResource('resourceType', 'Observation')
export class Observation extends Resource {

    // TODO: Test & eventually change param to any

    private static DateRegExp = new RegExp('^-\?\[0-9\]\{4\}\(-\(0\[1-9\]\|1\[0-2\]\)\(-\(0\[0-9\]\|\[1-2\]\[0-9\]\|3\[0-1\]\)\(T\(\[01\]\[0-9\]\|2\[0-3\]\):\[0-5\]\[0-9\]:\[0-5\]\[0-9\]\(\\\.\[0-9\]\+\)\?\(Z\|\(\\\+\|-\)\(\(0\[0-9\]\|1\[0-3\]\):\[0-5\]\[0-9\]\|14:00\)\)\)\?\)\?\)\?$');

    /**
     * 
     * @param effectiveType ObservationEffective
     * @param status ObservationStatus
     * @param category CodeableConcept
     * @param code CodeableConcept
     * @param valueType ObservationValue
     */
    constructor(effectiveType: ObservationEffective,
                status: ObservationStatus,
                category: fhir.CodeableConcept,
                code: fhir.CodeableConcept,
                valueType?: ObservationValue) {
        super('Observation');
        
        // check type of effective property
        if (effectiveType) { // TODO: clarify; according to FHIR effective[x] property could be 0..1
            if (this._isDateTime(effectiveType)) {
                if(Observation.DateRegExp.test(effectiveType.effectiveDateTime)){
                    this.addProperty('effectiveDateTime', effectiveType.effectiveDateTime)
                } else {
                    throw new InvalidCallError("Regex mismatch!");
                }
            } else if (this._isPeriod(effectiveType)) {
                if((Observation.DateRegExp.test(effectiveType.effectivePeriod.start)) && (Observation.DateRegExp.test(effectiveType.effectivePeriod.end))){
                    this.addProperty('effectivePeriod', effectiveType.effectivePeriod)
                } else {
                    throw new InvalidCallError("Regex mismatch!");
                }
            } else {
                console.log("Internal Error");
            }
        }

        // check type of value property
        if (valueType) {
            if (this._isValueQuantity(valueType)) {
                this.addProperty('valueQuantity', valueType.valueQuantity);
            } 
            else if (this._isValueDateTime(valueType)) {
                this.addProperty('valueDateTime', valueType.valueDateTime);
            } 
            else if (this._isValueTime(valueType)) {
                this.addProperty('valueTime', valueType.valueTime);
            }
            else if (this._isValueString(valueType)) {
                this.addProperty('valueString', valueType.valueString);
            }
            else if (this._isValueAttachment(valueType)) {
                this.addProperty('valueAttachment', valueType.valueAttachment);
            }
            else if (this._isValueCodeableConcept(valueType)) {
                this.addProperty('valueCodeableConcept', valueType.valueCodeableConcept);
            } 
            else if (this._isValueRange(valueType)) {
                this.addProperty('valueRange', valueType.valueRange);
            }
            else if (this._isValueRatio(valueType)) {
                this.addProperty('valueRatio', valueType.valueRatio);
            }
            else if (this._isValueSampledData(valueType)) {
                this.addProperty('valueSampledData', valueType.valueSampledData);
            }
            else if (this._isValuePeriod(valueType)) {
                this.addProperty('valuePeriod', valueType.valuePeriod);
            }
            else {
                console.log("Internal Error");
            }
        }

        this.addProperty('status', status);
        this.addProperty('category', category);
        this.addProperty('code', code);
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
    
    /**
     * --------------------------------------------------------------------------------
     *                                  value[x] type determinators
     */
    private _isValueQuantity(type: ObservationValue): type is ValueQuantity {
        return (<ValueQuantity>type).valueQuantity !== undefined;
    }

    private _isValueDateTime(type: ObservationValue): type is ValueDateTime {
        return (<ValueDateTime>type).valueDateTime !== undefined;
    }

    private _isValueTime(type: ObservationValue): type is ValueTime {
        return (<ValueTime>type).valueTime !== undefined;
    }

    private _isValueString(type: ObservationValue): type is ValueString {
        return (<ValueString>type).valueString !== undefined;
    }

    private _isValueAttachment(type: ObservationValue): type is ValueAttachment {
        return (<ValueAttachment>type).valueAttachment !== undefined;
    }

    private _isValueCodeableConcept(type: ObservationValue): type is ValueCodeableConcept {
        return (<ValueCodeableConcept>type).valueCodeableConcept !== undefined;
    }

    private _isValueRange(type: ObservationValue): type is ValueRange {
        return (<ValueRange>type).valueRange !== undefined;
    }

    private _isValueRatio(type: ObservationValue): type is ValueRatio {
        return (<ValueRatio>type).valueRatio !== undefined;
    }

    private _isValueSampledData(type: ObservationValue): type is ValueSampledData {
        return (<ValueSampledData>type).valueSampledData !== undefined;
    }

    private _isValuePeriod(type: ObservationValue): type is ValuePeriod {
        return (<ValuePeriod>type).valuePeriod !== undefined;
    }

    /**
     * --------------------------------------------------------------------------------
     *                                  effective[x] type determinators
     */
    private _isDateTime(type: ObservationEffective) : type is EffectiveDateTime {
        return (<EffectiveDateTime>type).effectiveDateTime !== undefined;
    }

    private _isPeriod(type: ObservationEffective) : type is EffectivePeriod {
        return (<EffectivePeriod>type).effectivePeriod !== undefined;
    }
};