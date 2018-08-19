
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
            f_runApp(data);
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

var app, router;
function f_runApp(screens) {

    //var routes = [
    //  //{ path: '/', component: PARTS[2].component, props: { code: 'sign-in', } },
    //  //{ path: '/index.html', component: PARTS[2].component, props: { code: 'sign-in', } },
    //  //{ path: '/login', component: PARTS[1].component },
    //  //{ path: '/about', component: PARTS[3].component },
    //  //{ path: '/dashboard', component: PARTS[2].component, meta: { requiresAuth: true } },
    //];
    //var link = '';
    //routes.push({ path: '/', component: com_dashboard_1001, props: { screen_content: screens[0].template } });
    //screens.forEach(function (src) {
    //    var vue = window[src.componentName];
    //    console.log(src.path, vue);
    //    routes.push({ path: src.path, component: vue, props: { screen_content: src.template } });
    //    link += '<router-link to="' + src.path + '">' + src.path + '</router-link> | ';
    //});

    ////router = new VueRouter({ routes });
    ////router.beforeEach((to, from, next) => {
    ////    //if (to.matched.some(record => record.meta.requiresAuth) && !Auth.loggedIn) {
    ////    //    next({ path: '/login', query: { redirect: to.fullPath } });
    ////    //} else {
    ////        next();
    ////    //}
    ////});

    //app = new Vue({
    //    router,
    //    template: '<div id="app"><p>' + link + '</p><router-view class="view"></router-view></div>',
    //    mounted: function () {
    //    }
    //}).$mount('#app');

    var _patrs = {
        subcomponent: {
            props: ['propA', 'propB', 'value'],
            template: '<DIV><h1>propA: {{ propA }} propB: {{ propB }}</h1><h3>PATH: /</h3></DIV>'
        }
    };

    var _tabs = ['subcomponent'];
    screens.forEach(function (src, index) {
        _tabs.push(src.componentName);

        _patrs[src.componentName] = {
            props: ['propA', 'propB', 'value'],
            template: '<DIV><h1>propA: {{ propA }} propB: {{ propB }}</h1><h3>PATH[' + index + ']: ' + src.path + '</h3>' + src.template + '</DIV>'
        };

        //Vue.component(src.componentName, {
        //    template: src.template,
        //    props: ['propA', 'propB'],
        //    mounted: function () {
        //        this.creenID = src.componentName;
        //        console.log('1>>>>>screen_content ' + src.componentName, src.path);
        //    },
        //});
    });

    console.log(screens);
    console.log(_patrs);

    app = new Vue({
        el: '#dynamic-component-demo',
        data: {
            subdata: {
                propA: 'valA',
                propB: 'valB'
            },
            currentTab: 'subcomponent',
            tabs: _tabs
        },
        computed: {
            currentTabComponent: function () {
                return this.currentTab;
            }
        },
        components: _patrs,
    });
}