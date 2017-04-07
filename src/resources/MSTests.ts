import {Survey} from "./categories";
import {MiTrendsObservation, ObservationStatus} from "./Observation";
import {Resource} from './Resource';
import {registerResource} from "./registry";

@registerResource('MSTests')
export class MSTests extends MiTrendsObservation {
    constructor(date: Date, status: ObservationStatus, comment: string) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSTests",
                    display: "Eine Gruppe von Resulaten von verschiedenen kognitiven und motorischen Übungen der MitrendS Applikation."
                }
            ]
        };

        // body side undefined
        super(date, code, Survey, status, undefined, comment);

    }

    addRelated(resource: Resource) {

        // in this context, only resources of type
        // MiTrendsObservations should be relatable

        if (resource instanceof MiTrendsObservation) {
            super.addRelated(resource);
        }
    }
}