import { MiTrendsObservation, ObservationStatus } from "./Observation";
export declare class MSCogTestSDPrep extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus);
    addNbCorrect(correctAssignmentAmount: number): void;
    addNbIncorrect(incorrectAssignmentAmount: number): void;
    addDuration(duration: number): void;
    addClickFrequency(clickFreq: number): void;
}
