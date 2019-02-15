## Interacting with midata

As you let your user login to midata, you want to lookup for some resources and/or want to save, update resources. This guide shows you, how you can implement a simple generic search and save/update functions.

The midata platform currently implements a limited version of the FHIR API and supports SMART on FHIR authentication.

For resource or api documentation, you can consult the following two links:
* [FHIR RESTful API (hl7)](https://www.hl7.org/fhir/http.html)
* [FHIR Resources (hl7)](https://www.hl7.org/fhir/resourcelist.html)

The midata.js library now provides functions, to simplify the process of querying midata api requests.

## Search

First of all, we want to look at a simple search request.

**STEP 1:** Create a function inside the MidataService class, created in the last two chapters.

```typescript
import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    /*
    * The search function you create must have at least one, at max two arguments.
    * The first argument is the resource type. You need to know, 
    * which kind of resources you want to search for.
    * The second argument are additional search parameters, as documented on the hl7 fhir documentation.
    * Please note, that each and every resource has their own search params.
    * 
    * @param resourceType: for example 'Observation'
    * @param parameters: for example '{ status: 'preliminary' }' 
    */
    search(resourceType: string, parameters?: any): Promise<Resource[]> {

    }

    ...
}

```

**STEP 2:** Now we have to call the library function and return the promise as defined by the function above.

```typescript
import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    /*
    * The search function you create must have at least one, at max two arguments.
    * The first argument is the resource type. You need to know, 
    * which kind of resources you want to search for.
    * The second argument are additional search parameters, as documented on the hl7 fhir documentation.
    * Please note, that each and every resource has their own search params.
    * 
    * @param resourceType: for example 'Observation'
    * @param parameters: for example '{ status: 'preliminary' }' 
    */
    search(resourceType: string, parameters?: any): Promise<Resource[]> {
        
        // We simply have to pass the parameters to the search function of the midata library
        // In addition, we can just return this function for the promise, so that at this point
        // no additional promise handling is needed
        return this._midata.search(resourceType, parameters);
    }

    ...
}

```

Now you have to handle the response of the search request on the site, which executes the function. 

**STEP 3:** Process the response

In the class (page) where the search gets called, you have to handle the search request as promise.

```typescript
import { Page } from 'ionic/ionic';
import { MidataService } from './service';

@Component({
    selector: 'page-target',
    templateUrl: 'target.html'
})
export class TargetPage {
    
    constructor(private midataService: MidataService,
                ...) {
    }
    
    /*
    * This function executes the search request and handles the response.
    * You will receive either a fulfilled or rejected promise.
    * If the promise is fulfilled the 'then' part gets executed. In the response will be an array
    * of all the received resources, which match the given search request.
    * If the promise is rejected the 'catch' part gets executed.
    */
    executeSearch() {
        this.midataService.search('Observation')
            .then((response) => {
                // we can now access all received resources through accessing the response array
                // here comes the magic code, that processes the resource as you want
                ...

                // example: we just step through all resources and log them out
                for (let resource of response) {
                    console.log("The search request returns following resource", resource);
                }
            }).catch((error) => {
                console.error("Error in search request:", error);
            });
    }

    ...
}

```

## Save

If you don't want to just display some data and also save new resources, follow the next few steps.

**STEP 1:** Implement save function in service

```typescript
import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    /*
    * This function executes the save of the midata library and handles the response.
    *
    * @param resource: The resource you want to save on midata as Resource type
    */
    save(resource: Resource): Promise<any> {
        
    }

    ...
}

```

**STEP 2:** Call the save function of the library

```typescript
import { Midata } from 'midata';

@Injectable()
export class MidataService {

    ...

    /*
    * This function executes the save of the midata library and handles the response.
    *
    * @param resource: The resource you want to save on midata as Resource type
    */
    save(resource: Resource): Promise<any> {
        // this example just returns the function call,
        // so that the target class (page) can handle the promises
        return this._midata.save(resource);
    }

    ...
}

```

_IMPORTANT:_ The type resource is defined in the midata library. You have to check the wiki for the implemented resource or category types. If you want to just save any JSON (has a high error susceptibility) you can define the type of the `resource: Resource` as `resource: Resource | any`.

**STEP 3:** Create the needed resource an call the save function in your target class (page)

_NOTE:_ This example shows the creation of a simple Observation resource. 

```typescript
import { Page } from 'ionic/ionic';
import { MidataService } from './service';

// We have to import the Observation resource and the pre-defined types you use
// from the midata library.
import { Observation, 
         OBSERVATIONSTATUS, 
         CAT_SURVEY,
         COD_BLOODPRESSURE } from "../../../node_modules/Midata";


@Component({
    selector: 'page-target',
    templateUrl: 'target.html'
})
export class TargetPage {
    
    constructor(private midataService: MidataService,
                ...) {
    }
    
    /*
    * This function creates a new resource, executes the save request and handles the response.
    * You will receive either a fulfilled or rejected promise.
    * If the promise is fulfilled the 'then' part gets executed.
    * If the promise is rejected the 'catch' part gets executed.
    */
    executeSave() {
        // The constructor of the observation resource defines following parameters as must-have
        //    --> 1: Creation date as effective time or effective period type (json) -
        //           either: { effectiveDateTime: [TIME AS ISO STRING] }
        //           or:     { effectivePeriod: { start: [DATE TIME], end: [DATE TIME] } }
        //    --> 2: Observation status as observation status type (string) - 
        //           please check which status are allowed in your resource (hl7 fhir documentation)
        //           and then check in the basicTypes.ts file, which are already implemented
        //    --> 3: Category as category object (json) - some default categories are implemented
        //           in the midata library. Look at the categories.ts file for more
        //    --> 4: Code as codeable concept object (json) - please note, that the
        //           code has to be registered on midata!
        let resource = new Observation({ effectiveDateTime: new Date().toISOString() },
                                       OBSERVATIONSTATUS.preliminary,
                                       CAT_SURVEY,
                                       COD_BLOODPRESSURE)
        

        this.midataService.save(resource)
            .then((response) => {
                // we can now access the midata response
                ...

            }).catch((error) => {
                console.error("Error in save request:", error);
            });
    }

    ...
}

```

_NOTE:_ The method above is used, when you define resources with not already implemented categories. If you implement a resource with a given category, you just need to implement the following few lines.

```typescript

...
    
    /*
    * This function creates a new heart rate resource, executes the save request and handles the response.
    * You will receive either a fulfilled or rejected promise.
    * If the promise is fulfilled the 'then' part gets executed.
    * If the promise is rejected the 'catch' part gets executed.
    */
    executeSave() {
        
        let heartRate = new HeartRate('60', new Date().toISOString());

        this.midataService.save(resource)
            .then((response) => {
                // we can now access the midata response
                ...

            }).catch((error) => {
                console.error("Error in save request:", error);
            });
    }

    ...


```

_IMPORTANT:_ If you want to create your own resources, check the custom resource guide.

## Update

The update of a resource isn't that complicated. First of all, you need to search for the resource to manipulate. Then manipulate it and save it again. But attention: read this guide carefully, so you don't miss anything.

I will demonstrate the update resource with the example of the handedness. Because only one handedness resource per user should exists.

**STEP 1:** Search for the resource to manipulate

```typescript
import { Page } from 'ionic/ionic';
import { MidataService } from './service';

// We have to import the Handedness category type.
import { Handedness } from "../../../node_modules/Midata";

@Component({
    selector: 'page-target',
    templateUrl: 'target.html'
})
export class TargetPage {
    
    handedness: Handedness

    constructor(private midataService: MidataService,
                ...) {
    }
    
    ...    
  
    getHandedness() {
        // Search the resource. we want the handedness of the logged in patient
        // so we define the params patient and the code of the handedness resource (57427004)
        this.midataService.search('Observation', { patient: this._midataService.getUser().id, code: '57427004'})
            .then((response) => {
                // now we have the response array. 
                // because there should be only one resource of this type,
                // we can directly access it with the index 0
                let h = response[0];

                // now we have to cast the resource in the correct type,
                // so that we can access the functions
                this.handedness = <Handedness>h;

                // if there are multiple resources, you can just step through them
                // and select the one meeting your condition
                ...
            });
        ...
    }

    ...
}

```

**STEP 2:** Manipulate like you want

```typescript
import { Page } from 'ionic/ionic';
import { MidataService } from './service';

// Now we have to import the pre-defined handedness codings.
import { Handedness, 
         COD_LEFTHANDED, 
         COD_RIGHTHANDED, 
         COD_AMBIDEXTROUS } from "../../../node_modules/Midata";

@Component({
    selector: 'page-target',
    templateUrl: 'target.html'
})
export class TargetPage {
    
    handedness: Handedness

    constructor(private midataService: MidataService,
                ...) {
    }
    
    ...

    getHandedness() {
        ...    
    }

    manipulateHandedness() {
        // first, I want to check the current handedness
        // We can check that through the code system
        let currHand = this.handedness.getProperty('valueCodeableConcept').coding[0].code;

        // now manipulate something
        // in this example, i set the handedness to ambidextrous if left or right handed.
        if (currHand === COD_LEFTHANDED.coding[0].code ||
            currHand === COD_RIGHTHANDED.coding[0].code) {
            
            // we can access this function only, because there is one set in the library
            // if no function is provided, you can directly manipulate the object
            this.handedness.changeHandedness(COD_AMBIDEXTROUS.coding[0].code)
        }

        // you can naturally do more stuff
        ...
    }

    ...
}

```

**STEP 3:** Save the manipulated resource

```typescript
import { Page } from 'ionic/ionic';
import { MidataService } from './service';

// Now we have to import the pre-defined handedness codings.
import { Handedness, 
         COD_LEFTHANDED, 
         COD_RIGHTHANDED, 
         COD_AMBIDEXTROUS } from "../../../node_modules/Midata";

@Component({
    selector: 'page-target',
    templateUrl: 'target.html'
})
export class TargetPage {
    
    handedness: Handedness

    constructor(private midataService: MidataService,
                ...) {
    }
    
    ...

    getHandedness() {
        ...    
    }

    manipulateHandedness() {
        ...
    }

    saveHandedness() {
        //just call the save with the resource
        this.midataService.save(this.handedness).then((res) => {
            console.log(res);
        });
    }

    ...
}

```

_NOTE:_ Now why do we just have to call the save function and no update function? When we receive a resource with the search request, there is an id given in the metadata. If we freshly create one, there is no id set. The midata library checks on the save request, if there is an id set in the resource. If no, create new one, if yes, update existing one.
This is also the reason why we have to manipulate the original resource and can't just create a new one with manipulated contend.

***

[<img align="left" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108325.svg">](https://github.com/i4mi/midata.js/wiki/2.-Authorization-(IONIC-2-&-3))

[<img align="right" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108324.svg">](https://github.com/i4mi/midata.js/wiki/4.-Create-custom-resources-(IONIC-2-&-3))