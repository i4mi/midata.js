import { Survey as SurveyCategory } from './categories';
import {QuantityObservation} from "./Observation";


export class Survey extends QuantityObservation {
    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, SurveyCategory);
    }
};