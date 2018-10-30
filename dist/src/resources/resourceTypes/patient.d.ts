/// <reference types="fhir" />
import { Resource } from './resource';
import { AdministrativeGender } from '../basicTypes';
export declare class Patient extends Resource {
    constructor(address: fhir.Address, birthdate: string, gender: AdministrativeGender, identifier: fhir.Identifier, name: fhir.HumanName, telecom: fhir.ContactPoint);
}
