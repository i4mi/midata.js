import {Survey} from './categories';
import {registerResource} from './registry';
import {Observation} from "./Observation";

@registerResource('MSCogTestSDPrep')
export class MSCogTestSDPrep extends Observation {
    constructor(date: Date) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSCogTestSDPrep",
                    display: "MS Kognitionstest Symbol-Digit Probelauf"
                }
            ]
        };

        super(date, code, Survey);

    }


    addNbCorrect(correctAssignmentAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSDPrep",
                    code: "NbCorrect",
                    display: "Anzahl korrekte Zuordnungen"
                }]
            },
            valueQuantity: {
                value: correctAssignmentAmount
            }
        })

    }

    addNbIncorrect(incorrectAssignmentAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSDPrep",
                    code: "NbIncorrect",
                    display: "Anzahl inkorrekte Zuordnungen"
                }]
            },
            valueQuantity: {
                value: incorrectAssignmentAmount
            }
        })

    }


    addDuration(duration: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSDPrep",
                    code: "Duration",
                    display: "Dauer der Übung"
                }]
            },
            valueQuantity: {
                value: duration,
                unit: "s",
                code: "s",
                system: "http://unitsofmeasure.org"
            }
        })

    }

    addClickFrequency(clickFreq: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSDPrep",
                    code: "ClickFrequency",
                    display: "Klickfrequenz pro Minute"
                }]
            },
            valueQuantity: {
                value: clickFreq
            }
        });

    }
};