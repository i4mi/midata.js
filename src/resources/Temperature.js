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
var tempCode = {
    "coding": [
        {
            "system": "http://acme.lab",
            "code": "BT",
            "display": "Body temperature"
        },
        // LOINC and SNOMED CT translations here - Note in the US the primary code
        // will be LOINC per meaningful use.  Further SNOMED CT  has acceeded
        // to LOINC being the primary coding system for vitals and
        // anthropromorphic measures.  SNOMED CT is required in some
        // countries such as the UK.
        {
            "system": "http://loinc.org",
            "code": "8310-5",
            "display": "Body temperature"
        },
        {
            "system": "http://snomed.info/sct",
            "code": "56342008",
            "display": "Temperature taking"
        }
    ],
    "text": "Body temperature"
};
var Temperature = (function (_super) {
    __extends(Temperature, _super);
    function Temperature(tempC, date) {
        var quanitity = {
            value: tempC,
            unit: 'degrees C',
            code: '258710007',
            system: 'http://snomed.info/sct'
        };
        _super.call(this, quanitity, date, tempCode);
    }
    Temperature = __decorate([
        registry_1.registerResource('258710007')
    ], Temperature);
    return Temperature;
}(VitalSigns_1.VitalSigns));
exports.Temperature = Temperature;
;
//# sourceMappingURL=Temperature.js.map