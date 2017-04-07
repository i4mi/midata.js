import {Survey} from './categories';
import {registerResource} from './registry';
import {MiTrendsObservation, ObservationStatus} from "./Observation";


@registerResource('MSCogTestSD')
export class MSCogTestSD extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSCogTestSD",
                    display: "MS Kognitionstest Symbol-Digit"
                }
            ]
        };

        super(date, code, Survey, status);

    }

    addNbCorrectPartResults(firstPeriod: string, secondPeriod: string, thirdPeriod: string, fourthPeriod: string) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "NbCorrectPartResults",
                    display: "Anzahl korrekte Zuordnungen Teilresultate"
                }]
            },
            valueSampledData: {
                origin: {
                    value: 0
                },
                period: 15000,
                dimensions: 1,
                data: `${firstPeriod} ${secondPeriod} ${thirdPeriod} ${fourthPeriod}`
            }
        })

    }


    addNbIncorrectPartResults(firstPeriod: string, secondPeriod: string, thirdPeriod: string, fourthPeriod: string) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "NbIncorrectPartResults",
                    display: "Anzahl inkorrekte Zuordnungen Teilresultate"
                }]
            },
            valueSampledData: {
                origin: {
                    value: 0
                },
                period: 15000,
                dimensions: 1,
                data: `${firstPeriod} ${secondPeriod} ${thirdPeriod} ${fourthPeriod}`
            }
        })

    }

    addClickFreqPartResults(firstPeriod: string, secondPeriod: string, thirdPeriod: string, fourthPeriod: string) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "ClickFrequencyPartResults",
                    display: "Klickfrequenz pro Minute Teilresultate"
                }]
            },
            valueSampledData: {
                origin: {
                    value: 25
                },
                period: 15000,
                dimensions: 1,
                data: `${firstPeriod} ${secondPeriod} ${thirdPeriod} ${fourthPeriod}`
            }
        })

    }


    addNbTotalCorrect(totalCorrectAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "NbTotalCorrect",
                    display: "Anzahl korrekte Zuordnungen insgesamt"
                }]
            },
            valueQuantity: {
                value: totalCorrectAmount
            }
        })

    }

    addNbTotalIncorrect(totalIncorrectAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "NbTotalIncorrect",
                    display: "Anzahl inkorrekte Zuordnungen insgesamt"
                }]
            },
            valueQuantity: {
                value: totalIncorrectAmount
            }
        })

    }

    addClickFrequency(clickFrequency: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
                    code: "ClickFrequency",
                    display: "Klickfrequenz pro Minute"
                }]
            },
            valueQuantity: {
                value: clickFrequency
            }
        })

    }

    addDuration(duration: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestSD",
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

}