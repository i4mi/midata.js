import { Observation } from '../resourceTypes/observation';
import { ValueCodeableConcept } from '../basicTypes';
/**
 * Handedness of a patient
 */
export declare class Handedness extends Observation {
    constructor(handSide: string, date: string, withPeriodEndDate?: string);
    setHandedness(handSide: string): void;
    changeHandedness(handSide: string): void;
    resolveValueCodeableConcept(handSide: string): ValueCodeableConcept;
}
