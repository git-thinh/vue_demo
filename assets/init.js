if (navigator.serviceWorker) {
    if (navigator.serviceWorker.controller) {
        let worker = new Worker("./assets/api/render.js");
        worker.onmessage = (e => { Via.OnMessage(e.data); });
        Via.postMessage = (data => worker.postMessage(data));
        worker.postMessage("start");
    } else {
        navigator.serviceWorker.register('api.js', { scope: './' }).then(function (reg) {
            location.reload();
        });
    }
}

/***************************************/

var BROADCAST_API;
if ('BroadcastChannel' in window) {
    BROADCAST_API = new BroadcastChannel('BROADCAST_API');
    BROADCAST_API.addEventListener("message", (e) => f_message_broadcastChannelReceiver(e.data), false);
}

var BROADCAST_VUE;
document.addEventListener("DOMContentLoaded", function () {
    var _divBroadCast = document.createElement('div');
    _divBroadCast.id = 'broadcast-xxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    document.body.appendChild(_divBroadCast);

    BROADCAST_VUE = new Vue({
        el: '#' + _divBroadCast.id,
        methods: {
            f_sendMessage_toMainUI: function (data) {
                var mainUI = location.hash.split('?')[0];
                this.$emit(mainUI, data);
            },
            f_sendMessage_toAll: function (data) {
                this.$emit('*', data);
            },
            f_sendMessage_toSender: function (channelSender, data) {
                this.$emit(channelSender, data);
            },
        }
    });
});

/***************************************/

function f_broadcast_comVUE_joinMainUI(f_callback) {
    var mainUI = location.hash.split('?')[0];
    BROADCAST_VUE.$on(mainUI, f_callback);
}

function f_broadcast_comVUE_joinAll(f_callback) {
    BROADCAST_VUE.$on('*', f_callback);
}

function f_broadcast_comVUE_joinSender(f_callback, _self) {
    if (_self.broadcastChannel != null)
        BROADCAST_VUE.$on(_self.broadcastChannel, f_callback);
}

function f_broadcast_comVUE_msgReceiver(_self, msg, f_callback) {
    console.log('VUE_COMPONENTS.' + _self.broadcastChannel + ' = ', msg);
    if (msg != null) {
        if (msg.CALL != null) {
            if (_self[msg.CALL] != null) _self[msg.CALL](msg);
            return;
        }
    }

    f_callback(msg);
}

function f_message_broadcastChannelReceiver(msg) {
    if (msg.TO != '*' && msg.TO != 'UI') return;
    console.log('<= UI: RECEIVER <- WORKER: ', msg);

    var mainUI = location.hash.split('?')[0];
    var key = msg.KEY, _for = msg.FOR, data = msg.DATA;
    switch (key) {
        case API_FLAG.PARTS_STATE_READY:
            f_runApp();
            break;
        default:
            switch (_for) {
                case '*':
                    BROADCAST_VUE.f_sendMessage_toAll(msg);
                    break;
                case mainUI:
                    BROADCAST_VUE.f_sendMessage_toMainUI(msg);
                    break;
                default:
                    BROADCAST_VUE.f_sendMessage_toSender(_for, msg);
                    break;
            }
            break;
    }
}

function f_sendMessageToAPI(msg) {
    //console.log('HOMEUI: SEND -> WORKER: ', msg);
    BROADCAST_API.postMessage(msg);
}

function f_fetchApi(pathApi, f_callback) {
    if (typeof pathApi == 'string') {
        var url = pathApi + ((/\?/).test(pathApi) ? "&_=" : "?_=") + (new Date()).getTime();
        fetch(url).then(res => res.text()).then(json => { f_callback(json); });
    } else {
        Promise.all(pathApi.map(key => {
            var uri = key + ((/\?/).test(pathApi) ? "&_=" : "?_=") + (new Date()).getTime();
            return fetch(uri).then(resp => resp.json());
        })).then(vals => {
            var rs = {};
            pathApi.forEach((key, index) => rs[key] = vals[index]);
            f_callback(rs);
        });
    }
}
