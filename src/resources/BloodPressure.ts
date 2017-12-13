import { VitalSigns } from './categories';
import { registerResource } from './registry';
import {Observation, Period, DateTime, effectiveType} from "./Observation";


@registerResource('code', '55417-0')
export class BloodPressure extends Observation {
    constructor(systolic: number, diastolic: number, date: string, withPeriodEndDate?: string) {
        let code = {
            coding: [{
                system: "http://loinc.org",
                code: '55417-0',
                display: 'Blood Pressure'
            }]
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
        
        super(effectiveType, code, VitalSigns);

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
