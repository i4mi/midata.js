import { CAT_LABORATORY } from "../categories";
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ValueQuantity, ObservationEffective, OBSERVATIONSTATUS, ObservationStatus } from "../basicTypes";
import { COD_HEMOGLOBININBLOOD } from "../codings";

@registerResource('code', '718-7')
export class Hemoglobin extends Observation {
    constructor(gl: number, date: string, withPeriodEndDate? : string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: gl,
                unit: 'g/L',
                system: 'http://unitsofmeasure.org',
                code: 'g/L'
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

        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_LABORATORY, COD_HEMOGLOBININBLOOD, value);
    }
};
