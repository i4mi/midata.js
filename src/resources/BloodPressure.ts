import { VitalSigns } from './categories';
import { registerResource } from './registry';
import {Observation} from "./Observation";


@registerResource('55417-0')
export class BloodPressure extends Observation {
    constructor(systolic: number, diastolic: number, date: Date) {
        let code = {
            coding: [{
                system: "http://loinc.org",
                code: '55417-0',
                display: 'Blood Pressure'
            }]
        };
        super(date, code, VitalSigns);

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
                unit: 'mm[Hg]'
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
                unit: 'mm[Hg]'
            }
        });
    }
};
