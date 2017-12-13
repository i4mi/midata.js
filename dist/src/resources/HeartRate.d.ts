import { Observation } from "./Observation";
export declare class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: string, withPeriodEndDate?: string);
}
