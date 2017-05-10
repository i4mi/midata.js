/// <reference types="fhir" />
import { ValueObservation } from "./Observation";
export declare class DrugCrave extends ValueObservation {
    constructor(midataCodingConcept: fhir.Coding, snomedCodingConcept: fhir.Coding, date: Date);
}
