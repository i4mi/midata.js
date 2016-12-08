import { MultiObservation} from './Observation';

export class BloodPressure extends MultiObservation{
    constructor(systolic: number, diastolic: number, date: Date) {
        let code = {
            coding: [{
                system: "http://loinc.org",
                // code: '55284-4',
                // display: "Blood pressure systolic & diastolic"
                // According to midata:
                code: '55417-0',
                display: 'Blood Pressure'
            }]
        };
        super(code, date);

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
