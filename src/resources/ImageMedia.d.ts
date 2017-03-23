import { Media, Base64Str } from './Media';
export declare type ImageType = 'png' | 'jpg' | 'gif';
export declare class ImageMedia extends Media {
    constructor(filename: string, data: Base64Str);
}
