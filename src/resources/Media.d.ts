import { Resource } from './Resource';
export declare type MediaType = 'photo' | 'video' | 'audio';
export declare type Base64Str = string;
export declare class Media extends Resource {
    constructor(filename: string, mediaType: MediaType, mimetype: string, data: Base64Str);
}
