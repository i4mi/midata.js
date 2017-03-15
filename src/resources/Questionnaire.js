"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource_1 = require('./Resource');
var Questionnaire = (function (_super) {
    __extends(Questionnaire, _super);
    function Questionnaire(questionGroup) {
        _super.call(this, 'Questionnaire');
        // Other possible values: draft / retired
        this.addProperty('status', 'published');
    }
    return Questionnaire;
}(Resource_1.Resource));
exports.Questionnaire = Questionnaire;
;
