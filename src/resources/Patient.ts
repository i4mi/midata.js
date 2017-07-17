import {Resource} from './Resource';
import {registerResource} from './registry';


export type gender = 'male' |
        'female' |
        'other' |
        'unknown';

@registerResource("resourceType", "Patient")
export class Patient extends Resource {
    constructor(address : fhir.Address,
                birthdate: string,
                gender: gender,
                identifier: fhir.Identifier,
                name: fhir.HumanName,
                telecom: fhir.ContactPoint){
        super("Patient");
        this.addProperty('address', address);
        this.addProperty('birthdate', birthdate);
        this.addProperty('gender', gender);
        this.addProperty('identifier', identifier);
        this.addProperty('name', name);
        this.addProperty('telecom', telecom);
    }
}