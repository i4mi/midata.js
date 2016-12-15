import { Resource } from './Resource';
export declare type QuestionType = 'boolean' | 'decimal' | 'integer' | 'date' | 'dateTime';
export interface Question {
    text: string;
    type: QuestionType;
}
export interface QuestionGroup {
    title: string;
    text?: string;
    questions: Question[];
}
export declare class Questionnaire extends Resource {
    constructor(questionGroup: QuestionGroup[] | QuestionGroup);
}
