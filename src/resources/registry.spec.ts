import { fromFhir } from './registry';
import { BodyWeight } from './BodyWeight';


describe('When mapping FHIR resources', () => {
    it('#fromFhir() should return an instance of a class if the coding is known', () => {
        let res = fromFhir({
            code: {
                coding: [{
                    code: '3141-9'
                }]
            }
        });

        expect(res).toEqual(jasmine.any(BodyWeight));
    });

    it('#fromFhir() should return the same FHIR object if the coding is not known', () => {
        let fhir = {
            code: {
                coding: [{
                    code: 'xxxx'
                }]
            }
        };
        let res = fromFhir(fhir);

        expect(res).not.toEqual(jasmine.any(BodyWeight));
        expect(res).toEqual(fhir);
    });

    it('#fromFhir() should return the same FHIR object if there is no code', () => {
        let fhir = {};
        let res = fromFhir(fhir);
        expect(res).toEqual(fhir);
    });

    it('#fromFhir() should return the same FHIR object if there is no coding', () => {
        let fhir = { code: {} };
        let res = fromFhir(fhir);
        expect(res).toEqual(fhir);
    });

    it('#fromFhir() should return the same FHIR object if there is not exactly one coding', () => {
        let fhir = {
            code: {
                coding: [
                    {}, {}
                ]
            }
        };
        let res = fromFhir(fhir);
        expect(res).toEqual(fhir);

        let fhir = {
            code: {
                coding: []
            }
        };
        let res = fromFhir(fhir);
        expect(res).toEqual(fhir);
    });

});
