/// <reference types="fhir" />
import { Resource } from './resource';
import { AdministrativeGender } from '../basicTypes';
export declare class Patient extends Resource {
    constructor(gender: AdministrativeGender);
    address: fhir.Address;
    birthdate: string;
    identifier: fhir.Identifier;
    name: fhir.HumanName;
    telecom: fhir.ContactPoint;
}
