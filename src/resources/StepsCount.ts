import { VitalSigns } from './VitalSigns';
import { registerResource } from './registry';


@registerResource('activities/steps')
export class StepsCount extends VitalSigns {
    constructor(steps: number, date: Date) {
        let quanitity = {
            value: steps,
            unit: 'steps'
        };
        super(quanitity, date, {
            text: 'Steps',
            coding: [{
                system: 'http://midata.coop',
                code: 'activities/steps',
                display: 'Steps'
            }]
        });
    }
};

