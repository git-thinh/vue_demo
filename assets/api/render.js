importScripts('config.js');
importScripts('../lib/underscore.min.js');

self.addEventListener("message", e => {
    if (e.data === "start") {
        importScripts("../via/via.js");
        Via.postMessage = (data => self.postMessage(data));
        Start(); 
        //f_render_widgetElements();
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

/////////////////////////////////////////////////////////////////////////////

function f_render_widgetElements() {

    //WIDGET_APP_INFO_LIST.forEach(function (wi, index) {
    //    const d = via.document;

    //    fetch('/js/data/widget/' + wi.url).then(res => res.text()).then(s => {
    //        s = s.split('<!DOCTYPE html>').join('')
    //            .split('<html>').join('<div id="' + wi.id + '" class=fixwidget>').split('</html>').join('</div>')
    //            .split('<head>').join('<header class=wi_lib>').split('</head>').join('</header>')
    //            .split('<body ').join('<aside class="wi_body ' + wi.id + '" ').split('</body>').join('</aside>');

    //        //console.log(s);

    //        var el = d.createElement('div');
    //        el.id = wi.id;
    //        el.className = "fix_widget" + index;
    //        el.innerHTML = s;

    //        //d.body.appendChild(el);

    //        WIDGETS_RENDER[wi.id] = el; 
    //    });
    //});

    //console.log('<# RENDER: render widgets complete ...');
}

async function Start() {
    const document = via.document;

    // Demo of retrieving DOM property values
    const [docTitle, docUrl] = await Promise.all([
        get(document.title),
        get(document.URL)
    ]);

    console.log("Document title is: " + docTitle + ", URL is: " + docUrl);

    const h1 = document.createElement("h1");
    h1.textContent = "Via.js demo";
    document.body.appendChild(h1);


    const p = document.createElement("p");
    p.textContent = "This page's contents and logic, including this text, was created by a Web Worker using APIs almost identical to the usual DOM APIs. To demonstrate the flexibility of the approach, the button below uses the Web Audio API to load and play a sound effect when clicked. The entire process, from creating the button, attaching an event handler, running the callback, creating an AudioContext, decoding the audio, creating audio buffers and nodes, and starting playback of the sound, is controlled entirely by the worker.";
    document.body.appendChild(p);

    const button = document.createElement("button");
    button.textContent = "Click me";
    button.style.fontWeight = "bold";
    button.addEventListener("click", OnClick);
    document.body.appendChild(button);

    const des_clone = button.cloneNode(true);
    des_clone.textContent = "9999999Click me";
    document.body.appendChild(des_clone);

    //via.audioContext = new via.AudioContext();

    //const response = await fetch("sfx5.m4a");
    //const arrayBuffer = await response.arrayBuffer();

    //via.audioContext.decodeAudioData(arrayBuffer, audioBuffer =>
    //{
    //	self.audioBuffer = audioBuffer;
    //});
}

async function OnClick(e) {
    const [x, y] = await Promise.all([
        get(e.clientX),
        get(e.clientY)
    ]);

    console.log("[Worker] Click event at " + x + ", " + y);

    //const source = via.audioContext.createBufferSource();
    //source.buffer = self.audioBuffer;
    //source.connect(via.audioContext.destination);
    //source.start(0);
}
