import {Laboratory} from "./categories";
import {registerResource} from './registry';
import {ValueObservation, ValueQuantity} from "./Observation";

@registerResource('718-7')
export class Hemoglobin extends ValueObservation {
    constructor(gdl: number, date: Date) {
        let quantity: ValueQuantity = {
            _quantity: {
                value: gdl,
                unit: 'g/dL'
            }
        };
        super(quantity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '718-7',
                display: 'Hemoglobin [Mass/volume] in Blood'
            }]
        }, Laboratory);
    }
}
;