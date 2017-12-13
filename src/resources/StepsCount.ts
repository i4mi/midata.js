import {VitalSigns} from "./categories";
import {registerResource} from './registry';
import {Observation, Quantity, effectiveType} from "./Observation";

@registerResource('code', 'activities/steps')
export class StepsCount extends Observation {
    constructor(steps: number, date: string, withPeriodEndDate?: string) {
        let quantity: Quantity = {
            _quantity: {
                value: steps,
                unit: 'steps'
                // TODO: UCUM steps missing?
            }
        };

        let effectiveType : effectiveType;
                if(withPeriodEndDate){
                   effectiveType = {
                        _period : {
                            start: date,
                            end: withPeriodEndDate
                        }
                    }
                } else {
                    effectiveType  = {
                        _dateTime : date
                    }
                }

        // TODO: Clarify, won't this interfere with MIDATA's Fitbit import?
        super(effectiveType, {
            text: 'Steps [24 hour]',
            coding: [{
                system: 'http://loinc.org',
                code: '41950-7',
                display: 'Steps [24 hour]'
            }]
        }, VitalSigns, quantity);
    }
}
;

