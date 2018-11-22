MIDATA.js
=========

2017 - Bern University of Applied Sciences - Institute for Medical Informatics (I4MI)

A collection of utility classes and functions to interact with the MIDATA.coop platform.

**Installation**
---
**1.** Register your application in the midata developer backend (see [here](https://test.midata.coop/#/developer/guide "MIDATA Developer Guide")).

**Important**: Use `http://localhost/callback` as the target redirect URI.

**2.** Create your IONIC project using the command `ionic start %YOUR_PROJECTNAME% blank` where `%YOUR_PROJECTNAME%` is the name of your IONIC project. 

**3.** Install the library

**npm**

`$ npm install https://github.com/i4mi/midata.js --save`

**bower** 

`$ bower install midata.js --save`

For details on how to use the library have a look at the [Wiki](https://github.com/i4mi/midata.js/wiki/Usage-(IONIC-2) "MIDATA.js Wiki").

**For Developers**
--

**Initial setup**
---
    $ npm install

**Build**
--

With autocompile:

    $ npm run dev

Autorun tests:

    $ npm run test

Build for production in the `dist` directory.

    $ npm run build

**Whats new**
---
The whole file structure of the midata.js library has changed. The old 'flat' structure got more confusing for each new Resource or Category implemented. The new structure in the `resource` folder has the following ideas:

    -errors:            //additional errors

    -categoryTypes:     //some standard categories that are extending the resources.
                        //for example the blood preassure or the body wheight observation.

    -resourceTypes:     //all the resources that are currently in use by some apps from the i4mi
                        //or from the students of the BFH medical informatics.

    -basicTypes:        //the basic types used in the resources or categories. For example the different status.
                        //the basic types mostly are requered fields in the different resources.

    -categories:        //the categories of the different resources. Like vital sign or survey

    -codings:           //additional codings implemented in the categoreis. Like the coding for blood preassure and so on.

--

In addition the `promise` type of the following public funtion has changed: 
    -`authenticate`
    -`resumeAuthenticate`

It has changed form the `TokenResponse`, which only returns the tokens, to the `AuthAndPatResponse`. This means that now, not only the token response is returned to the client, but also the patient resource. Why? There always existed the `fetchUserInfo` function which was executed but never used. Now we can use this function to lookup for the user information of the logged in person, so that the app doesn't have to execute a similar funciton all the time. 

IMPORTANT: This change needs some adaption of the midataService classes on the client side.

-OLD PROMISE HANDLING:

    ```javascript
    this.midata.authenticate()
        .then((rsp : TokenResponse) => {
            //do some awesome stuff with the token stuff;
        });
        ```
    
-NEW PROMISE HANDLING:

    ```javascript
    this.midata.authenticate()
        .then((rsp : AuthAndPatResponse) => {
            //we can now acces the token response with
            let tokenResponse = rsp.authResponse;
            
            //and access the patient resource of the logged in user
            let patientResource = rsp.patientResource;
        });
        ```
    
