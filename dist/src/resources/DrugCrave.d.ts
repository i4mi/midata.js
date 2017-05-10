/// <reference types="fhir" />
import { ValueObservation } from "./Observation";
export declare class DrugCrave extends ValueObservation {
    constructor(systemConceptCoding: [fhir.Coding], date: Date);
}
