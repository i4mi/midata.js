"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource_1 = require('./Resource');
/**
 * Measurements and simple assertions made about a patient, device or other
 * subject.
 *
 * https://www.hl7.org/fhir/observation.html
 */
var Observation = (function (_super) {
    __extends(Observation, _super);
    function Observation(quantity, date, code, category) {
        _super.call(this, 'Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());
        this.addProperty('valueQuantity', quantity);
        this.addProperty('category', category);
    }
    return Observation;
}(Resource_1.Resource));
exports.Observation = Observation;
;
var MultiObservation = (function (_super) {
    __extends(MultiObservation, _super);
    function MultiObservation(date, code, category) {
        _super.call(this, 'Observation');
        this.addProperty('status', 'final');
        this.addProperty('code', code);
        this.addProperty('effectiveDateTime', date.toISOString());
        this.addProperty('component', []);
        this.addProperty('category', category);
    }
    MultiObservation.prototype.addComponent = function (component) {
        this._fhir.component.push(component);
    };
    return MultiObservation;
}(Resource_1.Resource));
exports.MultiObservation = MultiObservation;
;
//# sourceMappingURL=Observation.js.map