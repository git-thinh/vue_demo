var _SceenTestTemplate =
    '<div>' +
    '<div id="ID_SceenTest"></div>' +
    '</div>'

var _SceenTestContentTemplate =
    '<div v-show="pageReady">' +
    '<div id="LayoutHeader">' +
    '<h1>LayoutHeader</h1>' +
    '</div>' +
    '<div id="LayoutContentArea">' +
    '<h3>LayoutContentArea</h3>' +
    '<com-hui-nav-left></com-hui-nav-left>' +
    '<com-hui-toolbar></com-hui-toolbar>' +
    '</div>' +
    '<div id="LayoutFooter" v-show="this.is10Inch()">' +
    '<h3>LayoutFooter</h3>' +
    '</div>' +
    '</div>'

var _vueSceenTest;
function f_instanceSceenTest() {
    var vue = new Vue({
        el: '#ID_SceenTest',
        template: _SceenTestContentTemplate,
        data: {
            pageReady: false,
        },
        beforeCreate: function () {
        },
        mounted: function () {
            this.f_broadcast_Register();
        },
        methods: {
            // #region BASE

            f_broadcast_Register: function () {
                var _self = this;
                _self.broadcastChannel = 'broadcast-' + this._uid;

                f_hui_broadcast_ComponentsVUE_Join_All(function (msg) { f_vue_broadcast_message_Receiver(_self, msg, _self.f_com_process_Message_Receiver); });
                f_hui_broadcast_ComponentsVUE_Join_Sender(function (msg) { f_vue_broadcast_message_Receiver(_self, msg, _self.f_com_process_Message_Receiver); }, _self);
            },

            f_com_process_Message_Receiver: function (msg) {
                console.log('HOMEUI -> RECEIVER: ', msg);
                var key = msg.KEY, data = msg.data;
                switch (key) {
                }
                //console.log('homeui: ' + key, data);
            },

            // #endregion

            f_ready: function (data) {
                var _self = this;

            },
            setup: function (init) {
            },
            getScreenID: function () {
                return 'Sceen001';
            },
        }
    })
    return vue;
};

var HomeUISetting_Test = {
    template: _SceenTestTemplate,
    beforeCreate: function () {
    },
    created: function () {
    },
    mounted: function () {
        this.instancemake();
    },
    destroyed: function () {
        if (!(_vueSceenTest === null)) { _vueSceenTest.$destroy(); _vueSceenTest = null; }
        vueTopScreen.pop();
    },
    methods: {
        instancemake: function () {
            _vueSceenTest = f_instanceSceenTest();
            //vueTopScreen.push(_vueSceenTest);
            _vueSceenTest.setup();
        }
    }
}
