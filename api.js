importScripts('assets/config.js');
importScripts('assets/lib/underscore.min.js');

var _LOG = '<= API: ';

self.addEventListener('fetch', function (event) {
    var url = event.request.url;
    var uri = url.toString().split('?')[0].split('#')[0];
    var a = uri.split('/');
    var path = uri.substr(a[0].length + 2 + a[2].length);
    var noCache = url.indexOf('cache=no') == -1;

    if (path.indexOf('/api/') != -1) {
        if (path.indexOf('/api/data/') != -1) {
            f_api_data(event, url, path, noCache);
        }
        else {
            f_api_router(event, url, path, noCache);
        }
    }
    else {
        event.respondWith(fetch(event.request));
    }
});

var BROADCAST_API;
if ('BroadcastChannel' in self) {
    BROADCAST_API = new BroadcastChannel('BROADCAST_API');
    BROADCAST_API.addEventListener("message", (e) => f_message_broadcastChannelReceiver(e.data), false);
}

/***************************************************************/

function f_message_broadcastChannelReceiver(msg) {
    if (msg.TO != '*' && msg.TO != 'API') return;
    console.log('<= UI: RECEIVER <- WORKER: ', msg);

    var key = msg.KEY, data = msg.DATA;
    switch (key) {
    }
}

function f_getQueryString(url, name) {
    if (!url) url = self.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function f_send_broadCast_toMainUI(msg) {
    var mainUI = self.location.hash.split('?')[0];
    if (BROADCAST_API != null) {
        msg.FOR = mainUI;
        msg.TO = 'UI';
        BROADCAST_API.postMessage(msg);
    }
}

function f_send_broadCast_toRender(msg) {
    if (BROADCAST_API != null) {
        msg.TO = 'RENDER';
        BROADCAST_API.postMessage(msg);
    }
}

/***************************************************************/

function f_api_router(event, url, path, noCache) {
    switch (path) {
        case '/api/test':
            f_api_test(event, url, path, noCache);
            break;
        default:
            event.respondWith(fetch(event.request));
            break;
    }
}

function f_api_test(event, url, path, noCache) {
    var res = JSON.stringify({ time: new Date().toString() });
    console.log(_LOG + ' FETCH = ' + url + ' ==> ' + path, res);
    event.respondWith(Promise.resolve(new Response(res, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })));
}

function f_api_data(event, url, path, noCache) {
    var _url = url.split('?')[0].split('/api/').join('/assets/');
    _url = _url + ".json" + ((/\?/).test(url) ? url.split('?')[1] : '');

    //console.log(_LOG + ' DATA -> ' + _url);
    event.respondWith(fetch(_url).then(r => r.json()).then(jo => {
        //console.log(_LOG + ' DATA -> ' + _url, jo);
        return new Response(JSON.stringify(jo), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    }));
}


function f_response_api_sync_by_interface(event, url, path, noCache) {
    /*

                var fs = JSON.stringify(
                {
                    'key': 123,
                    'list': widgetAppInfolist,
                    'time': { time: new Date() }
                });

                fetch('/hui/api/sync_by_interface',  {
                    method: 'POST', 
                    body: fs,
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }).then(r => r.json()).then(jo => {
                    console.log('FormData === ', jo);
                });    
    */

    //event.request.arrayBuffer()
    //event.request.blob()
    //event.request.json()
    //event.request.text()
    //event.request.formData()

    event.respondWith(Promise.resolve(event.request.json().then(jo => {
        console.log(jo);

        var res = JSON.stringify(jo);

        return new Response(res, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    })));
}

function f_response_v1_users_tokenpas(event, url, path, noCache) {
    if (USER._TOKENPAS == null) {
        var _url = USER._HOST + path;
        event.respondWith(fetch(_url).then(r => r.text()).then(txt => {
            USER._TOKENPAS = txt;

            console.log(_LOG + ' -> USER._TOKENPAS = ', txt);

            var res = JSON.stringify(USER);
            return new Response(res, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
        }));
    }
    else {
        var res = JSON.stringify(USER);
        event.respondWith(Promise.resolve(new Response(res, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })));
    }
}