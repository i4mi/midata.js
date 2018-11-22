import { Resource } from './resource';
import { DigitalMediaType } from '../basicTypes';
export declare type Base64Str = string;
export declare class Media extends Resource {
    constructor(filename: string, mediaType: DigitalMediaType, mimetype: string, data: Base64Str);
}
