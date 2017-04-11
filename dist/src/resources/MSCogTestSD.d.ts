import { Observation } from "./Observation";
export declare class MSCogTestSD extends Observation {
    constructor(date: Date);
    addNbCorrectPartResults(data: string[]): void;
    addNbIncorrectPartResults(data: string[]): void;
    addClickFreqPartResults(data: string[]): void;
    addNbTotalCorrect(totalCorrectAmount: number): void;
    addNbTotalIncorrect(totalIncorrectAmount: number): void;
    addClickFrequency(clickFrequency: number): void;
    addDuration(duration: number): void;
    private _extractDataStream(data);
}
