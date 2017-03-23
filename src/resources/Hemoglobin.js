"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Laboratory_1 = require('./Laboratory');
var registry_1 = require('./registry');
var Hemoglobin = (function (_super) {
    __extends(Hemoglobin, _super);
    function Hemoglobin(gdl, date) {
        var quanitity = {
            value: gdl,
            unit: 'g/dL'
        };
        _super.call(this, quanitity, date, {
            coding: [{
                    system: 'http://loinc.org',
                    code: '718-7',
                    display: 'Hemoglobin [Mass/volume] in Blood'
                }]
        });
    }
    Hemoglobin = __decorate([
        registry_1.registerResource('718-7')
    ], Hemoglobin);
    return Hemoglobin;
}(Laboratory_1.Laboratory));
exports.Hemoglobin = Hemoglobin;
;
//# sourceMappingURL=Hemoglobin.js.map