import { Resource } from './Resource';


export type QuestionType = 
    'boolean' |
    'decimal' |
    'integer' |
    'date'    |
    'dateTime';

export interface Question {
    text: string;
    type: QuestionType;
}

export interface QuestionGroup {
    title: string;
    text?: string;
    question: Question[];
}

export class Questionnaire extends Resource {
    constructor(questionGroups: QuestionGroup[]) {
        super('Questionnaire');

        // Other possible values: draft / retired
        this.addProperty('status', 'published');
    }
};
