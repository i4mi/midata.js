import { VitalSigns as VitalSignsCategory } from './categories';
import {QuantityObservation} from "./Observation";


export class VitalSigns extends QuantityObservation {
    constructor(quantity: fhir.Quantity,
                date: Date,
                code: fhir.CodeableConcept) {
        super(quantity, date, code, VitalSignsCategory);
    }
};
