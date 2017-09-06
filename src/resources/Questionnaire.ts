import {Resource} from './Resource';
import {registerResource} from './registry';

export type QuestionType =
    'boolean' |
    'decimal' |
    'integer' |
    'date' |
    'dateTime';

export interface Question {
    text: string;
    type: QuestionType;
}

export interface QuestionGroup {
    title: string;
    text?: string;
    questions: Question[];
}

@registerResource('resourceType', 'Questionnaire')
export class Questionnaire extends Resource {
    constructor(questionGroup: QuestionGroup[] | QuestionGroup) {
        super('Questionnaire');

        // Other possible values: draft / retired
        this.addProperty('status', 'published');
    }
}
;
