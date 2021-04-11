importScripts('/assets/js/idb.min.js');
importScripts('/assets/js/db.js');
importScripts('/assets/js/myApi.js');


var GOOGLE_FONT_URL = 'https://fonts.gstatic.com';
var CACHE_STATIC_NAME = 'pwanote-static_v3';
var CACHE_DYNAMIC_NAME = 'pwanote-dynamic_v3';
var STATIC_ASSETS = [
    '/',
    '/index.html',
    '/add.html',
    '/offline.html',
    '/favicon.ico',
    '/assets/js/main.js',
    '/assets/js/myApi.js',
    '/assets/js/helpers.js',
    '/assets/js/db.js',
    '/assets/js/libs/fetch.js',
    '/assets/js/libs/promise.js',
    '/assets/js/libs/material.min.js',
    '/assets/js/idb.min.js',
    '/assets/css/style.css',
    '/assets/css/libs/material.min.css',
    '/manifest.json',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
];


self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[SW] Precaching App Shell');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(function (e) {
                console.log('[SW] Precaching Error !', e);
            })
    );

});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        return caches.delete(key);
                    }
                }));
        }));
    return self.clients.claim();
});


function isIncluded(string, array) {
    var path;
    if (string.indexOf(self.origin) === 0) {
        path = string.substring(self.origin.length);
    } else {
        // for CDNs
        path = string;
    }
    //return array.indexOf(path) > -1;
    return array.includes(path) > -1;
}

var isGoogleFont = function (request) {
    return request.url.indexOf(GOOGLE_FONT_URL) === 0;
}

var cacheGFonts = function (request) {
    return fetch(request)
        .then(function (newRes) {
            caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                    cache.put(request, newRes);
                });
            return newRes.clone();
        });
};

self.addEventListener('fetch', function (event) {
   console.log('yessssssss');
        var request = event.request;
        console.log(request.url);
        // cacheOnly for statics assets
        if (isIncluded(request.url, STATIC_ASSETS)) {
            caches.match(request);
        }
        // Runtime or Dynamic cache for google fonts
        if (isGoogleFont(request)) {
    
                caches.match(request)
                    .then(function (res) {
                        return res || cacheGFonts(request);
                    })
          
        }
    
      
        if (request.url===SERVER_URL) {
            console.log('11111okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
            event.respondWith(
              
                fetch(request)
                    .then(function (res) {
                        console.log('okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
                        var clonedRes = res.clone();
                        db.clearAll()
                        .then(function () {
                            return clonedRes.json();
                        })
                        .then(function (data) {
                            for(var key in data)
                            {
                                data[key].id = key;
                                db.writeNote(data[key]);
                            }
                        });
                        return res;
                    })
            );
        }
       

 
   

});


self.addEventListener('sync', function (event) {
    console.log('[SW] Background Syncing',event);

    if(event.tag=== BACKGROUND_SYNC_SAVE)
    {
       event.waitUntil(
           db.readAllNote()
           .then(function (data) {
              data
              .filter(note => !note.synced)
              .map(note => {
                  sendData(note);
              }) ;
           })
       ); 
    }

});