"use strict";
var Resource = (function () {
    function Resource(resourceType) {
        this._fhir = {};
        this._fhir.resourceType = resourceType;
    }
    Resource.prototype.addProperty = function (property, value) {
        this._fhir[property] = value;
    };
    Resource.prototype.removeProperty = function (key) {
        delete this._fhir[key];
    };
    Resource.prototype.toJson = function () {
        return this._fhir;
    };
    Object.defineProperty(Resource.prototype, "id", {
        get: function () {
            return this._fhir.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "resourceType", {
        get: function () {
            return this._fhir.resourceType;
        },
        enumerable: true,
        configurable: true
    });
    return Resource;
}());
exports.Resource = Resource;
;
