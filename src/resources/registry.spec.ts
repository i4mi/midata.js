import { fromFhir } from './registry';
import { BodyWeight } from './BodyWeight';


describe('registry', () => {
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

    it('#fromFhir() should return the same FHIR ofject if the coding is not known', () => {
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
});
