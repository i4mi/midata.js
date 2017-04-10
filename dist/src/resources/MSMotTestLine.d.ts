import { Observation } from "./Observation";
export declare type handSide = "left" | "right";
export declare type x = 1 | 2 | 3 | 4;
export declare class MSMotTestLine extends Observation {
    constructor(date: Date, handSide: handSide);
    addLxDuration(lxDuration: number, lValue: x): void;
    addLxAvgDist(lxAvgDist: number, lValue: x): void;
    addlxStdDevDist(lxStdDevDist: number, lValue: x): void;
}
