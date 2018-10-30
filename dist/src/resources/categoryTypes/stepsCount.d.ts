import { Observation } from "../resourceTypes/observation";
export declare class StepsCount extends Observation {
    constructor(steps: number, date: string, withPeriodEndDate?: string);
}
