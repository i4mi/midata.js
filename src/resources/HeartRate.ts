import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity, effectiveType} from "./Observation";

@registerResource('code', '8867-4')
export class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: Date, withPeriodEndDate?: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: beatsPerMinute,
                unit: 'bpm',
                // TODO: UCUM bpm missing?
            }
        };

        let effectiveType : effectiveType;
                if(withPeriodEndDate){
                   effectiveType = {
                        _period : {
                            start: date.toISOString(),
                            end: withPeriodEndDate.toISOString()
                        }
                    }
                } else {
                    effectiveType  = {
                        _dateTime : date.toISOString()
                    }
                }

        super(effectiveType, {
            coding: [{
                system: 'http://loinc.org',
                code: '8867-4',
                display: 'Heart Rate'
            }]
        }, VitalSigns, quantity);
    }
}
;