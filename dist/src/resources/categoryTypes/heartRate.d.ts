import { Observation } from "../resourceTypes/observation";
export declare class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: string, withPeriodEndDate?: string);
}
