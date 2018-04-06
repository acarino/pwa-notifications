
//service worker for pwa app

importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

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

  return self.clients.claim();
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


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://pwa-notification-poc-ac.firebaseapp.com/';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
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
     *  falling back to the network offline strategy:
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

// Handle Background Notifications

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '790411914550'
});

function setListener(){
   clients.matchAll({includeUncontrolled: true, type: 'window'})
  .then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      console.log("in setListener client length: "+clientList.length);
      client.addEventListener('message', function(messageEvent) {
      console.log('in setListener got event in sw:', messageEvent);
      });
    }
  })
}

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
