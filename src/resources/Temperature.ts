import {VitalSigns} from './categories';
import {registerResource} from './registry';
import {Observation, Quantity} from "./Observation";

const tempCode = {
    "coding": [
        {
            "system": "http://acme.lab",
            "code": "BT",
            "display": "Body temperature"
        },
        // LOINC and SNOMED CT translations here - Note in the US the primary code
        // will be LOINC per meaningful use.  Further SNOMED CT  has acceeded
        // to LOINC being the primary coding system for vitals and
        // anthropromorphic measures.  SNOMED CT is required in some
        // countries such as the UK.
        {
            "system": "http://loinc.org",
            "code": "8310-5",
            "display": "Body temperature"
        },
        {
            "system": "http://snomed.info/sct",
            "code": "56342008",
            "display": "Temperature taking"
        }
    ],
    "text": "Body temperature"
};

@registerResource('code', '258710007')
export class Temperature extends Observation {
    constructor(tempC: number, date: Date) {
        let quantity: Quantity = {
            _quantity: {
                value: tempC,
                unit: 'degrees C',
                system: 'http://snomed.info/sct',
                code: '258710007'
            }
        };
        super(date, tempCode, VitalSigns, quantity);
    }
}
;
