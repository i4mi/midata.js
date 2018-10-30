import { Resource } from './resource';
import { registerResource } from '../registry';
import { QuestionnaireItemType, PublicationStatus } from '../basicTypes';

export interface Question {
    text: string;
    type: QuestionnaireItemType;
}

export interface QuestionGroup {
    title: string;
    text?: string;
    questions: Question[];
}

@registerResource('resourceType', 'Questionnaire')
export class Questionnaire extends Resource {
    constructor(status: PublicationStatus) {
        super('Questionnaire');
        
        this.addProperty('status', status);
    }

    //questionGroup: QuestionGroup[] | QuestionGroup,
}
;
