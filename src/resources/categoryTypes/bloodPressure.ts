import { CAT_VITALSIGNS } from '../categories';
import { registerResource } from '../registry';
import { Observation } from "../resourceTypes/observation";
import { ObservationEffective, OBSERVATIONSTATUS } from '../basicTypes';
import { COD_BLOODPRESSURE } from '../codings';


@registerResource('code', '55417-0')
export class BloodPressure extends Observation {
    constructor(systolic: number, diastolic: number, date: string, withPeriodEndDate?: string) {
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
        
        super(effectiveType, OBSERVATIONSTATUS.preliminary, CAT_VITALSIGNS, COD_BLOODPRESSURE);

        this.addComponent({
            code: {
                coding: [{
                    system: "http://loinc.org",
                    code: "8480-6",
                    display: "Systolic blood pressure"
                }]
            },
            valueQuantity: {
                value: systolic,
                unit: 'mm[Hg]',
                code: 'mm[Hg]'
            }
        });

        this.addComponent({
            code: {
                coding: [{
                    system: "http://loinc.org",
                    code: "8462-4",
                    display: "Diastolic blood pressure"
                }]
            },
            valueQuantity: {
                value: diastolic,
                unit: 'mm[Hg]',
                system: 'http://unitsofmeasure.org',
                code: 'mm[Hg]'
            }
        });
    }
}
;
