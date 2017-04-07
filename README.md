MIDATA.js
=========

A collection of utility classes and functions to interact with the MIDATA.coop platform.

Release Notes
-----------
- 2.2: Minor. Added support for Bundles
- 2.1: Minor. Reintroduced get user method
- 2.0: Added support for end user authentication using OAuth2

Installation
-----------

The following steps will show you how to install and use the midata.js lib in your custom ionic 2 project.


1. Register your application in the midata developer backend (see https://test.midata.coop/#/developer/guide). 

   **Important:** Use `http://localhost/callback` as redirect URI.

2. Create your ionic 2 project `ionic start %YOUR_PROJECTNAME% blank --v2` (skip this step if you've already created one).

2. Install the library

       $ npm install https://github.com/i4mi/midata.js#v2.2  --save
    
3. Install the `cordova inappbrowser plugin`. This plugin is required to make the platform's native in app browser handling work properly.

       $ cordova plugin add cordova-plugin-inappbrowser
         
Usage
-----------

       
In your target service (e.g. network service) add the following:
       
       import {Midata} from 'midata';
       
       let midata: Midata;
       
       ...
              
Initialize the midata object within your service's constructor
       
       @Injectable()
       export class DataService {
       
       constructor(...) {
       
       ... 
      
       midata = new Midata("https://test.midata.coop:9000","oauth2test"); // the app name (2nd statement) must match
       // the internal app name that you configured upon registration of your application on MIDATA.
       
       }
         
       // login using oAuth2
            
         login(){
           return midata.authenticate();
         }
           
           
In your target page inject your DataService and let it access the MIDATA library

       import {Page} from 'ionic/ionic';
       import {DataService} from './service';
       
       @Component({
       selector: 'page-target',
       templateUrl: 'target.html'
       })
       
       export class TargetPage {
       
         constructor(private data: DataService) {
         
           ...
           
         }
         
       ...
         
         onLogin(){
           this.data.login().then(response => {
             console.log(response);
       
             // TODO: Implement your logic (e.g. push welcome site, do stuff, etc.)
                    
           });

       }
       
       
The following extension assumes that after successful login you would then subsequently like to store a measured body weight onto MIDATA.

In your target service (e.g. network service) add the Resource import statement.
              
       import {Midata, Resource} from 'midata';
            
       ...


Implement the wrapper method

       saveResource(r : Resource) {
       
          return midata.save(r);
       
       }
       
Back in your target page add the import statement for the BodyWeight resource


       import {Page} from 'ionic/ionic';
       import {DataService} from './service';
       import {BodyWeight} from 'midata';
       
       ...
       
       
Finally implement the service method call

       ...
       
       onSave(){
       
         let bw = new BodyWeight(85, new Date()); // just for demonstration. 
         // in practice you would most likely pass a body weight object on method invocation or fetch it from somewhere...
       
         this.data.saveResource(bw).then(response => {
           console.log(response);
              
            // TODO: Implement your logic (notify user about successful storage on midata, do stuff, etc.)
                           
            });
       
        }


For Developers
-----------

### Initial setup

    $ npm install

### Build

With autocompile:

    $ npm run dev

Autorun tests:

    $ npm run test

Build for production in the `dist` directory.

    $ npm run build
