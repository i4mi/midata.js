import {Survey} from "./categories";
import {registerResource} from "./registry";
import {Observation} from "./Observation";

export type handSide = "left" | "right";
export type x = 1 | 2 | 3 | 4;

@registerResource('MSMotTestLine')
export class MSMotTestLine extends Observation {
    constructor(date: Date, handSide: handSide) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSMotTestLine",
                    display: "MS Motoriktest Linie nachzeichnen"
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

        super(date, code, Survey);

        super.addProperty("bodysite", bodySite);

    }


    addLxDuration(lxDuration: number, lValue: x) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSMotTestLine",
                    code: `L${lValue}_Duration`,
                    display: "Dauer zum Zeichnen der Linie"
                }]
            },
            valueQuantity: {
                value: lxDuration,
                unit: "s",
                code: "s",
                system: "http://unitsofmeasure.org"
            }
        })

    }

    addLxAvgDist(lxAvgDist: number, lValue: x) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSMotTestLine",
                    code: `L${lValue}_AvgDist`,
                    display: "Abweichung der gezeichneten Linie zur Referenzlinie in Pixel"
                }]
            },
            valueQuantity: {
                value: lxAvgDist
            }
        })

    }

    addlxStdDevDist(lxStdDevDist: number, lValue: x) {

        super.addComponent({
            code: {
                coding: [{
                    system: "http://midata.coop/MSMotTestLine",
                    code: `L${lValue}_StdDevDist`,
                    display: "Ähnlichkeit der Linien in Pixel"
                }]
            },
            valueQuantity: {
                value: lxStdDevDist
            }
        })

    }
}