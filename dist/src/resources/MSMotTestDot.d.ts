import { MiTrendsObservation, ObservationStatus } from "./Observation";
export declare type handSide = "left" | "right";
export declare class MSMotTestDot extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus, handSide: handSide);
    addDuration(duration: number): void;
    addPoints(pointsAmount: number): void;
}
