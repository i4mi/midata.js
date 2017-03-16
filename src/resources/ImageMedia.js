"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Media_1 = require('./Media');
var supportedImageTypes = ['png', 'gif', 'jpg'];
var ImageMedia = (function (_super) {
    __extends(ImageMedia, _super);
    function ImageMedia(filename, data) {
        var type;
        var matches = filename.match(/\.(\w+)$/);
        if (matches !== null) {
            type = matches[1].toLowerCase();
            if (supportedImageTypes.indexOf(type) === -1) {
                throw new Error("Unsupported type: " + type);
            }
        }
        else {
            throw new Error('The filename requires a file extension!');
        }
        _super.call(this, filename, 'photo', "image/" + type, data);
    }
    return ImageMedia;
}(Media_1.Media));
exports.ImageMedia = ImageMedia;
;
//# sourceMappingURL=ImageMedia.js.map