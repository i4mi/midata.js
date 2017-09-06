export class MidataJSError extends Error {
    constructor(message?: string) {
        super(message || 'Internal MIDATA.js error');
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, MidataJSError.prototype);
    }
};
