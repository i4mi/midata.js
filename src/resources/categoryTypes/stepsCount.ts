import { CAT_VITALSIGNS } from "../categories";
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ObservationEffective, ValueQuantity, OBSERVATIONSTATUS } from "../basicTypes";
import { COD_STEPSADAY } from "../codings";

@registerResource('code', 'activities/steps')
export class StepsCount extends Observation {
    constructor(steps: number, date: string, withPeriodEndDate?: string) {
        let value: ValueQuantity = {
            valueQuantity: {
                value: steps,
                unit: 'steps'
                // TODO: UCUM steps missing? -- not existing -.-
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

        // TODO: Clarify, won't this interfere with MIDATA's Fitbit import?
        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_STEPSADAY, value);
    }
}
;

