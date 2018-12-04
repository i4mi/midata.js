import { registerResource } from '../registry';
import { Resource } from './resource';
import { CompositionStatus, CompositionSection, NarrativeStatus } from '../basicTypes';

@registerResource('resourceType', 'Composition')
export class Composition extends Resource {

    /**
     * 
     * @param status the state as CompositionStatus
     * @param type the type of the composition as CodableConcept
     * @param author the creator of the composition as Reference
     */
    constructor(status: CompositionStatus,
                type: fhir.CodeableConcept,
                author: fhir.Reference) {
        super('Composition');

        super.addProperty('status', status);
        super.addProperty('type', type);
        super.addProperty('author', [author]);
        super.addProperty('date', new Date().toISOString());

        //prepare section property
        super.addProperty('section', []);
    }

    addSection(entry: CompositionSection): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this._fhir.section.push(entry);

                resolve('added section');
            } catch(error) {
                reject(error.message);
            }
        });
    }

    getSections(): CompositionSection[] {
        return super.getProperty("section");
    }

    getSectionsWithText(sectionStatusCode: NarrativeStatus): CompositionSection[] {
        let sections = super.getProperty("section")
                       .filter((section: CompositionSection) => 
                                section.text.status === sectionStatusCode);

        return sections;
    }

    getSectionsWithEntryReference(sectionReference: fhir.Reference): CompositionSection[] {
        let sections = super.getProperty("section")
                       .filter((section: CompositionSection) => {
                        for(let entryReference of section.entry) {
                            entryReference.reference === sectionReference   
                        } 
                       });
        
        return sections;
    }

    getSectionsWithSection(): CompositionSection[] {
        let sections = super.getProperty("section")
                       .filter((section: CompositionSection) =>
                                typeof section.section !== 'undefined');
        
        return sections;
    }

}