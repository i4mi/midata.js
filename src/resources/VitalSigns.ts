import { VitalSigns as VitalSignsCategory } from './categories';
import { Observation } from './Observation';


export class VitalSigns extends Observation {

    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, VitalSignsCategory);
    }
};
