import { Observation } from "./Observation";
export declare type handSide = "left" | "right";
export declare class MSMotTestDot extends Observation {
    constructor(date: Date, handSide: handSide);
    addDuration(duration: number): void;
    addPoints(pointsAmount: number): void;
}
