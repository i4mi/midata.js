import { Resource } from './resource';
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
export declare class Questionnaire extends Resource {
    constructor(status: PublicationStatus);
}
