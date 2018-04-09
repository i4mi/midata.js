import {Resource} from './Resource';
import {registerResource} from './registry';
import { DateTime } from '.';

export type Status = "in-progress" | 
                     "completed" | 
                     "amended" | 
                     "entered-in-error" | 
                     "stopped"

export type Answer = {
    valueBoolean?: boolean;
    // "valueAttachment" : { Attachment },
    // "valueCoding" : { Coding },
    // "valueQuantity" : { Quantity },
    // "valueReference" : { Reference(Any) },
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
}

export interface BaseItem {
    linkId: number | string;
    definition?: string; //urn:uuid:53fefa32-fcbb-4ff8-8a92-55ee120877b7
    text: string;
}

export interface Survey extends BaseItem {
    item: Item[];
}

export interface Item extends BaseItem {
    answer: Answer[];
}


@registerResource('resourceType', 'QuestionnaireResponse')
export class QuestionnaireResponse extends Resource{
    constructor(authored: any, 
                status: Status) {
                    
        super('QuestionnaireResponse');

        this.addProperty('status', status);
        this.addProperty('authored', authored);
    }
    
    addSurvey(s: Survey) {
        if (this._fhir['item'] == null) {
            this.addProperty('item', []);
        }

        this._fhir.item.push(s);
        console.log(this._fhir);
    }

    addItemToSurvey(item: Item, surveyTitle: string) {
        if (this._fhir['item'] == null) {
            throw new Error("Error, no survey defined");
        }
        
        var success = false;

        for (let surv of this._fhir.item) {
            if (surv.text == surveyTitle) {
                success = true;
                surv.item.push(item);
            }
        }

        if (!success) {
            throw new Error("1 Error, no survey with name -- " + surveyTitle + " -- found");
        }
    }
};