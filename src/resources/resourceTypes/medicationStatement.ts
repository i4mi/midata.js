import { Resource } from "./resource";
import { registerResource } from '../registry';
import { MedicationStatementStatus, MedicationStatementTaken } from "../basicTypes";

@registerResource('resourceType', 'MedicationStatement')
export class MedicationStatement extends Resource {

    constructor(date: Date,
                medication: fhir.CodeableConcept,
                status: MedicationStatementStatus,
                category: fhir.CodeableConcept,
                subject: fhir.Reference,
                taken: MedicationStatementTaken) {

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
