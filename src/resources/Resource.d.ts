export declare class Resource {
    protected _fhir: any;
    constructor(resourceType: string);
    addProperty(property: string, value: any): void;
    removeProperty(key: string): void;
    toJson(): any;
    readonly id: string;
    readonly resourceType: string;
}
