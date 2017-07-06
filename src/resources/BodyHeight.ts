import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

@registerResource('code','8302-2')
export class BodyHeight extends Observation {
    constructor(heightCm: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: heightCm,
                unit: 'cm',
                system: 'http://unitsofmeasure.org',
                code:  'cm'
            }
        };
        super(date, {
            coding: [{
                system: 'http://loinc.org',
                code: '8302-2',
                display: 'Body Height'
            }]
        }, VitalSigns, quantity);
    }
}
;
