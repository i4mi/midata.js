import { Resource } from './resource';
import { registerResource } from '../registry';
import { AdministrativeGender } from '../basicTypes';

//https://github.com/angular/angular/issues/17800

@registerResource("resourceType", "Patient")
export class Patient extends Resource {
    constructor(address : fhir.Address,
                birthdate: string,
                gender: AdministrativeGender,
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