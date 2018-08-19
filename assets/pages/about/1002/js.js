var _____ScreenID = 'Screen____ScreenID';
var vue____ScreenID;

var com____ScreenID = {
    template: '<div id="' + _____ScreenID + '"></div>',
    props: ['screen_content'],
    mounted: function () {
        this.instancemake(this.screen_content);
    },
    destroyed: function () {
        if (!(vue____ScreenID === null)) { vue____ScreenID.$destroy(); vue____ScreenID = null; } 
    },
    methods: {
        instancemake: function (screen_content) {
            vue____ScreenID = f_instance____ScreenID(screen_content);
            vue____ScreenID.f_setup();
        }
    }
}

function f_instance____ScreenID(screen_content) {
    screen_content += '<h2>' + new Date().toString() + '</h2>';
    var vue = new Vue({
        el: '#' + _____ScreenID,
        template: screen_content,
        data: {
            screenID: '___ScreenID',
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
                _self.broadcastChannel = 'broadcast' + _____ScreenID;

                f_broadcast_comVUE_joinAll(function (msg) { f_broadcast_comVUE_msgReceiver(_self, msg, _self.f_broadcast_messageReceiver); });
                f_broadcast_comVUE_joinSender(function (msg) { f_broadcast_comVUE_msgReceiver(_self, msg, _self.f_broadcast_messageReceiver); }, _self);
            },

            f_broadcast_messageReceiver: function (msg) {
                console.log('HOMEUI -> RECEIVER: ', msg);
                var key = msg.KEY, data = msg.data;
                switch (key) {
                }
                //console.log('homeui: ' + key, data);
            },

            // #endregion
             
            f_setup: function (init) {
                console.log(this.screenID, '#' + _____ScreenID + '_Template');
            },
            f_getScreenID: function () {
                return _____ScreenID;
            },
        }
    })
    return vue;
};
