import { CAT_VITALSIGNS } from '../categories';
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ValueQuantity, ObservationEffective, OBSERVATIONSTATUS } from '../basicTypes';
import { COD_BODYWEIGHT } from '../codings';

@registerResource('code', '29463-7')
export class BodyWeight extends Observation {
    constructor(weightKg: number, date: string, withPeriodEndDate?: string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: weightKg,
                unit: 'kg',
                system: 'http://unitsofmeasure.org',
                code: 'kg'
            }
        };

        let effectiveType : ObservationEffective;
                if(withPeriodEndDate){
                   effectiveType = {
                        effectivePeriod : {
                            start: date,
                            end: withPeriodEndDate
                        }
                    }
                } else {
                    effectiveType  = {
                        effectiveDateTime : date
                    }
                }

        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_BODYWEIGHT, value);
    }
};

