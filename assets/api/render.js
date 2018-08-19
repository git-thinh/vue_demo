importScripts('../config.js');
importScripts('../lib/underscore.min.js');

var f_log = 1 ? console.log.bind(console, '<# RENDER: ') : function () { };

self.addEventListener("message", e => {
    if (e.data === "start") {
        importScripts("../via/via.js");
        Via.postMessage = (data => self.postMessage(data));

        f_render_Pages(function (coms) {
            f_render_Parts(function () {
                f_send_broadCast_toMainUI({ KEY: API_FLAG.PARTS_STATE_READY, DATA: coms });
            });
        });
    }
    else {
        Via.OnMessage(e.data);
    }
});

var BROADCAST_API;
if ('BroadcastChannel' in self) {
    BROADCAST_API = new BroadcastChannel('BROADCAST_API');
    BROADCAST_API.addEventListener("message", (e) => f_message_broadcastChannelReceiver(e.data), false);
}

function f_message_broadcastChannelReceiver(msg) {
    var type = typeof msg;
    if (type == 'string') {
    } else {
        if (msg.TO != '*' && msg.TO != 'RENDER') return;
        //console.log('<# RENDER.RECEIVER: ', msg);

        var key = msg.KEY;
        switch (key) {
        }
    }
}

function f_send_broadCast_toMainUI(msg) {
    var mainUI = self.location.hash.split('?')[0];
    if (BROADCAST_API != null) {
        msg.FOR = mainUI;
        msg.TO = 'UI';
        BROADCAST_API.postMessage(msg);
    }
}


/////////////////////////////////////////////////////////////////////////////

function f_render_Pages(f_callback) {
    fetch(API_CF.PAGE_LIST).then(res=>res.json()).then(cats => {
        f_log(' CATS == ', cats);
        const document = via.document;

        var re_pages = cats.map(id => { return fetch(API_CF.PAGE_LIST + '\\' + id).then(res => res.json()); });
        Promise.all(re_pages).then(pages => {
            pages = pages.map(function (it, index) { return it.map(function (sid) { return cats[index] + '/' + sid; }); });
            pages = _.reduceRight(pages, function (a, b) { return a.concat(b); }, []);

            var screens = pages.map(function (it, index) { return { path: '/' + it, componentName: 'com_' + it.split('/').join('_'), template: '' }; });
            f_log(' PAGES == ', screens);
            
            var rhs = pages.map(id => { return fetch('/assets/pages/' + id + '/temp.html').then(res => res.text()); });
            Promise.all(rhs).then(htmls=> {
                htmls.forEach(function (s, index) {
                    ////var id = pages[index].split('/').join('_');
                    //////s = s.split('___ScreenID').join(id);
                    //////f_log(id, s);
                    ////var el = document.createElement('script');
                    ////el.id = 'Screen_' + id + '_Template';
                    ////el.type = 'text/x-template';
                    ////el.innerHTML = s;
                    ////document.body.appendChild(el);
                    screens[index].template = s;
                });

                var rjs = pages.map(id => { return fetch('/assets/pages/' + id + '/js.js').then(res => res.text()); });
                Promise.all(rjs).then(jss=> {
                    jss.forEach(function (s, index) {
                        //var id = pages[index].split('/').join('_');
                        //s = s.split('___ScreenID').join(id);
                        ////f_log(id, s);
                        //var el = document.createElement('script');
                        //el.id = 'Screen_' + id + '_JS';
                        //el.type = 'text/javascript';
                        //el.innerHTML = s;
                        //document.body.appendChild(el);
                    });

                    //var coms = pages.map(id => { return 'com_' + id.split('/').join('_'); });
                    if (f_callback != null) f_callback(screens);
                });
            });
        });
    });
}

function f_render_Parts(f_callback) {

    fetch(API_CF.APP_SETTING).then(r=>r.json()).then(jo => {
        var aParts = _.map(jo, function (value, key) { return value; });
        aParts = _.reduceRight(aParts, function (a, b) { return a.concat(b); }, []);

        f_log('PARTS === ', aParts);

        var rhs = aParts.map(id => { return fetch('/assets/parts/' + id + '/temp.html').then(res => res.text()); });

        const document = via.document;

        Promise.all(rhs).then(htmls => {
            //f_log('TEMP', htmls);
            htmls.forEach(function (s, index) {
                var id = aParts[index];
                //f_log(id, s);

                s = s.split('<!DOCTYPE html>').join('')
                    .split('<html>').join('<div id="' + id + '" class=ui-component>').split('</html>').join('</div>')
                    .split('<head>').join('<header style="display:none">').split('</head>').join('</header>')
                    .split('<body').join('<aside class="ui-component-body ' + id + '"').split('</body>').join('</aside>');

                var el = document.createElement('script');
                el.id = id + '-template';
                el.type = 'text/x-template';
                el.innerHTML = s;
                document.body.appendChild(el);
            });

            var rjs = aParts.map(id => { return fetch('/assets/parts/' + id + '/js.js').then(res => res.text()); });
            Promise.all(rjs).then(jss => {
                //f_log('JS', jss);
                jss.forEach(function (js, index2) {
                    var id = aParts[index2];
                    //f_log(id, js);
                    var el = document.createElement('script');
                    el.id = id + '-script';
                    el.type = 'text/javascript';
                    el.innerHTML = js;
                    document.body.appendChild(el);
                });

                if (f_callback != null) f_callback();

            });
        });



        //const d = via.document;
        //aParts.forEach(function (id) {
        //    fetch('/assets/parts/' + id + '/temp.html').then(res => res.text()).then(s => {
        //        s = s.split('<!DOCTYPE html>').join('')
        //            .split('<html>').join('<div id="' + id + '" class=fixwidget>').split('</html>').join('</div>')
        //            .split('<head>').join('<header class=wi_lib>').split('</head>').join('</header>')
        //            .split('<body ').join('<aside class="wi_body ' + id + '" ').split('</body>').join('</aside>');

        //        //console.log(s);

        //        var el = d.createElement('script');
        //        el.id = 'temp_' + id;
        //        el.type = 'text/x-template';
        //        el.innerHTML = s;

        //        d.body.appendChild(el);
        //    });
        //});
    });


}



////async function Start() {
////    const document = via.document;

////    // Demo of retrieving DOM property values
////    const [docTitle, docUrl] = await Promise.all([
////        get(document.title),
////        get(document.URL)
////    ]);

////    console.log("Document title is: " + docTitle + ", URL is: " + docUrl);

////    const h1 = document.createElement("h1");
////    h1.textContent = "Via.js demo";
////    document.body.appendChild(h1);


////    const p = document.createElement("p");
////    p.textContent = "This page's contents and logic, including this text, was created by a Web Worker using APIs almost identical to the usual DOM APIs. To demonstrate the flexibility of the approach, the button below uses the Web Audio API to load and play a sound effect when clicked. The entire process, from creating the button, attaching an event handler, running the callback, creating an AudioContext, decoding the audio, creating audio buffers and nodes, and starting playback of the sound, is controlled entirely by the worker.";
////    document.body.appendChild(p);

////    const button = document.createElement("button");
////    button.textContent = "Click me";
////    button.style.fontWeight = "bold";
////    button.addEventListener("click", OnClick);
////    document.body.appendChild(button);

////    const des_clone = button.cloneNode(true);
////    des_clone.textContent = "9999999Click me";
////    document.body.appendChild(des_clone);

////    //via.audioContext = new via.AudioContext();

////    //const response = await fetch("sfx5.m4a");
////    //const arrayBuffer = await response.arrayBuffer();

////    //via.audioContext.decodeAudioData(arrayBuffer, audioBuffer =>
////    //{
////    //	self.audioBuffer = audioBuffer;
////    //});
////}

////async function OnClick(e) {
////    const [x, y] = await Promise.all([
////        get(e.clientX),
////        get(e.clientY)
////    ]);

////    console.log("[Worker] Click event at " + x + ", " + y);

////    //const source = via.audioContext.createBufferSource();
////    //source.buffer = self.audioBuffer;
////    //source.connect(via.audioContext.destination);
////    //source.start(0);
////}
