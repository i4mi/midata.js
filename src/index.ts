export { Midata } from './Midata';
export * from './resources';
import * as resources from './resources';
export { resources };


import { Midata } from './Midata';
import { BodyWeight } from './resources';
import { Hemoglobin } from './resources';

let w = <any> window;

let md = new Midata(
    'https://test.midata.coop:9000',
    'testapp',
    'mysecret'
);

w.md = md;

md.login('testuser2@testuser.com', 'Testuser123')
.then(() => {
    // let bw = new BodyWeight(72, new Date());
    let res = new Hemoglobin(72, new Date());
    return md.save(res);
})
.then((obj: any) => {
    console.log('done');
    console.log(obj);
});


