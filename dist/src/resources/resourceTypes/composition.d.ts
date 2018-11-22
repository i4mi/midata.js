/// <reference types="fhir" />
import { Resource } from './resource';
import { CompositionStatus, CompositionSection } from '../basicTypes';
export declare class Composition extends Resource {
    /**
     *
     * @param status the state as CompositionStatus
     * @param type the type of the composition as CodableConcept
     * @param author the creator of the composition as Reference
     */
    constructor(status: CompositionStatus, type: fhir.CodeableConcept, author: fhir.Reference);
    addSection(entry: CompositionSection): Promise<string>;
    getSections(): CompositionSection[];
    getSectionsWithText(sectionText: string): CompositionSection[];
    getSectionsWithEntryReference(sectionReference: fhir.Reference): CompositionSection[];
    getSectionsWithSection(): CompositionSection[];
}
