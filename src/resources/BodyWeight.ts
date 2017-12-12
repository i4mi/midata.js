import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity, effectiveType} from "./Observation";

@registerResource('code', '29463-7')
export class BodyWeight extends Observation {
    constructor(weightKg: number, date: Date, withPeriodEndDate?: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: weightKg,
                unit: 'kg',
                system: 'http://unitsofmeasure.org',
                code: 'kg'
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
                code: '29463-7',
                display: 'Body weight'
            }]
        }, VitalSigns, quantity);
    }
}
;

