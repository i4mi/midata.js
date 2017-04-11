import { Observation } from "./Observation";
export declare class MSCogTestSD extends Observation {
    constructor(date: Date);
    addNbCorrectPartResults(data: String[]): void;
    addNbIncorrectPartResults(firstPeriod: string, secondPeriod: string, thirdPeriod: string, fourthPeriod: string): void;
    addClickFreqPartResults(firstPeriod: string, secondPeriod: string, thirdPeriod: string, fourthPeriod: string): void;
    addNbTotalCorrect(totalCorrectAmount: number): void;
    addNbTotalIncorrect(totalIncorrectAmount: number): void;
    addClickFrequency(clickFrequency: number): void;
    addDuration(duration: number): void;
}
