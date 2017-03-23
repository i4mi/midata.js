"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource_1 = require('./Resource');
var Media = (function (_super) {
    __extends(Media, _super);
    function Media(filename, mediaType, mimetype, data) {
        _super.call(this, 'Media');
        this.addProperty('type', mediaType);
        this.addProperty('content', {
            contentType: mimetype,
            data: data,
            title: filename
        });
    }
    return Media;
}(Resource_1.Resource));
exports.Media = Media;
;
//# sourceMappingURL=Media.js.map