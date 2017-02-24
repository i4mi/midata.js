!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("midata",[],e):"object"==typeof exports?exports.midata=e():t.midata=e()}(this,function(){return function(t){function e(o){if(r[o])return r[o].exports;var n=r[o]={exports:{},id:o,loaded:!1};return t[o].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function o(t){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}var n=r(1);e.Midata=n.Midata,o(r(6));var i=r(6);e.resources=i},function(t,e,r){"use strict";var o=r(2),n=r(5),i=r(6),s=r(12),a=function(){function t(t,e,r){var i=this;if(this._host=t,this._appName=e,this._secret=r,this._create=function(t){var e=i._host+"/fhir/"+t.resourceType;return n.apiCall({jsonBody:!1,url:e,method:"POST",headers:{Authorization:"Bearer "+i._authToken,"Content-Type":"application/json+fhir;charset=utf-8",Prefer:"return=representation"},payload:t})},this._update=function(t){var e=i._host+"/fhir/"+t.resourceType+"/"+t.id;return n.apiCall({jsonBody:!1,url:e,payload:t,headers:{Authorization:"Bearer "+i._authToken,"Content-Type":"application/json+fhir;charset=utf-8",Prefer:"return=representation"},method:"PUT"})},this._refresh=function(){var t={appname:i._appName,secret:i._secret,refreshToken:i._refreshToken},e=n.apiCall({url:i._host+"/v1/auth",method:"POST",payload:t,jsonBody:!0,headers:{"Content-Type":"application/json"}}).then(function(t){var e=t.body;return i._authToken=e.authToken,i._refreshToken=e.refreshToken,e}).catch(function(t){return o.Promise.reject(t.body)});return e},window.localStorage){var s=localStorage.getItem("midataLoginData"),a=JSON.parse(s);a&&this._setLoginData(a.authToken,a.refreshToken,a.user)}}return Object.defineProperty(t.prototype,"loggedIn",{get:function(){return void 0!==this._authToken},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"authToken",{get:function(){return this._authToken},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"refreshToken",{get:function(){return this._refreshToken},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"user",{get:function(){return this._user},enumerable:!0,configurable:!0}),t.prototype.logout=function(){this._user=void 0,this._refreshToken=void 0,this._authToken=void 0,window.localStorage&&localStorage.removeItem("midataLoginData")},t.prototype.login=function(t,e,r){var i=this;if(void 0===t||void 0===e)throw new Error("You need to supply a username and a password!");var s={username:t,password:e,appname:this._appName,secret:this._secret};void 0!==r&&(s.role=r);var a=n.apiCall({url:this._host+"/v1/auth",method:"POST",headers:{"Content-Type":"application/json"},jsonBody:!0,payload:s}).then(function(e){var r=e.body,o={id:r.owner,name:t};return i._setLoginData(r.authToken,r.refreshToken,o),r}).catch(function(t){return o.Promise.reject(t.body)});return a},t.prototype._setLoginData=function(t,e,r){this._authToken=t,this._refreshToken=e,this._user=r,window.localStorage&&localStorage.setItem("midataLoginData",JSON.stringify({authToken:t,refreshToken:e,user:r}))},t.prototype.save=function(t){var e=this;if(void 0===this._authToken)throw new Error("Can't create records when no user logged in first.\n                Call login() before trying to create records.");var r;r=t instanceof i.Resource?t.toJson():t;var n=void 0===r.id,s=n?this._create:this._update;return s(r).then(function(t){return 201===t.status?JSON.parse(t.body):200===t.status?JSON.parse(t.body):o.Promise.reject("Unexpected response status code: "+t.status)}).catch(function(t){return 401!==t.status?400===t.status?o.Promise.reject("Resource could not be parsed or failed basic FHIR validation rules."):404===t.status?o.Promise.reject("Resource type not supported or not a valid FHIR end-point."):422===t.status?o.Promise.reject("The proposed resource violated applicable FHIR profiles or server business rules.\nMore details should be contained in the error message:\n"+t.body):500===t.status?o.Promise.reject(t.body):o.Promise.reject("Unexpected error response status code: "+t.status+"\n                    Message: "+t.body):void e.logout()})},t.prototype.search=function(t,e){void 0===e&&(e={});var r=this._host+"/fhir/"+t;return this._search(r,e)},t.prototype._search=function(t,e){var r=this;void 0===e&&(e={});var i=Object.keys(e).map(function(t){return t+"="+e[t]}),a=i.join("&");a=a&&"?"+a||"";var c=t+a;return n.apiCall({url:c,method:"GET",jsonBody:!0,headers:{Authorization:"Bearer "+this._authToken,"Content-Type":"application/json+fhir;charset=utf-8"}}).then(function(t){if(void 0!==t.body.entry){var e=t.body.entry,r=e.map(function(t){return s.fromFhir(t.resource)});return r}return[]}).catch(function(t){return 401===t.status?(r.logout(),o.Promise.reject(t)):o.Promise.reject(t)})},t}();e.Midata=a},function(t,e,r){(function(e,o){!function(e,r){t.exports=r()}(this,function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function n(t){return"function"==typeof t}function i(t){G=t}function s(t){K=t}function a(){return function(){return e.nextTick(p)}}function c(){return"undefined"!=typeof z?function(){z(p)}:l()}function u(){var t=0,e=new Z(p),r=document.createTextNode("");return e.observe(r,{characterData:!0}),function(){r.data=t=++t%2}}function f(){var t=new MessageChannel;return t.port1.onmessage=p,function(){return t.port2.postMessage(0)}}function l(){var t=setTimeout;return function(){return t(p,1)}}function p(){for(var t=0;t<Y;t+=2){var e=rt[t],r=rt[t+1];e(r),rt[t]=void 0,rt[t+1]=void 0}Y=0}function h(){try{var t=r(4);return z=t.runOnLoop||t.runOnContext,c()}catch(t){return l()}}function d(t,e){var r=arguments,o=this,n=new this.constructor(v);void 0===n[nt]&&E(n);var i=o._state;return i?!function(){var t=r[i-1];K(function(){return B(i,n,t,o._result)})}():x(o,n,t,e),n}function y(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var r=new e(v);return j(r,t),r}function v(){}function g(){return new TypeError("You cannot resolve a promise with itself")}function m(){return new TypeError("A promises callback cannot return that same promise.")}function _(t){try{return t.then}catch(t){return ct.error=t,ct}}function b(t,e,r,o){try{t.call(e,r,o)}catch(t){return t}}function w(t,e,r){K(function(t){var o=!1,n=b(r,e,function(r){o||(o=!0,e!==r?j(t,r):R(t,r))},function(e){o||(o=!0,S(t,e))},"Settle: "+(t._label||" unknown promise"));!o&&n&&(o=!0,S(t,n))},t)}function O(t,e){e._state===st?R(t,e._result):e._state===at?S(t,e._result):x(e,void 0,function(e){return j(t,e)},function(e){return S(t,e)})}function T(t,e,r){e.constructor===t.constructor&&r===d&&e.constructor.resolve===y?O(t,e):r===ct?S(t,ct.error):void 0===r?R(t,e):n(r)?w(t,e,r):R(t,e)}function j(e,r){e===r?S(e,g()):t(r)?T(e,r,_(r)):R(e,r)}function P(t){t._onerror&&t._onerror(t._result),k(t)}function R(t,e){t._state===it&&(t._result=e,t._state=st,0!==t._subscribers.length&&K(k,t))}function S(t,e){t._state===it&&(t._state=at,t._result=e,K(P,t))}function x(t,e,r,o){var n=t._subscribers,i=n.length;t._onerror=null,n[i]=e,n[i+st]=r,n[i+at]=o,0===i&&t._state&&K(k,t)}function k(t){var e=t._subscribers,r=t._state;if(0!==e.length){for(var o=void 0,n=void 0,i=t._result,s=0;s<e.length;s+=3)o=e[s],n=e[s+r],o?B(r,o,n,i):n(i);t._subscribers.length=0}}function C(){this.error=null}function A(t,e){try{return t(e)}catch(t){return ut.error=t,ut}}function B(t,e,r,o){var i=n(r),s=void 0,a=void 0,c=void 0,u=void 0;if(i){if(s=A(r,o),s===ut?(u=!0,a=s.error,s=null):c=!0,e===s)return void S(e,m())}else s=o,c=!0;e._state!==it||(i&&c?j(e,s):u?S(e,a):t===st?R(e,s):t===at&&S(e,s))}function M(t,e){try{e(function(e){j(t,e)},function(e){S(t,e)})}catch(e){S(t,e)}}function L(){return ft++}function E(t){t[nt]=ft++,t._state=void 0,t._result=void 0,t._subscribers=[]}function H(t,e){this._instanceConstructor=t,this.promise=new t(v),this.promise[nt]||E(this.promise),q(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?R(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&R(this.promise,this._result))):S(this.promise,D())}function D(){return new Error("Array Methods must be provided an Array")}function I(t){return new H(this,t).promise}function N(t){var e=this;return new e(q(t)?function(r,o){for(var n=t.length,i=0;i<n;i++)e.resolve(t[i]).then(r,o)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function V(t){var e=this,r=new e(v);return S(r,t),r}function J(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function F(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function Q(t){this[nt]=L(),this._result=this._state=void 0,this._subscribers=[],v!==t&&("function"!=typeof t&&J(),this instanceof Q?M(this,t):F())}function U(){var t=void 0;if("undefined"!=typeof o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=Q}var W=void 0;W=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var q=W,Y=0,z=void 0,G=void 0,K=function(t,e){rt[Y]=t,rt[Y+1]=e,Y+=2,2===Y&&(G?G(p):ot())},X="undefined"!=typeof window?window:void 0,$=X||{},Z=$.MutationObserver||$.WebKitMutationObserver,tt="undefined"==typeof self&&"undefined"!=typeof e&&"[object process]"==={}.toString.call(e),et="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,rt=new Array(1e3),ot=void 0;ot=tt?a():Z?u():et?f():void 0===X?h():l();var nt=Math.random().toString(36).substring(16),it=void 0,st=1,at=2,ct=new C,ut=new C,ft=0;return H.prototype._enumerate=function(){for(var t=this.length,e=this._input,r=0;this._state===it&&r<t;r++)this._eachEntry(e[r],r)},H.prototype._eachEntry=function(t,e){var r=this._instanceConstructor,o=r.resolve;if(o===y){var n=_(t);if(n===d&&t._state!==it)this._settledAt(t._state,e,t._result);else if("function"!=typeof n)this._remaining--,this._result[e]=t;else if(r===Q){var i=new r(v);T(i,t,n),this._willSettleAt(i,e)}else this._willSettleAt(new r(function(e){return e(t)}),e)}else this._willSettleAt(o(t),e)},H.prototype._settledAt=function(t,e,r){var o=this.promise;o._state===it&&(this._remaining--,t===at?S(o,r):this._result[e]=r),0===this._remaining&&R(o,this._result)},H.prototype._willSettleAt=function(t,e){var r=this;x(t,void 0,function(t){return r._settledAt(st,e,t)},function(t){return r._settledAt(at,e,t)})},Q.all=I,Q.race=N,Q.resolve=y,Q.reject=V,Q._setScheduler=i,Q._setAsap=s,Q._asap=K,Q.prototype={constructor:Q,then:d,catch:function(t){return this.then(null,t)}},Q.polyfill=U,Q.Promise=Q,Q})}).call(e,r(3),function(){return this}())},function(t,e){function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function n(t){if(f===setTimeout)return setTimeout(t,0);if((f===r||!f)&&setTimeout)return f=setTimeout,setTimeout(t,0);try{return f(t,0)}catch(e){try{return f.call(null,t,0)}catch(e){return f.call(this,t,0)}}}function i(t){if(l===clearTimeout)return clearTimeout(t);if((l===o||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(t);try{return l(t)}catch(e){try{return l.call(null,t)}catch(e){return l.call(this,t)}}}function s(){y&&h&&(y=!1,h.length?d=h.concat(d):v=-1,d.length&&a())}function a(){if(!y){var t=n(s);y=!0;for(var e=d.length;e;){for(h=d,d=[];++v<e;)h&&h[v].run();v=-1,e=d.length}h=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function u(){}var f,l,p=t.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:r}catch(t){f=r}try{l="function"==typeof clearTimeout?clearTimeout:o}catch(t){l=o}}();var h,d=[],y=!1,v=-1;p.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];d.push(new c(t,e)),1!==d.length||y||n(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=u,p.addListener=u,p.once=u,p.off=u,p.removeListener=u,p.removeAllListeners=u,p.emit=u,p.binding=function(t){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(t){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(t,e){},function(t,e,r){"use strict";function o(t){var e=t.url,r=t.method,o=t.payload,i=t.headers,s=t.jsonBody||!1;return new n.Promise(function(t,n){var a=new XMLHttpRequest;a.open(r,e,!0),i&&Object.keys(i).forEach(function(t){a.setRequestHeader(t,i[t])}),a.onreadystatechange=function(){if(4===this.readyState){var e=this.status;if(e>=200&&e<300){var r=void 0;r=s?JSON.parse(this.responseText):this.responseText,t({message:"Request successful",body:r,status:e})}else n({message:this.statusText,body:this.responseText,status:e})}},a.onerror=function(){n({message:"Network error",body:"",status:0})},void 0!==o?a.send(JSON.stringify(o)):a.send()})}var n=r(2);e.apiCall=o},function(t,e,r){"use strict";var o=r(7);e.Resource=o.Resource;var n=r(8);e.Observation=n.Observation;var i=r(9);e.BodyWeight=i.BodyWeight;var s=r(13);e.Temperature=s.Temperature;var a=r(14);e.HeartRate=a.HeartRate;var c=r(15);e.StepsCount=c.StepsCount;var u=r(16);e.BodyHeight=u.BodyHeight;var f=r(17);e.Questionnaire=f.Questionnaire;var l=r(18);e.BloodPressure=l.BloodPressure;var p=r(19);e.Media=p.Media;var h=r(20);e.ImageMedia=h.ImageMedia;var d=r(21);e.Laboratory=d.Laboratory;var y=r(22);e.Hemoglobin=y.Hemoglobin;var v=r(11);e.categories=v},function(t,e){"use strict";var r=function(){function t(t){this._fhir={},this._fhir.resourceType=t}return t.prototype.addProperty=function(t,e){this._fhir[t]=e},t.prototype.removeProperty=function(t){delete this._fhir[t]},t.prototype.toJson=function(){return this._fhir},Object.defineProperty(t.prototype,"id",{get:function(){return this._fhir.id},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"resourceType",{get:function(){return this._fhir.resourceType},enumerable:!0,configurable:!0}),t}();e.Resource=r},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(7),i=function(t){function e(e,r,o,n){t.call(this,"Observation"),this.addProperty("status","final"),this.addProperty("code",o),this.addProperty("effectiveDateTime",r.toISOString()),this.addProperty("valueQuantity",e),this.addProperty("category",n)}return o(e,t),e}(n.Resource);e.Observation=i;var s=function(t){function e(e,r,o){t.call(this,"Observation"),this.addProperty("status","final"),this.addProperty("code",r),this.addProperty("effectiveDateTime",e.toISOString()),this.addProperty("component",[]),this.addProperty("category",o)}return o(e,t),e.prototype.addComponent=function(t){this._fhir.component.push(t)},e}(n.Resource);e.MultiObservation=s},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(10),s=r(12),a=function(t){function e(e,r){var o={value:e,unit:"kg",system:"http://unitsofmeasure.org"};t.call(this,o,r,{coding:[{system:"http://loinc.org",code:"3141-9",display:"Weight Measured"}]})}return o(e,t),e=n([s.registerResource("3141-9")],e)}(i.VitalSigns);e.BodyWeight=a},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(11),i=r(8),s=function(t){function e(e,r,o){t.call(this,e,r,o,n.VitalSigns)}return o(e,t),e}(i.Observation);e.VitalSigns=s},function(t,e){"use strict";e.VitalSigns={coding:[{system:"http://hl7.org/fhir/observation-category",code:"vital-signs",display:"Vital Signs"}],text:"Vital Signs"},e.Laboratory={coding:[{system:"http://hl7.org/fhir/observation-category",code:"laboratory",display:"Laboratory"}],text:"Laboratory"}},function(t,e){"use strict";function r(t){return function(e){n[t]=e,i.cls=e}}function o(t){var e=void 0!==t.code&&void 0!==t.code.coding&&1==t.code.coding.length&&void 0!==t.code.coding[0].code,r=!1;if(e){var o=t.code.coding[0].code;r=void 0!==n[o]}if(r){var o=t.code.coding[0].code,i={_fhir:t},s=n[o];return i.__proto__=s.prototype,i}return t.toJson=function(){return this},t}var n={};e.registerResource=r,e.fromFhir=o;var i=window;i.fromFhir=o},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(10),s=r(12),a={coding:[{system:"http://acme.lab",code:"BT",display:"Body temperature"},{system:"http://loinc.org",code:"8310-5",display:"Body temperature"},{system:"http://snomed.info/sct",code:"56342008",display:"Temperature taking"}],text:"Body temperature"},c=function(t){function e(e,r){var o={value:e,unit:"degrees C",code:"258710007",system:"http://snomed.info/sct"};t.call(this,o,r,a)}return o(e,t),e=n([s.registerResource("258710007")],e)}(i.VitalSigns);e.Temperature=c},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(10),s=r(12),a=function(t){function e(e,r){var o={value:e,unit:"bpm"};t.call(this,o,r,{coding:[{system:"http://loinc.org",code:"8867-4",display:"Heart Rate"}]})}return o(e,t),e=n([s.registerResource("8867-4")],e)}(i.VitalSigns);e.HeartRate=a},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(10),s=r(12),a=function(t){function e(e,r){var o={value:e,unit:"steps"};t.call(this,o,r,{text:"Steps",coding:[{system:"http://midata.coop",code:"activities/steps",display:"Steps"}]})}return o(e,t),e=n([s.registerResource("activities/steps")],e)}(i.VitalSigns);e.StepsCount=a},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(10),s=r(12),a=function(t){function e(e,r){var o={value:e,unit:"cm",system:"http://unitsofmeasure.org"};t.call(this,o,r,{coding:[{system:"http://loinc.org",code:"8302-2",display:"Body Height"}]})}return o(e,t),e=n([s.registerResource("8302-2")],e)}(i.VitalSigns);e.BodyHeight=a},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(7),i=function(t){function e(e){t.call(this,"Questionnaire"),this.addProperty("status","published")}return o(e,t),e}(n.Resource);e.Questionnaire=i},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(8),s=r(11),a=r(12),c=function(t){function e(e,r,o){var n={coding:[{system:"http://loinc.org",code:"55417-0",display:"Blood Pressure"}]};t.call(this,o,n,s.VitalSigns),this.addComponent({code:{coding:[{system:"http://loinc.org",code:"8480-6",display:"Systolic blood pressure"}]},valueQuantity:{value:e,unit:"mm[Hg]"}}),this.addComponent({code:{coding:[{system:"http://loinc.org",code:"8462-4",display:"Diastolic blood pressure"}]},valueQuantity:{value:r,unit:"mm[Hg]"}})}return o(e,t),e=n([a.registerResource("55417-0")],e)}(i.MultiObservation);e.BloodPressure=c},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(7),i=function(t){function e(e,r,o,n){t.call(this,"Media"),this.addProperty("type",r),this.addProperty("content",{contentType:o,data:n,title:e})}return o(e,t),e}(n.Resource);e.Media=i},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(19),i=["png","gif","jpg"],s=function(t){function e(e,r){var o,n=e.match(/\.(\w+)$/);if(null===n)throw new Error("The filename requires a file extension!");if(o=n[1].toLowerCase(),i.indexOf(o)===-1)throw new Error("Unsupported type: "+o);t.call(this,e,"photo","image/"+o,r)}return o(e,t),e}(n.Media);e.ImageMedia=s},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=r(11),i=r(8),s=function(t){function e(e,r,o){t.call(this,e,r,o,n.Laboratory)}return o(e,t),e}(i.Observation);e.Laboratory=s},function(t,e,r){"use strict";var o=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},n=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(i<3?n(s):i>3?n(e,r,s):n(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s},i=r(21),s=r(12),a=function(t){function e(e,r){var o={value:e,unit:"g/dL"};t.call(this,o,r,{coding:[{system:"http://loinc.org",code:"718-7",display:"Hemoglobin [Mass/volume] in Blood"}]})}return o(e,t),e=n([s.registerResource("718-7")],e)}(i.Laboratory);e.Hemoglobin=a}])});
//# sourceMappingURL=midata.js.map