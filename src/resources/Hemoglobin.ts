import { Laboratory } from './Laboratory';
import { registerResource } from './registry';


@registerResource('718-7')
export class Hemoglobin extends Laboratory {
    constructor(gdl: number, date: Date) {
        let quanitity = {
            value: gdl,
            unit: 'g/dL'
        };
        super(quanitity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '718-7',
                display: 'Hemoglobin [Mass/volume] in Blood'
            }]
        });
    }
};

