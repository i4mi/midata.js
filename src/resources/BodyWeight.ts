import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {ValueObservation, ValueQuantity} from "./Observation";

@registerResource('3141-9')
export class BodyWeight extends ValueObservation {
    constructor(weightKg: number, date: Date) {
        let quantity: ValueQuantity = {
            _quantity: {
                value: weightKg,
                unit: 'kg',
                system: 'http://unitsofmeasure.org'
            }
        };
        super(quantity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '3141-9',
                display: 'Weight Measured'
            }]
        }, VitalSigns);
    }
}
;

