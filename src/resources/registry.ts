const registry: any = {};

export function registerResource(code: string) {
    return (cls: any) => {
        registry[code] = cls;
        w.cls = cls;
    };
};

/**
 * Create a resource with the type of the constructor
 * function `cls`.
 */
export function fromFhir(fhirObject: any) {
    let resource: any = {
        _fhir: fhirObject
    };
    let coding = fhirObject.code.coding[0].code;
    let cls = registry[coding];
    resource.__proto__ = cls.prototype
    return resource;
}

let w = <any>window;
w.fromFhir = fromFhir;
