import { Media, Base64Str } from './Media';


const supportedImageTypes = ['png', 'gif', 'jpg'];

export type ImageType =
    'png' |
    'jpg' |
    'gif' ;

export class ImageMedia extends Media {
    constructor(filename: string, data: Base64Str) {
        let type: string;

        let matches = filename.match(/\.(\w+)$/);

        if (matches !== null) {
            type = matches[1].toLowerCase();
            if (supportedImageTypes.indexOf(type) === -1) {
                throw new Error(`Unsupported type: ${type}`);
            }
        } else {
            throw new Error('The filename requires a file extension!');
        }

        super(filename, 'photo', `image/${type}`, data);
    }
};
