export declare class Resource {
    protected _fhir: any;
    constructor(resourceType: string);
    getProperty(property: string): any;
    addProperty(property: string, value: any): void;
    removeProperty(key: string): void;
    toJson(): any;
    readonly id: string;
    setRelativeId(idParam: string): void;
    readonly resourceType: string;
    readonly reference: string;
}
