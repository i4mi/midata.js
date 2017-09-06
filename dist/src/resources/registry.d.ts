export declare type mappingType = 'code' | 'resourceType';
export declare function registerResource(type: mappingType, key: string): (cls: any) => void;
/**
 * Create a resource with the type of the constructor
 * function `cls`.
 */
export declare function fromFhir(fhirObject: any): any;
