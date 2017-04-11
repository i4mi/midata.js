import {Resource} from './Resource';
import stringMatching = jasmine.stringMatching;
import {Promise} from "es6-promise";
import BundleEntry = fhir.BundleEntry;

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

// http://hl7.org/fhir/http-verb
export type httpVerb =

    'GET' |
        'POST' |
        'PUT' |
        'DELETE';

export class Bundle extends Resource {

    constructor(type: BundleType) {

        super('Bundle');

        super.setRelativeId("bundle-transaction");

        this.addProperty('type', type);
        this.addProperty('entry', []);
    }


    // add resource of type fhir.BundleEntry to this bundle
    // An entry in a bundle resource - will either contain a resource,
    // or information about a resource (transactions and history only).

    addEntry(method: httpVerb, url: fhir.uri, entry: Resource) {

        return new Promise<string>((resolve, reject) => {

            try {

                var length: number = Number(this._fhir.entry.length) || 0;

                // set the relative id
                entry.setRelativeId(String(length += 1));

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

    // TODO: comment

    getObservationEntries(withCode?: fhir.code) {

        let observationEntries = super.getProperty("entry").filter((entry: fhir.BundleEntry) =>
        entry.resource.resourceType === "Observation");
        if (withCode) {
            let filtered: fhir.BundleEntry[] = [];
            for (let entry of observationEntries) {
                for (let codeValue of entry.resource.code.coding) {
                    if (codeValue.code === withCode) {
                        filtered.push(entry);
                    }
                }
            }
            return filtered;
        } else {
            return observationEntries;
        }

    }

    // TODO: comment

    getEntry(withId: string) {
        for (let entry of super.getProperty("entry")) {
            if (`${entry.resource.resourceType}/${entry.resource.id}` === withId) {
                return entry as fhir.BundleEntry;
            }
        }
    }
}
;