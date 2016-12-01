import { Midata } from './Midata';
import { BodyWeight } from './resources';


let midata = new Midata('https://test.midata.coop:9000', 'testapp', 'mysecret');

let resource = new BodyWeight(72, new Date());

midata.login('testuser@testuser.com', 'Testuser123')
.then(() => {
    midata.save(resource).then((resp: any) => {
        console.log(resp);
    });
});
