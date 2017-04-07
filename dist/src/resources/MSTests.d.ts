import { MiTrendsObservation, ObservationStatus } from "./Observation";
import { Resource } from './Resource';
export declare class MSTests extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus, comment: string);
    addRelated(resource: Resource): void;
}
