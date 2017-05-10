import {Survey} from "./categories";
import {registerResource} from "./registry";
import {CodeableConcept, ValueObservation} from "./Observation";

@registerResource('228438002')
export class DrugCrave extends ValueObservation {
    constructor(midataCodingConcept: fhir.Coding, snomedCodingConcept: fhir.Coding, date: Date) {
        let codeableConcept: CodeableConcept = {
            _codeableConcept: {
                coding: [midataCodingConcept, snomedCodingConcept],
                text: "Craving for drugs"
            }
        };
        super(codeableConcept, date, {
            coding: [{
                system: 'http://snomed.info/sct',
                code: '228438002',
                display: 'Craves for drugs'
            }]
        }, Survey);
    }
}
;
