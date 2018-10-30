import { Resource } from './resource';
import { QuestionnaireResponseValue, QuestionnaireResponseStatus } from '../basicTypes';
export interface BaseItem {
    linkId: number | string;
    definition?: string;
    text: string;
}
export interface Survey extends BaseItem {
    item: Item[];
}
export interface Item extends BaseItem {
    answer: QuestionnaireResponseValue[];
}
export declare class QuestionnaireResponse extends Resource {
    constructor(authored: any, status: QuestionnaireResponseStatus);
    addSurvey(s: Survey): void;
    addItemToSurvey(item: Item, surveyTitle: string): void;
}
