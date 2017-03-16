"use strict";
var registry = {};
function registerResource(code) {
    return function (cls) {
        registry[code] = cls;
        w.cls = cls;
    };
}
exports.registerResource = registerResource;
;
/**
 * Create a resource with the type of the constructor
 * function `cls`.
 */
function fromFhir(fhirObject) {
    var tryToMap = fhirObject.code !== undefined
        && fhirObject.code.coding !== undefined
        && fhirObject.code.coding.length == 1
        && fhirObject.code.coding[0].code !== undefined;
    var mappingExists = false;
    if (tryToMap) {
        var coding = fhirObject.code.coding[0].code;
        mappingExists = registry[coding] !== undefined;
    }
    if (mappingExists) {
        var coding = fhirObject.code.coding[0].code;
        var resource = {
            _fhir: fhirObject
        };
        var cls = registry[coding];
        resource.__proto__ = cls.prototype;
        return resource;
    }
    else {
        fhirObject.toJson = function () { return this; };
        return fhirObject;
    }
}
exports.fromFhir = fromFhir;
var w = window;
w.fromFhir = fromFhir;
//# sourceMappingURL=registry.js.map