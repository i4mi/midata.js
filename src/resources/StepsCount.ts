import {VitalSigns} from "./categories";
import {registerResource} from './registry';
import {ValueObservation, ValueQuantity} from "./Observation";

@registerResource('activities/steps')
export class StepsCount extends ValueObservation {
    constructor(steps: number, date: Date) {
        let quantity: ValueQuantity = {
            _quantity: {
                value: steps,
                unit: 'steps'
            }
        };
        super(quantity, date, {
            text: 'Steps',
            coding: [{
                system: 'http://midata.coop',
                code: 'activities/steps',
                display: 'Steps'
            }]
        }, VitalSigns);
    }
}
;

