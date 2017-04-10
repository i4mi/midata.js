import { Laboratory as LaboratoryCategory } from './categories';
import {QuantityObservation} from "./Observation";


export class Laboratory extends QuantityObservation {
    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, LaboratoryCategory);
    }
};
