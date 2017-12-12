import {Laboratory} from "./categories";
import {registerResource} from './registry';
import {Observation, Quantity, effectiveType} from "./Observation";

@registerResource('code', '718-7')
export class Hemoglobin extends Observation {
    constructor(gl: number, date: Date, withPeriodEndDate? : Date) {
        let quantity: Quantity = {
            _quantity: {
                value: gl,
                unit: 'g/L',
                system: 'http://unitsofmeasure.org',
                code: 'g/L'
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
                code: '718-7',
                display: 'Hemoglobin [Mass/volume] in Blood'
            }]
        }, Laboratory, quantity);
    }
}
;
