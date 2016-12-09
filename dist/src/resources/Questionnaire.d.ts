import { Resource } from './Resource';
export declare type QuestionType = 'boolean' | 'decimal' | 'integer' | 'date' | 'dateTime';
export interface Question {
    text: string;
    type: QuestionType;
}
export interface QuestionGroup {
    title: string;
    text?: string;
    question: Question[];
}
export declare class Questionnaire extends Resource {
    constructor(questionGroups: QuestionGroup[]);
}
