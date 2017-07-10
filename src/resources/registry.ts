const registry: any = {
    codes: <any>[],
    resourceTypes: <any>[]
};

export type mappingType = 'code' |
    'resourceType';

export function registerResource(type: mappingType, key: string) {
    return (cls: any) => {
        if(type === "code") {
        registry.codes[key] = cls;
        }
        else if(type === "resourceType"){
        registry.resourceTypes[key] = cls;
        }
        w.cls = cls;
    };
};

/**
 * Create a resource with the type of the constructor
 * function `cls`.
 */


// TODO: Registrierungsparameter stimmen nicht -> Check!


export function fromFhir(fhirObject: any) {
    console.log(fhirObject);
    let tryToMap = fhirObject.code !== undefined
                && fhirObject.code.coding !== undefined
                && fhirObject.code.coding.length == 1
                && fhirObject.code.coding[0].code !== undefined;
    var mappingExists = false;
    if (tryToMap) {
        let coding = fhirObject.code.coding[0].code;
        mappingExists = registry.codes[coding] !== undefined;
    }
    if (mappingExists) {
        let coding = fhirObject.code.coding[0].code;
        let resource: any = {
            _fhir: fhirObject
        };
        let cls = registry.codes[coding];
        console.log(cls);
        resource.__proto__ = cls.prototype;
        return resource;
    } else if (fhirObject.resourceType !== undefined) {
        // If no mapping key for type code exists try to map the resource according to it's resourceType
        // NOTE: Each record should have a resourceType at least. If not, throw an exception.
        let tryToMap = fhirObject.resourceType !== undefined;
     var mappingExists = false;
     if (tryToMap) {
         let coding = fhirObject.resourceType;
         mappingExists = registry.resourceTypes[coding] !== undefined;
         console.log("Existiert ein Mapping?");
         console.log(mappingExists);
     }
     if (mappingExists) {
         let coding = fhirObject.resourceType;
         console.log("Das Coding:");
         console.log(coding);
         let resource: any = {
             _fhir: fhirObject
         };
         let cls = registry.resourceTypes[coding];
         console.log(cls);
         resource.__proto__ = cls.prototype;
         return resource;
     } // TODO: Hier muss ein Error kommen, denn wenn die Resource nicht mind. als Resource existiert, dann Error!

    } else {
        console.log("No mapping");
        // No mapping exists, throw an error...
        throw new Error(`Mapping Error!`)
    }
}

let w = <any>window;
w.fromFhir = fromFhir;
