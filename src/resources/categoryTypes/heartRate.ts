import { CAT_VITALSIGNS } from '../categories';
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ObservationEffective, ValueQuantity, OBSERVATIONSTATUS } from '../basicTypes';
import { COD_HEARTRATE } from '../codings';

@registerResource('code', '8867-4')
export class HeartRate extends Observation {
    constructor(beatsPerMinute: number, date: string, withPeriodEndDate?: string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: beatsPerMinute,
                unit: 'bpm',
                system: 'https://www.hl7.org/fhir/valueset-ucum-common.html',
                code: '{beats}/min' 
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

        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_HEARTRATE, value);
    }
};