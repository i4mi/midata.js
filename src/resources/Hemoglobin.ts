import {Laboratory} from "./categories";
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

@registerResource('code', '718-7')
export class Hemoglobin extends Observation {
    constructor(gl: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: gl,
                unit: 'g/L',
                system: 'http://unitsofmeasure.org',
                code: 'g/L'
            }
        };
        super(date, {
            coding: [{
                system: 'http://loinc.org',
                code: '718-7',
                display: 'Hemoglobin [Mass/volume] in Blood'
            }]
        }, Laboratory, quantity);
    }
}
;
