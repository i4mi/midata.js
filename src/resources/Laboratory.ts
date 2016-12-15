import { Laboratory as LaboratoryCategory } from './categories';
import { Observation } from './Observation';


export class Laboratory extends Observation {
    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, LaboratoryCategory);
    }
};
