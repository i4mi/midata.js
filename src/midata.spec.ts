// import { Midata } from './index';
// import { Promise } from 'es6-promise';
// import { post } from './util';


// describe('Midata', () => {

//     var midata;

//     beforeEach(() => {
//         midata = new Midata(
//             'https://test.midata.coop:9000',
//             'app',
//             'seceretxyz'
//         );
//     });

//     describe('with valid credentials', () => {

//         beforeEach(() => {
//             post = jasmine.createSpy().and.callFake(() => {
//                 return Promise.resolve({
//                     authToken: '1234',
//                     refreshToken: 'asdf'
//                 });
//             });
//         });

//         it('#login() should return the auth and refresh token', (done) => {
//             midata.login('testuser', '123')
//             .then((response) => {
//                 expect(response.authToken).toBe('1234');
//                 expect(response.refreshToken).toBe('asdf');
//                 done();
//             });
//         });

//         it('#login() should set the auth and refresh token', (done) => {
//             expect(midata.authToken).toBeUndefined();
//             expect(midata.refreshToken).toBeUndefined();

//             midata.login('testuser', '123')
//             .then((response) => {
//                 expect(midata.authToken).toBe('1234');
//                 expect(midata.refreshToken).toBe('asdf');
//                 done();
//             });
//         });

//         it('#login() should set user property', (done) => {
//             expect(midata.user).toBeUndefined();

//             midata.login('testuser', '123')
//             .then((response) => {
//                 expect(midata.user).toEqual({name: 'testuser'});
//                 done();
//             });
//         });

//         it('#loggedIn should be true when the user is logged in', (done) => {
//             expect(midata.loggedIn).toBe(false);

//             midata.login('testuser', '123')
//             .then((response) => {
//                 expect(midata.loggedIn).toBe(true);
//                 done();
//             });
//         });

//         it('#create() should throw an error when the resource already has an id', () => {
//             expect(() => {
//                 midata.create({
//                     id: 'something'
//                 });
//             }).toThrowError(/id/);
//         });

//         it('#create() should create a resource', (done) => {
//             let resource = {
//                 status: 'final',
//                 code: {
//                     'text': 'Body Weight'
//                 },
//                 value: {
//                     valueQuantity: {
//                         value: 75,
//                         unit: 'kg'
//                     }
//                 }
//             };

//             midata.login('testuser', '123')
//             .then(() => {
//                 return midata.create(resource);
//             })
//             .then((res) => {
//                 expect(res.id) == 1;
//                 done();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 done();
//             });
//         });


//     });


//     describe('with invalid credentials', () => {

//         beforeEach(() => {
//             post = jasmine.createSpy().and.callFake(() => {
//                 return Promise.reject('Wrong username or password');
//             });
//         });

//         it('#login() should return a rejected promise containing the error message', (done) => {
//             midata.login('testuser', '123')
//             .catch((error) => {
//                 expect(error).toMatch(/Wrong/);
//                 done();
//             });
//         });

//         it('#createRecord() should throw an error when the user is not logged in', () => {
//             expect(() => {
//                 midata.create({});
//             }).toThrowError(/logged in/);
//         });

//     });



//     it('#logout() should reset the state', () => {
//         midata.login('testuser', '123')
//         .then(() => {
//             midata.logout();
//             expect(midata.user).toBeUndefined();
//             expect(midata.refreshToken).toBeUndefined();
//             expect(midata.authToken).toBeUndefined();
//             done();
//         });
//     });

// });
