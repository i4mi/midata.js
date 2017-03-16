"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var categories_1 = require('./categories');
var Observation_1 = require('./Observation');
var Laboratory = (function (_super) {
    __extends(Laboratory, _super);
    function Laboratory(quantity, date, code) {
        _super.call(this, quantity, date, code, categories_1.Laboratory);
    }
    return Laboratory;
}(Observation_1.Observation));
exports.Laboratory = Laboratory;
;
//# sourceMappingURL=Laboratory.js.map