import { Resource } from './Resource';
import { Observation } from "./Observation";
export declare class MSTests extends Observation {
    constructor(date: Date, comment: string);
    addRelated(resource: Resource): void;
}
