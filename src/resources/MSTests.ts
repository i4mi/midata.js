import {Survey} from "./categories";
import {Resource} from './Resource';
import {registerResource} from "./registry";
import {Observation} from "./Observation";

@registerResource('MSTests')
export class MSTests extends Observation {
    constructor(date: Date, comment: string) {
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MSTests",
                    display: "Kognitive und motorische Übungen von MS-Patienten"
                }
            ]
        };
        super(date, code, Survey);
        super.addProperty("comment", comment);
    }

    addRelated(resource: Resource) {
        super.addRelated(resource);
    }
}