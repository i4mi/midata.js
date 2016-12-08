import { Observation } from './Observation';

export class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: Date) {
        let quanitity = {
            value: beatsPerMinute,
            unit: 'bpm'
        };
        super(quanitity, date, {
            coding: [{
                system: 'http://loinc.org',
                code: '8867-4',
                display: 'Heart Rate'
            }]
        });
    }
};
