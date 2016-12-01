import { Observation } from './Observation';

export class BodyWeight extends Observation {
    constructor(weightKg: number, date: Date) {
        let quanitity = {
            value: weightKg,
            unit: 'kg',
            system: 'http://unitsofmeasure.org'
        };
        super(quanitity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '3141-9',
                display: 'Weight Measured'
            }]
        });
    }
};
