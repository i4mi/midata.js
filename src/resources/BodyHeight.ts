import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity, effectiveType} from "./Observation";

@registerResource('code','8302-2')
export class BodyHeight extends Observation {
    constructor(heightCm: number, date: string, withPeriodEndDate? : string) {
        let quantity: Quantity = {
            _quantity: {
                value: heightCm,
                unit: 'cm',
                system: 'http://unitsofmeasure.org',
                code:  'cm'
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

        super(effectiveType, {
            coding: [{
                system: 'http://loinc.org',
                code: '8302-2',
                display: 'Body Height'
            }]
        }, VitalSigns, quantity);
    }
}
;
