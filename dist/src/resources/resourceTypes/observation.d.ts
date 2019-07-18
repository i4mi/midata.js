/// <reference types="fhir" />
import { Resource } from './resource';
import { ObservationEffective, ObservationValue, ObservationStatus } from '../basicTypes';
/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
export declare class Observation extends Resource {
    private static DateRegExp;
    /**
     *
     * @param effectiveType ObservationEffective
     * @param status ObservationStatus
     * @param category CodeableConcept
     * @param code CodeableConcept
     * @param valueType ObservationValue
     */
    constructor(effectiveType: ObservationEffective, status: ObservationStatus, category: fhir.CodeableConcept, code: fhir.CodeableConcept, valueType?: ObservationValue);
    addComponent(component: fhir.ObservationComponent): void;
    addRelated(resource: any): void;
    /**
     * --------------------------------------------------------------------------------
     *                                  value[x] type determinators
     */
    private _isValueQuantity;
    private _isValueDateTime;
    private _isValueTime;
    private _isValueString;
    private _isValueAttachment;
    private _isValueCodeableConcept;
    private _isValueRange;
    private _isValueRatio;
    private _isValueSampledData;
    private _isValuePeriod;
    /**
     * --------------------------------------------------------------------------------
     *                                  effective[x] type determinators
     */
    private _isDateTime;
    private _isPeriod;
}
