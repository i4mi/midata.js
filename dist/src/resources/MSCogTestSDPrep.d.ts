import { Observation } from "./Observation";
export declare class MSCogTestSDPrep extends Observation {
    constructor(date: Date);
    addNbCorrect(correctAssignmentAmount: number): void;
    addNbIncorrect(incorrectAssignmentAmount: number): void;
    addDuration(duration: number): void;
    addClickFrequency(clickFreq: number): void;
}
