import { Midata } from '@midata/Midata';
import { BodyWeight } from './BodyWeight';
import { BodyHeight } from './BodyHeight';
import { HeartRate } from './HeartRate';
import { StepsCount } from './StepsCount';
import { BloodPressure } from './BloodPressure';
import { Temperature } from './Temperature';
import { Hemoglobin } from './Hemoglobin';


// describe('Resources', () => {

//     var midata, login;

//     beforeEach(() => {
//         midata = new Midata(
//             'https://test.midata.coop:9000',
//             'testapp',
//             'mysecret'
//         );
//         login = midata.login('testuser2@testuser.com', 'Testuser123');
//     });

//     it('BodyWeight should be createable', (done) => {
//         let bw = new BodyWeight(72, new Date());

//         login.then(() => {
//             return midata.save(bw);
//         })
//         .then(() => {
//             done();
//         })
//         .catch(err => {
//             fail(err);
//         });
//     });

//     it('BodyHeight should be createable', (done) => {
//         let bh = new BodyHeight(180, new Date());
//         login.then(() => {
//             return midata.save(bh);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });

//     it('BloodPressure should be createable', (done) => {
//         let res = new BloodPressure(90, 120, new Date());
//         login.then(() => {
//             return midata.save(res);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });

//     it('HeartRate should be createable', (done) => {
//         let res = new HeartRate(150, new Date());
//         login.then(() => {
//             return midata.save(res);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });

//     it('StepsCount should be createable', (done) => {
//         let res = new StepsCount(10000, new Date());
//         login.then(() => {
//             return midata.save(res);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });


//     it('Temperature should be createable', (done) => {
//         let res = new Temperature(36, new Date());
//         login.then(() => {
//             return midata.save(res);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });

//     it('Hemoglobin should be createable', (done) => {
//         let res = new Hemoglobin(20, new Date());
//         login.then(() => {
//             return midata.save(res);
//         })
//         .then(() => { done(); })
//         .catch(err => {
//             fail(err);
//         });
//     });

// });

