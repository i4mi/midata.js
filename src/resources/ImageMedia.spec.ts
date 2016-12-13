import { ImageMedia } from './ImageMedia';
import { Midata } from '@midata/Midata';


describe('ImageMedia', () => {

    var midata, login;
    var imgData = data();

    function tryCreateWithExtension(ext) {
        let res = new ImageMedia('smiley.' + ext, data);
        return login.then(() => { return midata.save(res); });
    }

    beforeEach(() => {
        midata = new Midata(
            'https://test.midata.coop:9000',
            'testapp',
            'mysecret'
        );
        login = midata.login('testuser2@testuser.com', 'Testuser123');
    });

    it('should be createable for a gif suffix', (done) => {
        tryCreateWithExtension('gif').then(() => {
            done();
        });
    });

    it('should be createable for a png suffix', (done) => {
        tryCreateWithExtension('png').then(() => {
            done();
        });
    });

    it('should fail for a JPEG suffix', () => {
        expect(() => {
            tryCreateWithExtension('JPEG')
        }).toThrowError(/jpeg/);
    });

});


function data() {
    return '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';
}
