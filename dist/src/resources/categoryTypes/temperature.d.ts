import { Observation } from "../resourceTypes/observation";
export declare class Temperature extends Observation {
    constructor(tempC: number, date: string, withPeriodEndDate?: string);
}
