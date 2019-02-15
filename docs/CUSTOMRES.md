## Some general informations

Before you can start writing you own resources or categories, you have make sure, that the wanted code (as defined in your concept, if there is one) is registered on midata.

A list of all already registered resources and codings can be found [here](https://test.midata.coop/#/developer/guide)
--> Navigate (on the left side) to the chapter `Format/Content List`

## Create own basic resource

It is possible, that when the library does not provide the needed resource, you can register your own.

**STEP 1:** Create your resource class (example Observation) and import the types (if already existing)

```typescript

import { ObservationEffective, 
         ObservationStatus } from "../../../node_modules/Midata";

export class Observation {

    // Implement a constructor
    // Check the hl7 fhir documentation of the resource
    // to find out the required fields of the resource.
    // It's recommended that you define these already in the constructor
    // so there will be no way to save a resource without the required stuff
    constructor(effectiveType: ObservationEffective,
                status: ObservationStatus,
                category: fhir.CodeableConcept,
                code: fhir.CodeableConcept) {

    }
    
    ...
}

```

**STEP 2:** Let your resource extends from the already existing basic resource

```typescript

// Import the Resource
import { ObservationEffective, 
         ObservationStatus,
         Resource } from "../../../node_modules/Midata";

// Let the class extends the Resource
export class Observation extends Resource {

    // Implement a constructor
    // Check the hl7 fhir documentation of the resource
    // to find out the required fields of the resource.
    // It's recommended that you define these already in the constructor
    // so there will be no way to save a resource without the required stuff
    constructor(effectiveType: ObservationEffective,
                status: ObservationStatus,
                category: fhir.CodeableConcept,
                code: fhir.CodeableConcept) {
        
        // call the super constructor for the definition of the resource type (as string)
        super('Observation');

        // now we can also add the default/requered properties to the resource
        this.addProperty('effectiveDateTime', effectiveType.effectiveDateTime)
        this.addProperty('status', status);
        this.addProperty('category', category);
        this.addProperty('code', code);
    }
    
    ...
}

```

_NOTE:_ It doesn't matter if you use `this` or `super` to access the basic class. It's the same in ts!

**STEP 3:** Register the resource at the midata library resource register

```typescript
// add registerResource to your imports
import { ObservationEffective, 
         ObservationStatus,
         Resource, 
         registerResource } from "../../../node_modules/Midata";

// call the registerResource alias and define the resource name/type
@registerResource('resourceType', 'Observation')
export class Observation extends Resource {

    // Implement a constructor
    // Check the hl7 fhir documentation of the resource
    // to find out the required fields of the resource.
    // It's recommended that you define these already in the constructor
    // so there will be no way to save a resource without the required stuff
    constructor(effectiveType: ObservationEffective,
                status: ObservationStatus,
                category: fhir.CodeableConcept,
                code: fhir.CodeableConcept) {
        ...
    }
    
    ...
}

```

Now you have your fist custom resource! But wait, there's still more...
You can also define default resource categories like the handedness observation.
We call these type of resources `extended resources`. The next part will show you, how you can create your own 'pre-defined/extended' resources (like handedness, HeartRate and so on).

## Create own extended resource

To create your own extended resource, you have to (more or less) do absolutely the same thing as during implementing a new basic resource.

**STEP 1:** Create your resource class

```typescript

export class MyResource {

    // you can set here what you want!
    constructor() {
        //now you have to create your own coding, which has to be registered on midata
        let code = {
            coding: [
                {
                    system: "http://midata.coop",
                    code: "MyResourceCode",
                    display: "Some description..."
                }
            ]
        };


    }
    
    ...
}

```

**STEP 2:** Let your resource extend the basic resource you want (example Observation)
 
```typescript

// Import the requered types if they are given
import { Observation,  
         OBSERVATIONSTATUS, 
         CAT_SURVEY } from "../../../node_modules/Midata";

// set extends with the basic resource you want
export class MyResource extends Observation {

    constructor() {
        // defined in step 1
        let code = ...

        // call the super constructor with the given parameters
        super({effectiveDateTime: new Date().toISOString()},
              OBSERVATIONSTATUS.preliminary,
              CAT_SURVEY,
              code);

        // now you can add you own stuff
        ...
    }
    
    ...
}

```

**STEP 3** Register the resource at the resource registry of the library

```typescript

// add registerResource to your imports
import { Observation, 
         OBSERVATIONSTATUS, 
         CAT_SURVEY, 
         registerResource } from "../../../node_modules/Midata";

// call the registerResource alias and define the resource code
@registerResource('code', '57427004')
export class MyResource extends Observation {

    constructor() {
        ...
    }
    
    ...
}

```

Aand done. 

This sould be more or less everithing you can do with the midata js library. If you have any questions or issues, create one!


***

[<img align="left" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108325.svg">](https://github.com/i4mi/midata.js/wiki/3.-Search,-save,-update-(IONIC-2-&-3))

[<img align="right" width="100" height="100" src="https://image.flaticon.com/icons/svg/108/108324.svg">](https://github.com/i4mi/midata.js/wiki/5.-Supported-Resources-and-Types)
