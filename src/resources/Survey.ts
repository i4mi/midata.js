import { Survey as SurveyCategory } from './categories';
import { Observation } from './Observation';


export class Survey extends Observation {
    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, SurveyCategory);
    }
};