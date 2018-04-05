
//service worker for pwa app

var dataCacheName = 'pwaNotificationData-v1';
var cacheName = 'waNotificationCache';
var filesToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  clients.claim();
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
  		
  		console.log('[ServiceWorker] addEventListener Activate');

        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('message', function(messageEvent) {
  console.log('Handling message event in sw:', messageEvent);
});

// Initialize Firebase App
 self.addEventListener("notificationclick", function(event) {
    console.log('On notification click1: ', event.notification); 

    var mymessage = {

    	type: "notification",
    	msg: "received notification from service worker post",
    	title: event.notification.title,
    	body: event.notification.body	

    }

	

    // close the notification
    event.notification.close();

    //To open the app after click notification
    event.waitUntil(
        clients.matchAll({includeUncontrolled: true, type: 'window'})
        .then(function(clientList) {

        	console.log('client list length: '+ clientList.length); 

            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];

                console.log(client);

                client.postMessage(mymessage);

                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clientList.length === 0) {
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            }
        })
    );
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

// Handle Background Notifications


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});


/*! @license Firebase v3.5.0
    Build: 3.5.0-rc.8
    Terms: https://developers.google.com/terms */
var firebase = null; (function() { for(var aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,ba=function(){ba=function(){};h.Symbol||(h.Symbol=ca)},da=0,ca=function(a){return"jscomp_symbol_"+(a||"")+da++},m=function(){ba();var a=h.Symbol.iterator;a||(a=h.Symbol.iterator=
h.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(this)}});m=function(){}},ea=function(a){var b=0;return fa(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})},fa=function(a){m();a={next:a};a[h.Symbol.iterator]=function(){return this};return a},n=function(a){m();var b=a[Symbol.iterator];return b?b.call(a):ea(a)},p=h,q=["Promise"],r=0;r<q.length-1;r++){var t=q[r];t in p||(p[t]={});p=p[t]}
var ga=q[q.length-1],u=p[ga],w=function(){function a(){this.c=null}if(u)return u;a.prototype.L=function(a){null==this.c&&(this.c=[],this.W());this.c.push(a)};a.prototype.W=function(){var a=this;this.M(function(){a.$()})};var b=h.setTimeout;a.prototype.M=function(a){b(a,0)};a.prototype.$=function(){for(;this.c&&this.c.length;){var a=this.c;this.c=[];for(var b=0;b<a.length;++b){var c=a[b];delete a[b];try{c()}catch(k){this.X(k)}}}this.c=null};a.prototype.X=function(a){this.M(function(){throw a;})};var c=
function(a){this.a=0;this.j=void 0;this.m=[];var b=this.F();try{a(b.resolve,b.reject)}catch(g){b.reject(g)}};c.prototype.F=function(){function a(a){return function(e){c||(c=!0,a.call(b,e))}}var b=this,c=!1;return{resolve:a(this.ia),reject:a(this.K)}};c.prototype.ia=function(a){if(a===this)this.K(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof c)this.la(a);else{var b;a:switch(typeof a){case "object":b=null!=a;break a;case "function":b=!0;break a;default:b=!1}b?this.ha(a):
this.R(a)}};c.prototype.ha=function(a){var b=void 0;try{b=a.then}catch(g){this.K(g);return}"function"==typeof b?this.ma(b,a):this.R(a)};c.prototype.K=function(a){this.U(2,a)};c.prototype.R=function(a){this.U(1,a)};c.prototype.U=function(a,b){if(0!=this.a)throw Error("Cannot settle("+a+", "+b|"): Promise already settled in state"+this.a);this.a=a;this.j=b;this.ba()};c.prototype.ba=function(){if(null!=this.m){for(var a=this.m,b=0;b<a.length;++b)a[b].call(),a[b]=null;this.m=null}};var d=new a;c.prototype.la=
function(a){var b=this.F();a.o(b.resolve,b.reject)};c.prototype.ma=function(a,b){var c=this.F();try{a.call(b,c.resolve,c.reject)}catch(k){c.reject(k)}};c.prototype.then=function(a,b){function e(a,b){return"function"==typeof a?function(b){try{d(a(b))}catch(Fa){f(Fa)}}:b}var d,f,z=new c(function(a,b){d=a;f=b});this.o(e(a,d),e(b,f));return z};c.prototype.catch=function(a){return this.then(void 0,a)};c.prototype.o=function(a,b){function c(){switch(e.a){case 1:a(e.j);break;case 2:b(e.j);break;default:throw Error("Unexpected state: "+
e.a);}}var e=this;null==this.m?d.L(c):this.m.push(function(){d.L(c)})};c.resolve=function(a){return a instanceof c?a:new c(function(b){b(a)})};c.reject=function(a){return new c(function(b,c){c(a)})};c.race=function(a){return new c(function(b,d){for(var e=n(a),f=e.next();!f.done;f=e.next())c.resolve(f.value).o(b,d)})};c.all=function(a){var b=n(a),d=b.next();return d.done?c.resolve([]):new c(function(a,e){function k(b){return function(c){f[b]=c;l--;0==l&&a(f)}}var f=[],l=0;do f.push(void 0),l++,c.resolve(d.value).o(k(f.length-
1),e),d=b.next();while(!d.done)})};c.$jscomp$new$AsyncExecutor=function(){return new a};return c}();w!=u&&null!=w&&aa(p,ga,{configurable:!0,writable:!0,value:w});
var x=this,y=function(){},ha=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},A=function(a){return"function"==ha(a)},ia=function(a,b,c){return a.call.apply(a.bind,arguments)},ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},B=function(a,b,c){B=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?
ia:ja;return B.apply(null,arguments)},ka=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},la=function(a,b){function c(){}c.prototype=b.prototype;a.xa=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.wa=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var C;C="undefined"!==typeof window?window:"undefined"!==typeof self?self:global;function __extends(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);a.prototype=null===b?Object.create(b):(c.prototype=b.prototype,new c)}
function __decorate(a,b,c,d){var e=arguments.length,f=3>e?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d,g;g=C.Reflect;if("object"===typeof g&&"function"===typeof g.decorate)f=g.decorate(a,b,c,d);else for(var k=a.length-1;0<=k;k--)if(g=a[k])f=(3>e?g(f):3<e?g(b,c,f):g(b,c))||f;return 3<e&&f&&Object.defineProperty(b,c,f),f}function __metadata(a,b){var c=C.Reflect;if("object"===typeof c&&"function"===typeof c.metadata)return c.metadata(a,b)}
var __param=function(a,b){return function(c,d){b(c,d,a)}},__awaiter=function(a,b,c,d){return new (c||(c=Promise))(function(e,f){function g(a){try{l(d.next(a))}catch(v){f(v)}}function k(a){try{l(d.throw(a))}catch(v){f(v)}}function l(a){a.done?e(a.value):(new c(function(b){b(a.value)})).then(g,k)}l((d=d.apply(a,b)).next())})};"undefined"!==typeof C.V&&C.V||(C.ta=__extends,C.sa=__decorate,C.ua=__metadata,C.va=__param,C.ra=__awaiter);var D=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,D);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};la(D,Error);D.prototype.name="CustomError";var ma=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};var E=function(a,b){b.unshift(a);D.call(this,ma.apply(null,b));b.shift()};la(E,D);E.prototype.name="AssertionError";var na=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new E(""+e,f||[]);},F=function(a,b,c){a||na("",null,b,Array.prototype.slice.call(arguments,2))},G=function(a,b,c){A(a)||na("Expected function but got %s: %s.",[ha(a),a],b,Array.prototype.slice.call(arguments,2))};var H=function(a,b,c){this.ea=c;this.Y=a;this.ga=b;this.A=0;this.w=null};H.prototype.get=function(){var a;0<this.A?(this.A--,a=this.w,this.w=a.next,a.next=null):a=this.Y();return a};H.prototype.put=function(a){this.ga(a);this.A<this.ea&&(this.A++,a.next=this.w,this.w=a)};var I;a:{var oa=x.navigator;if(oa){var pa=oa.userAgent;if(pa){I=pa;break a}}I=""};var qa=function(a){x.setTimeout(function(){throw a;},0)},J,ra=function(){var a=x.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==I.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+
"//"+b.location.host,a=B(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==I.indexOf("Trident")&&-1==I.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.N;c.N=null;a()}};return function(a){d.next={N:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in
document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){x.setTimeout(a,0)}};var K=function(){this.C=this.g=null},sa=new H(function(){return new L},function(a){a.reset()},100);K.prototype.add=function(a,b){var c=sa.get();c.set(a,b);this.C?this.C.next=c:(F(!this.g),this.g=c);this.C=c};K.prototype.remove=function(){var a=null;this.g&&(a=this.g,this.g=this.g.next,this.g||(this.C=null),a.next=null);return a};var L=function(){this.next=this.scope=this.H=null};L.prototype.set=function(a,b){this.H=a;this.scope=b;this.next=null};
L.prototype.reset=function(){this.next=this.scope=this.H=null};var O=function(a,b){M||ta();N||(M(),N=!0);ua.add(a,b)},M,ta=function(){var a=x.Promise;if(-1!=String(a).indexOf("[native code]")){var b=a.resolve(void 0);M=function(){b.then(va)}}else M=function(){var a=va,b;!(b=!A(x.setImmediate))&&(b=x.Window&&x.Window.prototype)&&(b=-1==I.indexOf("Edge")&&x.Window.prototype.setImmediate==x.setImmediate);b?(J||(J=ra()),J(a)):x.setImmediate(a)}},N=!1,ua=new K,va=function(){for(var a;a=ua.remove();){try{a.H.call(a.scope)}catch(b){qa(b)}sa.put(a)}N=!1};var Q=function(a,b){this.a=0;this.j=void 0;this.s=this.h=this.B=null;this.v=this.G=!1;if(a!=y)try{var c=this;a.call(b,function(a){P(c,2,a)},function(a){try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(e){}P(c,3,a)})}catch(d){P(this,3,d)}},wa=function(){this.next=this.context=this.i=this.f=this.child=null;this.D=!1};wa.prototype.reset=function(){this.context=this.i=this.f=this.child=null;this.D=!1};
var xa=new H(function(){return new wa},function(a){a.reset()},100),ya=function(a,b,c){var d=xa.get();d.f=a;d.i=b;d.context=c;return d},Aa=function(a,b,c){za(a,b,c,null)||O(ka(b,a))};Q.prototype.then=function(a,b,c){null!=a&&G(a,"opt_onFulfilled should be a function.");null!=b&&G(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return Ba(this,A(a)?a:null,A(b)?b:null,c)};Q.prototype.then=Q.prototype.then;Q.prototype.$goog_Thenable=!0;
Q.prototype.na=function(a,b){return Ba(this,null,a,b)};var Da=function(a,b){a.h||2!=a.a&&3!=a.a||Ca(a);F(null!=b.f);a.s?a.s.next=b:a.h=b;a.s=b},Ba=function(a,b,c,d){var e=ya(null,null,null);e.child=new Q(function(a,g){e.f=b?function(c){try{var e=b.call(d,c);a(e)}catch(z){g(z)}}:a;e.i=c?function(b){try{var e=c.call(d,b);a(e)}catch(z){g(z)}}:g});e.child.B=a;Da(a,e);return e.child};Q.prototype.oa=function(a){F(1==this.a);this.a=0;P(this,2,a)};
Q.prototype.pa=function(a){F(1==this.a);this.a=0;P(this,3,a)};
var P=function(a,b,c){0==a.a&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.a=1,za(c,a.oa,a.pa,a)||(a.j=c,a.a=b,a.B=null,Ca(a),3!=b||Ea(a,c)))},za=function(a,b,c,d){if(a instanceof Q)return null!=b&&G(b,"opt_onFulfilled should be a function."),null!=c&&G(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),Da(a,ya(b||y,c||null,d)),!0;var e;if(a)try{e=!!a.$goog_Thenable}catch(g){e=!1}else e=!1;if(e)return a.then(b,c,d),
!0;e=typeof a;if("object"==e&&null!=a||"function"==e)try{var f=a.then;if(A(f))return Ga(a,f,b,c,d),!0}catch(g){return c.call(d,g),!0}return!1},Ga=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},k=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,k)}catch(l){k(l)}},Ca=function(a){a.G||(a.G=!0,O(a.aa,a))},Ha=function(a){var b=null;a.h&&(b=a.h,a.h=b.next,b.next=null);a.h||(a.s=null);null!=b&&F(null!=b.f);return b};
Q.prototype.aa=function(){for(var a;a=Ha(this);){var b=this.a,c=this.j;if(3==b&&a.i&&!a.D){var d;for(d=this;d&&d.v;d=d.B)d.v=!1}if(a.child)a.child.B=null,Ia(a,b,c);else try{a.D?a.f.call(a.context):Ia(a,b,c)}catch(e){Ja.call(null,e)}xa.put(a)}this.G=!1};var Ia=function(a,b,c){2==b?a.f.call(a.context,c):a.i&&a.i.call(a.context,c)},Ea=function(a,b){a.v=!0;O(function(){a.v&&Ja.call(null,b)})},Ja=qa;function R(a,b){if(!(b instanceof Object))return b;switch(b.constructor){case Date:return new Date(b.getTime());case Object:void 0===a&&(a={});break;case Array:a=[];break;default:return b}for(var c in b)b.hasOwnProperty(c)&&(a[c]=R(a[c],b[c]));return a};Q.all=function(a){return new Q(function(b,c){var d=a.length,e=[];if(d)for(var f=function(a,c){d--;e[a]=c;0==d&&b(e)},g=function(a){c(a)},k=0,l;k<a.length;k++)l=a[k],Aa(l,ka(f,k),g);else b(e)})};Q.resolve=function(a){if(a instanceof Q)return a;var b=new Q(y);P(b,2,a);return b};Q.reject=function(a){return new Q(function(b,c){c(a)})};Q.prototype["catch"]=Q.prototype.na;var S=Q;"undefined"!==typeof Promise&&(S=Promise);var Ka=S;function La(a,b){a=new T(a,b);return a.subscribe.bind(a)}var T=function(a,b){var c=this;this.b=[];this.T=0;this.task=Ka.resolve();this.u=!1;this.J=b;this.task.then(function(){a(c)}).catch(function(a){c.error(a)})};T.prototype.next=function(a){U(this,function(b){b.next(a)})};T.prototype.error=function(a){U(this,function(b){b.error(a)});this.close(a)};T.prototype.complete=function(){U(this,function(a){a.complete()});this.close()};
T.prototype.subscribe=function(a,b,c){var d=this,e;if(void 0===a&&void 0===b&&void 0===c)throw Error("Missing Observer.");e=Ma(a)?a:{next:a,error:b,complete:c};void 0===e.next&&(e.next=Na);void 0===e.error&&(e.error=Na);void 0===e.complete&&(e.complete=Na);a=this.qa.bind(this,this.b.length);this.u&&this.task.then(function(){try{d.O?e.error(d.O):e.complete()}catch(f){}});this.b.push(e);return a};
T.prototype.qa=function(a){void 0!==this.b&&void 0!==this.b[a]&&(delete this.b[a],--this.T,0===this.T&&void 0!==this.J&&this.J(this))};var U=function(a,b){if(!a.u)for(var c=0;c<a.b.length;c++)Oa(a,c,b)},Oa=function(a,b,c){a.task.then(function(){if(void 0!==a.b&&void 0!==a.b[b])try{c(a.b[b])}catch(d){}})};T.prototype.close=function(a){var b=this;this.u||(this.u=!0,void 0!==a&&(this.O=a),this.task.then(function(){b.b=void 0;b.J=void 0}))};
function Ma(a){if("object"!==typeof a||null===a)return!1;for(var b=n(["next","error","complete"]),c=b.next();!c.done;c=b.next())if(c=c.value,c in a&&"function"===typeof a[c])return!0;return!1}function Na(){};var Pa=Error.captureStackTrace,V=function(a,b){this.code=a;this.message=b;if(Pa)Pa(this,Qa.prototype.create);else{var c=Error.apply(this,arguments);this.name="FirebaseError";Object.defineProperty(this,"stack",{get:function(){return c.stack}})}};V.prototype=Object.create(Error.prototype);V.prototype.constructor=V;V.prototype.name="FirebaseError";var Qa=function(a,b,c){this.ja=a;this.ka=b;this.Z=c;this.pattern=/\{\$([^}]+)}/g};
Qa.prototype.create=function(a,b){void 0===b&&(b={});var c=this.Z[a];a=this.ja+"/"+a;var c=void 0===c?"Error":c.replace(this.pattern,function(a,c){a=b[c];return void 0!==a?a.toString():"<"+c+"?>"}),c=this.ka+": "+c+" ("+a+").",c=new V(a,c),d;for(d in b)b.hasOwnProperty(d)&&"_"!==d.slice(-1)&&(c[d]=b[d]);return c};var W=S,X=function(a,b,c){var d=this;this.P=c;this.S=!1;this.l={};this.I=b;this.fa=R(void 0,a);Object.keys(c.INTERNAL.factories).forEach(function(a){var b=c.INTERNAL.useAsService(d,a);null!==b&&(b=d.da.bind(d,b),d[a]=b)})};X.prototype.delete=function(){var a=this;return(new W(function(b){Y(a);b()})).then(function(){a.P.INTERNAL.removeApp(a.I);return W.all(Object.keys(a.l).map(function(b){return a.l[b].INTERNAL.delete()}))}).then(function(){a.S=!0;a.l={}})};
X.prototype.da=function(a){Y(this);void 0===this.l[a]&&(this.l[a]=this.P.INTERNAL.factories[a](this,this.ca.bind(this)));return this.l[a]};X.prototype.ca=function(a){R(this,a)};var Y=function(a){a.S&&Z(Ra("deleted",{name:a.I}))};h.Object.defineProperties(X.prototype,{name:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.I}},options:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.fa}}});X.prototype.name&&X.prototype.options||X.prototype.delete||console.log("dc");
function Sa(){function a(a){a=a||"[DEFAULT]";var b=d[a];void 0===b&&Z("noApp",{name:a});return b}function b(a,b){Object.keys(e).forEach(function(d){d=c(a,d);if(null!==d&&f[d])f[d](b,a)})}function c(a,b){if("serverAuth"===b)return null;var c=b;a=a.options;"auth"===b&&(a.serviceAccount||a.credential)&&(c="serverAuth","serverAuth"in e||Z("serverAuthMissing"));return c}var d={},e={},f={},g={__esModule:!0,initializeApp:function(a,c){void 0===c?c="[DEFAULT]":"string"===typeof c&&""!==c||Z("bad-app-name",
{name:c+""});void 0!==d[c]&&Z("dupApp",{name:c});a=new X(a,c,g);d[c]=a;b(a,"create");void 0!=a.INTERNAL&&void 0!=a.INTERNAL.getToken||R(a,{INTERNAL:{getToken:function(){return W.resolve(null)},addAuthTokenListener:function(){},removeAuthTokenListener:function(){}}});return a},app:a,apps:null,Promise:W,SDK_VERSION:"0.0.0",INTERNAL:{registerService:function(b,c,d,v){e[b]&&Z("dupService",{name:b});e[b]=c;v&&(f[b]=v);c=function(c){void 0===c&&(c=a());return c[b]()};void 0!==d&&R(c,d);return g[b]=c},createFirebaseNamespace:Sa,
extendNamespace:function(a){R(g,a)},createSubscribe:La,ErrorFactory:Qa,removeApp:function(a){b(d[a],"delete");delete d[a]},factories:e,useAsService:c,Promise:Q,deepExtend:R}};g["default"]=g;Object.defineProperty(g,"apps",{get:function(){return Object.keys(d).map(function(a){return d[a]})}});a.App=X;return g}function Z(a,b){throw Error(Ra(a,b));}
function Ra(a,b){b=b||{};b={noApp:"No Firebase App '"+b.name+"' has been created - call Firebase App.initializeApp().","bad-app-name":"Illegal App name: '"+b.name+"'.",dupApp:"Firebase App named '"+b.name+"' already exists.",deleted:"Firebase App named '"+b.name+"' already deleted.",dupService:"Firebase Service named '"+b.name+"' already registered.",serverAuthMissing:"Initializing the Firebase SDK with a service account is only allowed in a Node.js environment. On client devices, you should instead initialize the SDK with an api key and auth domain."}[a];
return void 0===b?"Application Error: ("+a+")":b};"undefined"!==typeof firebase&&(firebase=Sa()); })();
firebase.SDK_VERSION = "3.5.0";

(function() {var f=function(a,b){function d(){}d.prototype=b.prototype;a.prototype=new d;for(var c in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,c);e&&Object.defineProperty(a,c,e)}else a[c]=b[c]},g="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=d.value)},k="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&
null!=global?global:this,l=function(a,b){if(b){var d=k;a=a.split(".");for(var c=0;c<a.length-1;c++){var e=a[c];e in d||(d[e]={});d=d[e]}a=a[a.length-1];c=d[a];b=b(c);b!=c&&null!=b&&g(d,a,{configurable:!0,writable:!0,value:b})}},n=function(){n=function(){};k.Symbol||(k.Symbol=q)},t=0,q=function(a){return"jscomp_symbol_"+(a||"")+t++},v=function(){n();var a=k.Symbol.iterator;a||(a=k.Symbol.iterator=k.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&g(Array.prototype,a,{configurable:!0,writable:!0,
value:function(){return u(this)}});v=function(){}},u=function(a){var b=0;return w(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})},w=function(a){v();a={next:a};a[k.Symbol.iterator]=function(){return this};return a},x=function(a){v();var b=a[Symbol.iterator];return b?b.call(a):u(a)};
l("Promise",function(a){function b(){this.a=null}if(a)return a;b.prototype.b=function(a){null==this.a&&(this.a=[],this.f());this.a.push(a)};b.prototype.f=function(){var a=this;this.c(function(){a.h()})};var d=k.setTimeout;b.prototype.c=function(a){d(a,0)};b.prototype.h=function(){for(;this.a&&this.a.length;){var a=this.a;this.a=[];for(var b=0;b<a.length;++b){var c=a[b];delete a[b];try{c()}catch(r){this.g(r)}}}this.a=null};b.prototype.g=function(a){this.c(function(){throw a;})};var c=function(a){this.b=
0;this.h=void 0;this.a=[];var b=this.f();try{a(b.resolve,b.reject)}catch(p){b.reject(p)}};c.prototype.f=function(){function a(a){return function(d){c||(c=!0,a.call(b,d))}}var b=this,c=!1;return{resolve:a(this.aa),reject:a(this.g)}};c.prototype.aa=function(a){if(a===this)this.g(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof c)this.ba(a);else{var b;a:switch(typeof a){case "object":b=null!=a;break a;case "function":b=!0;break a;default:b=!1}b?this.$(a):this.m(a)}};c.prototype.$=
function(a){var b=void 0;try{b=a.then}catch(p){this.g(p);return}"function"==typeof b?this.ca(b,a):this.m(a)};c.prototype.g=function(a){this.o(2,a)};c.prototype.m=function(a){this.o(1,a)};c.prototype.o=function(a,b){if(0!=this.b)throw Error("Cannot settle("+a+", "+b|"): Promise already settled in state"+this.b);this.b=a;this.h=b;this.v()};c.prototype.v=function(){if(null!=this.a){for(var a=this.a,b=0;b<a.length;++b)a[b].call(),a[b]=null;this.a=null}};var e=new b;c.prototype.ba=function(a){var b=this.f();
a.c(b.resolve,b.reject)};c.prototype.ca=function(a,b){var c=this.f();try{a.call(b,c.resolve,c.reject)}catch(r){c.reject(r)}};c.prototype.then=function(a,b){function d(a,b){return"function"==typeof a?function(b){try{e(a(b))}catch(V){h(V)}}:b}var e,h,m=new c(function(a,b){e=a;h=b});this.c(d(a,e),d(b,h));return m};c.prototype.catch=function(a){return this.then(void 0,a)};c.prototype.c=function(a,b){function c(){switch(d.b){case 1:a(d.h);break;case 2:b(d.h);break;default:throw Error("Unexpected state: "+
d.b);}}var d=this;null==this.a?e.b(c):this.a.push(function(){e.b(c)})};c.resolve=function(a){return a instanceof c?a:new c(function(b){b(a)})};c.reject=function(a){return new c(function(b,c){c(a)})};c.b=function(a){return new c(function(b,d){for(var e=x(a),h=e.next();!h.done;h=e.next())c.resolve(h.value).c(b,d)})};c.a=function(a){var b=x(a),d=b.next();return d.done?c.resolve([]):new c(function(a,e){function h(b){return function(c){m[b]=c;p--;0==p&&a(m)}}var m=[],p=0;do m.push(void 0),p++,c.resolve(d.value).c(h(m.length-
1),e),d=b.next();while(!d.done)})};c.$jscomp$new$AsyncExecutor=function(){return new b};return c});l("Array.prototype.findIndex",function(a){return a?a:function(a,d){a:{var b=this;b instanceof String&&(b=String(b));for(var e=b.length,h=0;h<e;h++)if(a.call(d,b[h],h,b)){a=h;break a}a=-1}return a}});l("Object.assign",function(a){return a?a:function(a,d){for(var b=1;b<arguments.length;b++){var e=arguments[b];if(e)for(var h in e)Object.prototype.hasOwnProperty.call(e,h)&&(a[h]=e[h])}return a}});
var y=this,z=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var d=Object.prototype.toString.call(a);if("[object Window]"==d)return"object";if("[object Array]"==d||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==d||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},A=function(a,b){function d(){}d.prototype=b.prototype;a.ha=b.prototype;a.prototype=new d;a.da=function(a,d,h){for(var c=Array(arguments.length-2),e=2;e<arguments.length;e++)c[e-2]=arguments[e];return b.prototype[d].apply(a,c)}};var B={i:"only-available-in-window",w:"only-available-in-sw",R:"should-be-overriden",j:"bad-sender-id",O:"permission-default",N:"permission-blocked",W:"unsupported-browser",J:"notifications-blocked",D:"failed-serviceworker-registration",l:"sw-registration-expected",G:"get-subscription-failed",I:"invalid-saved-token",s:"sw-reg-redundant",S:"token-subscribe-failed",U:"token-subscribe-no-token",T:"token-subscribe-no-push-set",X:"use-sw-before-get-token",H:"invalid-delete-token",C:"delete-token-not-found",
A:"bg-handler-function-expected",M:"no-window-client-to-msg",V:"unable-to-resubscribe",L:"no-fcm-token-for-resubscribe",F:"failed-to-delete-token"},C={},D=(C[B.i]="This method is available in a Window context.",C[B.w]="This method is available in a service worker context.",C[B.R]="This method should be overriden by extended classes.",C[B.j]="Please ensure that 'messagingSenderId' is set correctly in the options passed into firebase.initializeApp().",C[B.O]="The required permissions were not granted and dismissed instead.",
C[B.N]="The required permissions were not granted and blocked instead.",C[B.W]="This browser doesn't support the API's required to use the firebase SDK.",C[B.J]="Notifications have been blocked.",C[B.D]="We are unable to register the default service worker. {$browserErrorMessage}",C[B.l]="A service worker registration was the expected input.",C[B.G]="There was an error when trying to get any existing Push Subscriptions.",C[B.I]="Unable to access details of the saved token.",C[B.s]="The service worker being used for push was made redundant.",
C[B.S]="A problem occured while subscribing the user to FCM: {$message}",C[B.U]="FCM returned no token when subscribing the user to push.",C[B.T]="FCM returned an invalid response when getting an FCM token.",C[B.X]="You must call useServiceWorker() before calling getToken() to ensure your service worker is used.",C[B.H]="You must pass a valid token into deleteToken(), i.e. the token from getToken().",C[B.C]="The deletion attempt for token could not be performed as the token was not found.",C[B.A]=
"The input to setBackgroundMessageHandler() must be a function.",C[B.M]="An attempt was made to message a non-existant window client.",C[B.V]="There was an error while re-subscribing the FCM token for push messaging. Will have to resubscribe the user on next visit. {$message}",C[B.L]="Could not find an FCM token and as a result, unable to resubscribe. Will have to resubscribe the user on next visit.",C[B.F]="Unable to delete the currently saved token.",C);var E={userVisibleOnly:!0,applicationServerKey:new Uint8Array([4,51,148,247,223,161,235,177,220,3,162,94,21,113,219,72,211,46,237,237,178,52,219,183,71,58,12,143,196,204,225,111,60,140,132,223,171,182,102,62,242,12,212,139,254,227,249,118,47,20,28,99,8,106,111,45,177,26,149,176,206,55,192,156,110])};var F={u:"firebase-messaging-msg-type",B:"firebase-messaging-msg-data"},G={P:"push-msg-received",K:"notification-clicked"},H=function(a,b){var d={};return d[F.u]=a,d[F.B]=b,d};var I=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,I);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};A(I,Error);var J=function(a,b){for(var d=a.split("%s"),c="",e=Array.prototype.slice.call(arguments,1);e.length&&1<d.length;)c+=d.shift()+e.shift();return c+d.join("%s")};var K=function(a,b){b.unshift(a);I.call(this,J.apply(null,b));b.shift()};A(K,I);var L=function(a,b,d){if(!a){var c="Assertion failed";if(b)var c=c+(": "+b),e=Array.prototype.slice.call(arguments,2);throw new K(""+c,e||[]);}};var M=null;var N=function(a){a=new Uint8Array(a);var b=z(a);L("array"==b||"object"==b&&"number"==typeof a.length,"encodeByteArray takes an array as a parameter");if(!M)for(M={},b=0;65>b;b++)M[b]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b);for(var b=M,d=[],c=0;c<a.length;c+=3){var e=a[c],h=c+1<a.length,m=h?a[c+1]:0,p=c+2<a.length,r=p?a[c+2]:0,U=e>>2,e=(e&3)<<4|m>>4,m=(m&15)<<2|r>>6,r=r&63;p||(r=64,h||(m=64));d.push(b[U],b[e],b[m],b[r])}return d.join("").replace(/\+/g,"-").replace(/\//g,
"_").replace(/=+$/,"")};var O=new firebase.INTERNAL.ErrorFactory("messaging","Messaging",D),P=function(){this.a=null},Q=function(a){if(a.a)return a.a;a.a=new Promise(function(a,d){var b=y.indexedDB.open("fcm_token_details_db",1);b.onerror=function(a){d(a.target.error)};b.onsuccess=function(b){a(b.target.result)};b.onupgradeneeded=function(a){a=a.target.result.createObjectStore("fcm_token_object_Store",{keyPath:"swScope"});a.createIndex("fcmSenderId","fcmSenderId",{unique:!1});a.createIndex("fcmToken","fcmToken",{unique:!0})}});
return a.a},aa=function(a){a.a?a.a.then(function(b){b.close();a.a=null}):Promise.resolve()},R=function(a,b){return Q(a).then(function(a){return new Promise(function(d,e){var c=a.transaction(["fcm_token_object_Store"]).objectStore("fcm_token_object_Store").index("fcmToken").get(b);c.onerror=function(a){e(a.target.error)};c.onsuccess=function(a){d(a.target.result)}})})},ba=function(a,b){return Q(a).then(function(a){return new Promise(function(d,e){var c=[],m=a.transaction(["fcm_token_object_Store"]).objectStore("fcm_token_object_Store").openCursor();
m.onerror=function(a){e(a.target.error)};m.onsuccess=function(a){(a=a.target.result)?(a.value.fcmSenderId===b&&c.push(a.value),a.continue()):d(c)}})})},ca=function(a){var b=a.installing||a.waiting||a.active;return new Promise(function(d,c){if("activated"===b.state)d(a);else if("redundant"===b.state)c(O.create(B.s));else{var e=function(){if("activated"===b.state)d(a);else if("redundant"===b.state)c(O.create(B.s));else return;b.removeEventListener("statechange",e)};b.addEventListener("statechange",
e)}})},S=function(a,b,d){var c=N(b.getKey("p256dh")),e=N(b.getKey("auth"));a="authorized_entity="+a+"&"+("endpoint="+b.endpoint+"&")+("encryption_key="+c+"&")+("encryption_auth="+e);d&&(a+="&pushSet="+d);d=new Headers;d.append("Content-Type","application/x-www-form-urlencoded");return fetch("https://fcm.googleapis.com/fcm/connect/subscribe",{method:"POST",headers:d,body:a}).then(function(a){return a.json()}).then(function(a){if(a.error)throw O.create(B.S,{message:a.error.message});if(!a.token)throw O.create(B.U);
if(!a.pushSet)throw O.create(B.T);return{token:a.token,pushSet:a.pushSet}})},da=function(a,b,d,c,e,h){var m={swScope:d.scope,endpoint:c.endpoint,auth:N(c.getKey("auth")),p256dh:N(c.getKey("p256dh")),fcmToken:e,fcmPushSet:h,fcmSenderId:b};return Q(a).then(function(a){return new Promise(function(b,d){var c=a.transaction(["fcm_token_object_Store"],"readwrite").objectStore("fcm_token_object_Store").put(m);c.onerror=function(a){d(a.target.error)};c.onsuccess=function(){b()}})})};
P.prototype.Z=function(a,b){return b instanceof ServiceWorkerRegistration?"string"!==typeof a||0===a.length?Promise.reject(O.create(B.j)):ba(this,a).then(function(d){if(0!==d.length){var c=d.findIndex(function(d){return b.scope===d.swScope&&a===d.fcmSenderId});if(-1!==c)return d[c]}}).then(function(a){if(a)return b.pushManager.getSubscription().catch(function(){throw O.create(B.G);}).then(function(b){var d;if(d=b)d=b.endpoint===a.endpoint&&N(b.getKey("auth"))===a.auth&&N(b.getKey("p256dh"))===a.p256dh;
if(d)return a.fcmToken})}):Promise.reject(O.create(B.l))};P.prototype.getSavedToken=P.prototype.Z;P.prototype.Y=function(a,b){var d=this;return"string"!==typeof a||0===a.length?Promise.reject(O.create(B.j)):b instanceof ServiceWorkerRegistration?ca(b).then(function(){return b.pushManager.getSubscription()}).then(function(a){return a?a:b.pushManager.subscribe(E)}).then(function(c){return S(a,c).then(function(e){return da(d,a,b,c,e.token,e.pushSet).then(function(){return e.token})})}):Promise.reject(O.create(B.l))};
P.prototype.createToken=P.prototype.Y;P.prototype.deleteToken=function(a){var b=this;return"string"!==typeof a||0===a.length?Promise.reject(O.create(B.H)):R(this,a).then(function(a){if(!a)throw O.create(B.C);return Q(b).then(function(b){return new Promise(function(d,c){var e=b.transaction(["fcm_token_object_Store"],"readwrite").objectStore("fcm_token_object_Store").delete(a.swScope);e.onerror=function(a){c(a.target.error)};e.onsuccess=function(b){0===b.target.result?c(O.create(B.F)):d(a)}})})})};var T=function(a){var b=this;this.a=new firebase.INTERNAL.ErrorFactory("messaging","Messaging",D);if(!a.options.messagingSenderId||"string"!==typeof a.options.messagingSenderId)throw this.a.create(B.j);this.h=a.options.messagingSenderId;this.c=new P;this.app=a;this.INTERNAL={};this.INTERNAL.delete=function(){return b.delete}};
T.prototype.getToken=function(){var a=this,b=Notification.permission;return"granted"!==b?"denied"===b?Promise.reject(this.a.create(B.J)):Promise.resolve(null):this.f().then(function(b){return a.c.Z(a.h,b).then(function(d){return d?d:a.c.Y(a.h,b)})})};T.prototype.getToken=T.prototype.getToken;T.prototype.deleteToken=function(a){var b=this;return this.c.deleteToken(a).then(function(){return b.f()}).then(function(a){return a?a.pushManager.getSubscription():null}).then(function(a){if(a)return a.unsubscribe()})};
T.prototype.deleteToken=T.prototype.deleteToken;T.prototype.f=function(){throw this.a.create(B.R);};T.prototype.requestPermission=function(){throw this.a.create(B.i);};T.prototype.useServiceWorker=function(){throw this.a.create(B.i);};T.prototype.useServiceWorker=T.prototype.useServiceWorker;T.prototype.onMessage=function(){throw this.a.create(B.i);};T.prototype.onMessage=T.prototype.onMessage;T.prototype.onTokenRefresh=function(){throw this.a.create(B.i);};T.prototype.onTokenRefresh=T.prototype.onTokenRefresh;
T.prototype.setBackgroundMessageHandler=function(){throw this.a.create(B.w);};T.prototype.setBackgroundMessageHandler=T.prototype.setBackgroundMessageHandler;T.prototype.delete=function(){aa(this.c)};



var W=self,X=function(a){var b=this;T.call(this,a);this.a=new firebase.INTERNAL.ErrorFactory("messaging","Messaging",D);W.addEventListener("push",function(a){return ea(b,a)},!1);W.addEventListener("pushsubscriptionchange",function(a){return fa(b,a)},!1);



W.addEventListener("notificationclick",function(a){return ga(b,a)},!1);this.b=null};f(X,T);



var ea=function(a,b){var d;try{d=b.data.json()}catch(e){return}var c=ha().then(function(b){if(b){if(d.notification||a.b)return ia(a,d)}else{if((b=d)&&"object"===typeof b.notification){var c=Object.assign({},b.notification),e={};c.data=(e.FCM_MSG=b,e);b=c}else b=void 0;if(b)return W.registration.showNotification(b.title||"",b);if(a.b)return a.b(d)}});b.waitUntil(c)},fa=function(a,b){var d=a.getToken().then(function(b){if(!b)throw a.a.create(B.L);var d=a.c;return R(d,b).then(function(b){if(!b)throw a.a.create(B.I);
return W.registration.pushManager.subscribe(E).then(function(a){return S(b.fa,a,b.ea)}).catch(function(c){return d.deleteToken(b.ga).then(function(){throw a.a.create(B.V,{message:c});})})})});b.waitUntil(d)},ga=function(a,b){if(b.notification&&b.notification.data&&b.notification.data.FCM_MSG){b.stopImmediatePropagation();b.notification.close();var d=b.notification.data.FCM_MSG,c=d.notification.click_action;if(c){var e=ja(c).then(function(a){return a?a:W.clients.openWindow(c)}).then(function(b){if(b)return delete d.notification,
Y(a,b,H(G.K,d))});b.waitUntil(e)}}};X.prototype.setBackgroundMessageHandler=function(a){if(a&&"function"!==typeof a)throw this.a.create(B.A);this.b=a};X.prototype.setBackgroundMessageHandler=X.prototype.setBackgroundMessageHandler;
var ja=function(a){var b=(new URL(a)).href;return W.clients.matchAll({type:"window",includeUncontrolled:!0}).then(function(a){for(var c=null,d=0;d<a.length;d++)if((new URL(a[d].url)).href===b){c=a[d];break}if(c)return c.focus(),c})},Y=function(a,b,d){return new Promise(function(c,e){if(!b)return e(a.a.create(B.M));b.postMessage(d);c()})},ha=function(){return W.clients.matchAll({type:"window",includeUncontrolled:!0}).then(function(a){return a.some(function(a){return"visible"===a.visibilityState})})},
ia=function(a,b){return W.clients.matchAll({type:"window",includeUncontrolled:!0}).then(function(d){var c=H(G.P,b);return Promise.all(d.map(function(b){return Y(a,b,c)}))})};X.prototype.f=function(){return Promise.resolve(W.registration)};var Z=function(a){var b=this;T.call(this,a);this.g=null;this.m=firebase.INTERNAL.createSubscribe(function(a){b.g=a});this.v=null;this.o=firebase.INTERNAL.createSubscribe(function(a){b.v=a});ka(this)};f(Z,T);Z.prototype.getToken=function(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")?T.prototype.getToken.call(this):Promise.reject(this.a.create(B.W))};
Z.prototype.getToken=Z.prototype.getToken;Z.prototype.requestPermission=function(){var a=this;return"granted"===Notification.permission?Promise.resolve():new Promise(function(b,d){var c=function(c){return"granted"===c?b():"denied"===c?d(a.a.create(B.N)):d(a.a.create(B.O))},e=Notification.requestPermission(function(a){e||c(a)});e&&e.then(c)})};Z.prototype.requestPermission=Z.prototype.requestPermission;
Z.prototype.useServiceWorker=function(a){if(!(a instanceof ServiceWorkerRegistration))throw this.a.create(B.l);if("undefined"!==typeof this.b)throw this.a.create(B.X);this.b=a};Z.prototype.useServiceWorker=Z.prototype.useServiceWorker;Z.prototype.onMessage=function(a,b,d){return this.m(a,b,d)};Z.prototype.onMessage=Z.prototype.onMessage;Z.prototype.onTokenRefresh=function(a,b,d){return this.o(a,b,d)};Z.prototype.onTokenRefresh=Z.prototype.onTokenRefresh;
Z.prototype.f=function(){var a=this;if(this.b)return Promise.resolve(this.b);this.b=null;return navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/firebase-cloud-messaging-push-scope"}).then(function(b){a.b=b;b.update();return b}).catch(function(b){throw a.a.create(B.D,{browserErrorMessage:b.message});})};
var ka=function(a){"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",function(b){if(b.data&&b.data[F.u])switch(b=b.data,b[F.u]){case G.P:case G.K:a.g.next(b[F.B])}},!1)};if(!(firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService))throw Error("Cannot install Firebase Messaging - be sure to load firebase-app.js first.");firebase.INTERNAL.registerService("messaging",function(a){return self&&"ServiceWorkerGlobalScope"in self?new X(a):new Z(a)},{Messaging:Z});})();

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '790411914550'
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
var messaging = firebase.messaging();

// If you would like to customize notifications that are received in the background (Web app is closed or not in browser focus) then you should implement this optional method
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.'

  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
