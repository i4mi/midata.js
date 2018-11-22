import { CAT_VITALSIGNS } from '../categories';
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ValueQuantity, ObservationEffective, OBSERVATIONSTATUS } from '../basicTypes';
import { COD_BODYTEMPERATURE } from '../codings';

@registerResource('code', '258710007')
export class Temperature extends Observation {
    constructor(tempC: number, date: string, withPeriodEndDate?: string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: tempC,
                unit: 'degrees C',
                system: 'http://snomed.info/sct',
                code: '258710007'
            }
        };

        let effectiveType: ObservationEffective;
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
        
        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_BODYTEMPERATURE, value);
    }
}
;
