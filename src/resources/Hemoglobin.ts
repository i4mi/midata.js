import {Laboratory} from "./categories";
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

@registerResource('718-7')
export class Hemoglobin extends Observation {
    constructor(gdl: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: gdl,
                unit: 'g/dL',
                system: 'http://unitsofmeasure.org',
                code: 'g/dL'
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