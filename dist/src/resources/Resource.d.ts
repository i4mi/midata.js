export declare class Resource {
    protected _fhir: any;
    constructor(resourceType: string);
    addProperty(property: string, value: any): void;
    removeProperty(key: string): void;
    toJson(): any;
    readonly id: string;
    relativeID(idParam: string): void;
    readonly resourceType: string;
    readonly reference: string;
}
