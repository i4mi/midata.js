import {Resource} from './Resource';
import stringMatching = jasmine.stringMatching;
import {Promise} from "es6-promise";

// http://www.hl7.org/fhir/bundle-type

export type BundleType =
    'document'       |
        'message'      |
        'transaction'            |
        'transaction-response'   |
        'batch'   |
        'batch-response' |
        'history' |
        'searchset' |
        'collection';

export class Bundle extends Resource {

    constructor(type : BundleType) {

        super('Bundle');

        super.relativeID("bundle-transaction");

        this.addProperty('type', type);
        this.addProperty('entry', []);
    }


    // add resource of type fhir.BundleEntry to this bundle
    // An entry in a bundle resource - will either contain a resource,
    // or information about a resource (transactions and history only).

    addEntry(method: fhir.code, url: fhir.uri, entry: Resource) {

        return new Promise<string>((resolve, reject) => {

            try {

                var length: number = Number(this._fhir.entry.length) || 0;

                // set the relative id
                entry.relativeID(String(length+=1));

                // push entry to array
                this._fhir.entry.push({
                    request: {
                        method: method,
                        url: url
                    },
                    resource: entry.toJson(),
                } as fhir.BundleEntry);

                resolve(`Added id #: ${length}`);
            }
            catch (e) {
                // return error message
                reject(e.message);
            }

        });
    }
};