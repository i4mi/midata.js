import {Survey} from "./categories";
import {MiTrendsObservation, ObservationStatus} from "./Observation";
import {registerResource} from "./registry";

export type handSide = "left" | "right";

@registerResource('MSMotTestDot')
export class MSMotTestDot extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus, handSide: handSide) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSMotTestDot",
                    display: "MS Motoriktest Punkte bewegen"
                }
            ]
        };

        let bodySite = {
            coding: [
                {
                    system: "http://snowmed.info/sct",
                    code: handSide === "left" ? "368456002" : "368455003",
                    display: handSide === "left" ? "Linke Hand" : "Rechte Hand",
                }
            ]
        };

        super(date, code, Survey, status, bodySite);

    }

    addDuration(duration: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSMotTestDot",
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

    addPoints(pointsAmount: number) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSMotTestDot",
                    code: "Points",
                    display: "Erreichte Punktzahl"
                }]
            },
            valueQuantity: {
                value: pointsAmount
            }
        })

    }

}
;