export function assert(object: any, property: string, cls?: any) {
    let propertyPresent = object.property === undefined;
    let rightClass = cls !== undefined ? object instanceof cls : true;
    return propertyPresent && rightClass;
}
