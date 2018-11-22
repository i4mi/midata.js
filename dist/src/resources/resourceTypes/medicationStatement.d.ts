/// <reference types="fhir" />
import { Resource } from "./resource";
import { MedicationStatementStatus, MedicationStatementTaken } from "../basicTypes";
export declare class MedicationStatement extends Resource {
    constructor(date: Date, medication: fhir.CodeableConcept, status: MedicationStatementStatus, category: fhir.CodeableConcept, subject: fhir.Reference, taken: MedicationStatementTaken);
}
