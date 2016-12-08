import { Observation } from './Observation';

export class StepsCount extends Observation {
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

