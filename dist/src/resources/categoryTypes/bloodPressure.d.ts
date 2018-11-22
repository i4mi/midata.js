import { Observation } from "../resourceTypes/observation";
export declare class BloodPressure extends Observation {
    constructor(systolic: number, diastolic: number, date: string, withPeriodEndDate?: string);
}
