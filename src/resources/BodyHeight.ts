import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {ValueObservation, ValueQuantity} from "./Observation";

@registerResource('8302-2')
export class BodyHeight extends ValueObservation {
    constructor(heightCm: number, date: Date) {
        let quantity: ValueQuantity = {
            _quantity: {
                value: heightCm,
                unit: 'cm',
                system: 'http://unitsofmeasure.org'
            }
        };
        super(quantity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '8302-2',
                display: 'Body Height'
            }]
        }, VitalSigns);
    }
}
;
