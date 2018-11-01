import { Observation } from '../resourceTypes/observation';
/**
 * Handedness of a patient
 */
export declare class Handedness extends Observation {
    constructor(handSide: string, date: string, withPeriodEndDate?: string);
}
