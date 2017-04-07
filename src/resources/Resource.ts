export class Resource {

    protected _fhir: any = {};

    constructor(resourceType: string) {
        this._fhir.resourceType = resourceType;
    }

    addProperty(property: string, value: any) {
        this._fhir[property] = value;
    }

    removeProperty(key: string) {
        delete this._fhir[key];
    }

    toJson() {
        return this._fhir;
    }

    get id(): string {
        return this._fhir.id;
    }

    relativeID(idParam: string){

        this._fhir.id = idParam;

    }

    get resourceType(): string {
        return this._fhir.resourceType;
    }


    get reference(): string {
        return `${this._fhir.resourceType}/${this._fhir.id}`
    }

};
