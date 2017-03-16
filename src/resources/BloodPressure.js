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
var Observation_1 = require('./Observation');
var categories_1 = require('./categories');
var registry_1 = require('./registry');
var BloodPressure = (function (_super) {
    __extends(BloodPressure, _super);
    function BloodPressure(systolic, diastolic, date) {
        var code = {
            coding: [{
                    system: "http://loinc.org",
                    code: '55417-0',
                    display: 'Blood Pressure'
                }]
        };
        _super.call(this, date, code, categories_1.VitalSigns);
        this.addComponent({
            code: {
                coding: [{
                        system: "http://loinc.org",
                        code: "8480-6",
                        display: "Systolic blood pressure"
                    }]
            },
            valueQuantity: {
                value: systolic,
                unit: 'mm[Hg]'
            }
        });
        this.addComponent({
            code: {
                coding: [{
                        system: "http://loinc.org",
                        code: "8462-4",
                        display: "Diastolic blood pressure"
                    }]
            },
            valueQuantity: {
                value: diastolic,
                unit: 'mm[Hg]'
            }
        });
    }
    BloodPressure = __decorate([
        registry_1.registerResource('55417-0')
    ], BloodPressure);
    return BloodPressure;
}(Observation_1.MultiObservation));
exports.BloodPressure = BloodPressure;
;
//# sourceMappingURL=BloodPressure.js.map