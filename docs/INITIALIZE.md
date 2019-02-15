**NOTE:** The library supports only IONIC 2 & 3 projects. We are currently planing an adaption for multiple frameworks.

## Additional dependencies

The midata library has some default dependencies coming with it. These are the following two ionic plugins.
* [Secure Storage](https://ionicframework.com/docs/native/secure-storage/)
* [In App Browser](https://ionicframework.com/docs/native/in-app-browser/)

## Initialize the library

**STEP 1:** Create your own `MidataService` class in the target project

```typescript
/**
* Create your class and import the midata library, 
* installed with the npm command given in the readme file of this repo.
*/

import { Midata } from 'midata';

@Injectable()
export class MidataService {

    private _midata: Midata;

    ...
}

```

_NOTE:_ For detailed information about IONIC 2 services see [here](https://www.joshmorony.com/an-in-depth-explanation-of-providers-in-ionic-2/ "Providers in IONIC 2")

**STEP 2:** Initialize the midata library as object within the constructor of the service class

```typescript
/**
* The initialization of a midata object requires 
* the link to the corresponding midata server and the app name. 
* The app name is set in the registered (mobile-)app on midata. 
* Therefore, your app has to be registered in your midata developer account. 
*/

import { Midata } from 'midata';

@Injectable()
export class MidataService {

    private _midata: Midata;

    constructor(...) {
        this._midata = new Midata([MIDATA_URL], [APP_NAME]);

        //do more awesome stuff
        ...
    }
}

```

_NOTE:_ As a third party application, the app secret should never get set. For further documentation see [here](http://hl7.org/fhir/smart-app-launch/).\
        While developing, you should always use the test server of midata. You can set the `[MIDATA_URL]` to "https://test.midata.coop"

Now you are ready to use the midata library. But before you can send any requests, you need to be logged in first.

***

[<img align="left" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108325.svg">](https://github.com/i4mi/midata.js/wiki)

[<img align="right" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108324.svg">](https://github.com/i4mi/midata.js/wiki/2.-Authorization-(IONIC-2-&-3))