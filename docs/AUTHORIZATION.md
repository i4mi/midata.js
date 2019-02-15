## Authentication on midata
Before you can implement the authentication you need the following two preconditions:
* App registered on the midata instance (given with MIDATA_URL)
* User Account on the midata instance

**STEP 1:** Create the authentication function. In this example the function returns a promise

```typescript

import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    authenticate(): Promise<any> {
        ...
    }

}

```

_NOTE:_ Now, without any content, the function should generate an error (because there should get a promise returned but we don't return anything). We have to implement the logic now.

**STEP 2:** Call the authenticate function with our created instance of the midata library

```typescript

import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    authenticate(): Promise<any> {
        /*
        * This function calls the authenticate method on the midata.js library.
        * The authentication procedure in the library is according the oAuth 2.0 workflow 
        * documented by SMART on FHIR
        */
        return this._midata.authenticate();
    }
}

```

_NOTE:_ Now we are able to log in on midata. But the user and the app will now have no feedback or whatsoever.

**STEP 3:** Handle the authenticate response

The authentication response the client receives from the midata.js library is a json. In this json we have two resources. One is the TokenResponse and the other one is the PatientResource of the logged in user. It also has it's own data type defined by midata.js library.

Add the promise handling like following code shows:

```typescript

import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    authenticate(): Promise<any> {
        /*
        * This function calls the authenticate method on the midata.js library.
        * The authentication procedure in the library is according the oAuth 2.0 workflow 
        * documented by SMART on FHIR
        */
        return this._midata.authenticate()
            .then((response: AuthAndPatResponse) => {
                //get the token
                let tokenResponse = response.authResponse;

                //get the patient resource
                let patientResource = response.patientResource;

                //do your stuff with the token and patient resources
                ...
            }).catch((error) => {
                console.error("Error during authentication:", error);
            });
    }
}

```

_NOTE:_ Now we are able to handle the response. For example you want an auto login function for already logged in users. Therefore, we recommend to save the `tokenResponse` variable into the secure storage. You can find a documentation about how to use the secure storage is used [here](https://ionicframework.com/docs/native/secure-storage/).

***

[<img align="left" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108325.svg">](https://github.com/i4mi/midata.js/wiki/1.-Initialize-(IONIC-2-&-3))

[<img align="right" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108324.svg">](https://github.com/i4mi/midata.js/wiki/3.-Search,-save,-update-(IONIC-2-&-3))