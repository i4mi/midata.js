import {Resource} from './Resource';
import {registerResource} from './registry';

// The Media resource contains photos, videos, and audio recordings.
// It is used with media acquired or used as part of the healthcare
// process.
export type MediaType =
    'photo' |
    'video' |
    'audio' ;

export type Base64Str = string;

@registerResource('resourceType', 'Media')
export class Media extends Resource {
    constructor(filename: string, mediaType: MediaType, mimetype: string, data: Base64Str) {
        super('Media');
        this.addProperty('type', mediaType);
        this.addProperty('content', {
            contentType: mimetype,
            data: data,
            title: filename
        });
    }
}
;
