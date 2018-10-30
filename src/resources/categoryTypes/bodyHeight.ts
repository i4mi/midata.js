import { CAT_VITALSIGNS } from '../categories';
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ValueQuantity, ObservationEffective, OBSERVATIONSTATUS } from '../basicTypes';
import { COD_BODYHEIGHT } from '../codings';

@registerResource('code','8302-2')
export class BodyHeight extends Observation {
    constructor(heightCm: number, date: string, withPeriodEndDate? : string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: heightCm,
                unit: 'cm',
                system: 'http://unitsofmeasure.org',
                code:  'cm'
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

        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_BODYHEIGHT, value);
    }
};
