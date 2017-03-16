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
var StepsCount = (function (_super) {
    __extends(StepsCount, _super);
    function StepsCount(steps, date) {
        var quanitity = {
            value: steps,
            unit: 'steps'
        };
        _super.call(this, quanitity, date, {
            text: 'Steps',
            coding: [{
                    system: 'http://midata.coop',
                    code: 'activities/steps',
                    display: 'Steps'
                }]
        });
    }
    StepsCount = __decorate([
        registry_1.registerResource('activities/steps')
    ], StepsCount);
    return StepsCount;
}(VitalSigns_1.VitalSigns));
exports.StepsCount = StepsCount;
;
//# sourceMappingURL=StepsCount.js.map