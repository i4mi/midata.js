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
    private _isValueQuantity(type);
    private _isValueDateTime(type);
    private _isValueTime(type);
    private _isValueString(type);
    private _isValueAttachment(type);
    private _isValueCodeableConcept(type);
    private _isValueRange(type);
    private _isValueRatio(type);
    private _isValueSampledData(type);
    private _isValuePeriod(type);
    /**
     * --------------------------------------------------------------------------------
     *                                  effective[x] type determinators
     */
    private _isDateTime(type);
    private _isPeriod(type);
}
