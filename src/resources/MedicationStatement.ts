import {Resource} from "./Resource";
import {registerResource} from './registry';

// https://www.hl7.org/fhir/codesystem-medication-statement-status.html

export type medicationStatus =
    "active" |
    "completed" |
    "entered-in-error" |
    "intended" |
    "stopped" |
    "on-hold";

// http://hl7.org/fhir/medication-statement-taken

export type medicationTaken =
    "y" |
    "n" |
    "unk" |
    "na";

@registerResource('resourceType', 'MedicationStatement')
export class MedicationStatement extends Resource {

    constructor(date: Date,
                medication: fhir.CodeableConcept,
                status: medicationStatus,
                category: fhir.CodeableConcept,
                subject: fhir.Reference,
                taken: medicationTaken) {

        super('MedicationStatement');

        this.addProperty('status', status);
        this.addProperty('category', category);
        // TODO: here also a reference to another medication entry could be provided
        this.addProperty('medicationCodeableConcept', medication);
        // TODO: this could also be set to a time period
        this.addProperty('effectiveDateTime', date.toISOString());
        this.addProperty('subject', subject);
        this.addProperty('taken', taken);
    }
}
