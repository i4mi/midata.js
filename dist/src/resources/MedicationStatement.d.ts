/// <reference types="fhir" />
import { Resource } from "./Resource";
export declare type medicationStatus = "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold";
export declare type medicationTaken = "y" | "n" | "unk" | "na";
export declare class MedicationStatement extends Resource {
    constructor(date: Date, medication: fhir.CodeableConcept, status: medicationStatus, category: fhir.CodeableConcept, subject: fhir.Reference, taken: medicationTaken);
}
