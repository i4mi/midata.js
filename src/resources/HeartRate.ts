import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

@registerResource('code', '8867-4')
export class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: beatsPerMinute,
                unit: 'bpm',
                // TODO: UCUM bpm missing?
            }
        };
        super(date, {
            coding: [{
                system: 'http://loinc.org',
                code: '8867-4',
                display: 'Heart Rate'
            }]
        }, VitalSigns, quantity);
    }
}
;