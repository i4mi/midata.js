import { Resource } from './Resource';
import { DateTime } from '.';
export declare type Status = "in-progress" | "completed" | "amended" | "entered-in-error" | "stopped";
export declare type Answer = {
    valueBoolean?: boolean;
} | {
    valueDecimal?: number;
} | {
    valueInteger?: number;
} | {
    valueDate?: Date;
} | {
    valueDateTime?: DateTime;
} | {
    valueTime?: DateTime;
} | {
    valueString?: String;
} | {
    valueUri?: String;
};
export interface BaseItem {
    linkId: number | string;
    definition?: string;
    text: string;
}
export interface Survey extends BaseItem {
    item: Item[];
}
export interface Item extends BaseItem {
    answer: Answer[];
}
export declare class QuestionnaireResponse extends Resource {
    constructor(authored: any, status: Status);
    addSurvey(s: Survey): void;
    addItemToSurvey(item: Item, surveyTitle: string): void;
}
