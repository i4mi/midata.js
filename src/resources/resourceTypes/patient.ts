import { Resource } from './resource';
import { registerResource } from '../registry';
import { AdministrativeGender } from '../basicTypes';

//https://github.com/angular/angular/issues/17800

@registerResource("resourceType", "Patient")
export class Patient extends Resource {
    constructor(gender: AdministrativeGender){
        super("Patient");
        this.addProperty('gender', gender);
    }

    set address(address: fhir.Address) {
        this.addProperty('address', address);
    }

    set birthdate(birthdate: string) {
        this.addProperty('birthdate', birthdate);
    }

    set identifier(identifier: fhir.Identifier) {
        this.addProperty('identifier', identifier);
    }

    set name(name: fhir.HumanName) {
        this.addProperty('name', name);
    }

    set telecom(telecom: fhir.ContactPoint) {
        this.addProperty('telecom', telecom);
    }
}