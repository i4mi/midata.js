import {Survey} from './categories';
import {registerResource} from './registry';
import {MiTrendsObservation, ObservationStatus} from "./Observation";

@registerResource('MSCogTestLab')
export class MSCogTestLab extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus, tryAmount: number) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSCogTestLab",
                    display: "MS Kognitionstest Labyrinth"
                }
            ]
        };

        super(date, code, Survey, status);

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "TryNb",
                    display: "Versuch Nr."
                }]
            },
            valueQuantity: {
                value: tryAmount
            }
        })

    }

    addNbClicks(clickAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbClicks",
                    display: "Anzahl Klicks insgesamt"
                }]
            },
            valueQuantity: {
                value: clickAmount
            }
        })
    }

    addNbPointsLab(pointsLabAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbPointsLab",
                    display: "Anzahl Klicks auf Punkte des Labyrinths"
                }]
            },
            valueQuantity: {
                value: pointsLabAmount
            }
        })
    }

    addNbCorrectConnections(correctConnectionsAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbCorrectConnections",
                    display: "Anzahl der Verbindungen, in die richtige Richtung, der Testperson"
                }]
            },
            valueQuantity: {
                value: correctConnectionsAmount
            }
        })
    }

    addNbInvertedConnections(invertedConnectionsAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbInvertedConnections",
                    display: "Anzahl der Verbindungen, in die falsche Richtung, der Testperson"
                }]
            },
            valueQuantity: {
                value: invertedConnectionsAmount
            }
        })
    }

    addNbConnectionsGiven(connectionsGivenAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbConnectionsGiven",
                    display: "Anzahl der vorgegebenen Verbindungen"
                }]
            },
            valueQuantity: {
                value: connectionsGivenAmount
            }
        })
    }

    addNbErrors(errorAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbErrors",
                    display: "Anzahl Fehler"
                }]
            },
            valueQuantity: {
                value: errorAmount
            }
        })
    }

    addNbRuleBreaks(ruleBreakAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbRuleBreaks",
                    display: "Anzahl Regelbrüche"
                }]
            },
            valueQuantity: {
                value: ruleBreakAmount
            }
        })
    }

    addNbCorrections(correctionAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbCorrections",
                    display: "Anzahl Korrekturen"
                }]
            },
            valueQuantity: {
                value: correctionAmount
            }
        })
    }

    addScore(scoreAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "Score",
                    display: "Punktescore"
                }]
            },
            valueQuantity: {
                value: scoreAmount
            }
        })
    }

    addNbCorrectTries(correctTriesAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "NbCorrectTries",
                    display: "Anzahl richtige Versuche"
                }]
            },
            valueQuantity: {
                value: correctTriesAmount
            }
        })
    }

    addDuration(duration: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSCogTestLab",
                    code: "Duration",
                    display: "Dauer für den ganzen Weg in Sekunden"
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