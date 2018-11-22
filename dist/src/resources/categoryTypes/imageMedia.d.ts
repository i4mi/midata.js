import { Media, Base64Str } from '../resourceTypes/media';
export declare type ImageType = 'png' | 'jpg' | 'gif';
export declare class ImageMedia extends Media {
    constructor(filename: string, data: Base64Str);
}
