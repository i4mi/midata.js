import {registerResource} from "./registry";
import {CodeableConcept, ValueObservation} from "./Observation";
import {Survey} from "./categories";

@registerResource('228438002')
export class DrugCrave extends ValueObservation {
    constructor(midataConceptCoding: fhir.Coding, snomedConceptCoding: fhir.Coding, date: Date) {
        let codeableConcept: CodeableConcept = {
            _codeableConcept: {
                coding: [midataConceptCoding, snomedConceptCoding],
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
};
