/// <reference types="fhir" />
import { Resource } from './Resource';
export declare type gender = 'male' | 'female' | 'other' | 'unknown';
export declare class Patient extends Resource {
    constructor(address: fhir.Address, birthdate: string, gender: gender, identifier: fhir.Identifier, name: fhir.HumanName, telecom: fhir.ContactPoint);
}
