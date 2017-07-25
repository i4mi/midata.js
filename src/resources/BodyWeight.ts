import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

@registerResource('code', '29463-7')
export class BodyWeight extends Observation {
    constructor(weightKg: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: weightKg,
                unit: 'kg',
                system: 'http://unitsofmeasure.org',
                code: 'kg'
            }
        };
        super(date, {
            coding: [{
                system: 'http://loinc.org',
                code: '29463-7',
                display: 'Body weight'
            }]
        }, VitalSigns, quantity);
    }
}
;

