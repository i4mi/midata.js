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
var VitalSigns_1 = require('./VitalSigns');
var registry_1 = require('./registry');
var HeartRate = (function (_super) {
    __extends(HeartRate, _super);
    function HeartRate(beatsPerMinute, date) {
        var quanitity = {
            value: beatsPerMinute,
            unit: 'bpm'
        };
        _super.call(this, quanitity, date, {
            coding: [{
                    system: 'http://loinc.org',
                    code: '8867-4',
                    display: 'Heart Rate'
                }]
        });
    }
    HeartRate = __decorate([
        registry_1.registerResource('8867-4')
    ], HeartRate);
    return HeartRate;
}(VitalSigns_1.VitalSigns));
exports.HeartRate = HeartRate;
;
//# sourceMappingURL=HeartRate.js.map