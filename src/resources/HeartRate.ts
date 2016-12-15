import { VitalSigns } from './VitalSigns';
import { registerResource } from './registry';


@registerResource('8867-4')
export class HeartRate extends VitalSigns {
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
