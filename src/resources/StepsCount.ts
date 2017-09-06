import {VitalSigns} from "./categories";
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

// TODO: Change to LOINC Code
@registerResource('code', 'activities/steps')
export class StepsCount extends Observation {
    constructor(steps: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: steps,
                unit: 'steps'
                // TODO: UCUM steps missing?
            }
        };
        super(date, {
            text: 'Steps',
            coding: [{
                system: 'http://midata.coop',
                code: 'activities/steps',
                display: 'Steps'
            }]
        }, VitalSigns, quantity);
    }
}
;

