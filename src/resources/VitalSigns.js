"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var categories_1 = require('./categories');
var Observation_1 = require('./Observation');
var VitalSigns = (function (_super) {
    __extends(VitalSigns, _super);
    function VitalSigns(quantity, date, code) {
        _super.call(this, quantity, date, code, categories_1.VitalSigns);
    }
    return VitalSigns;
}(Observation_1.Observation));
exports.VitalSigns = VitalSigns;
;
