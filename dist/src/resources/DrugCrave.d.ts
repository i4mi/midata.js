/// <reference types="fhir" />
import { ValueObservation } from "./Observation";
export declare class DrugCrave extends ValueObservation {
    constructor(midataConceptCoding: fhir.Coding, snomedConceptCoding: fhir.Coding, date: Date);
}
