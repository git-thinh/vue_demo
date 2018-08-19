var load = function (url) { var request = new XMLHttpRequest(); request.open('GET', url, false); request.send(null); if (request.status === 200) return request.responseText; };
var loadView = function (viewCode) { var htm = load('/views/' + viewCode + '/temp.html'); var css = load('/views/' + viewCode + '/css.css'); return htm + '<style> ' + css + ' </style>'; };

var About = { template: '<h1>About</div>' };
var Dashboard = {
    template: load('/views/sign-in/temp.html'),
    props: ['code'],
    data: {
        Loaded: false
    },
    beforeCreate: function () {
        console.log('beforeCreate = ', this.$route.params);

        var css = load('/views/sign-in/css.css');
        //console.log(css);
    },
    mounted: function () {
        console.log('mounted.code = ', this.code);
        console.log('mounted = ', this.$route.params);
        document.body.className = 'text-center';
    },
    computed: {
    },
    watch: {
        Loaded: function (newValueLoad, oldValueLoad) {
            this.f_Ready();
        }
    },
    methods: {
        f_getId: function () {
            return 'sign-in';
        },
        f_Ready: function () {

        }
    }
};

var Auth = {
    loggedIn: false,
    login: function () { this.loggedIn = true },
    logout: function () { this.loggedIn = false }
};

var Login = {
    template: '<input type="submit" value="Login" v-on:click="login">',
    methods: {
        login: function () {
            Auth.login();
            router.push(this.$route.query.redirect);
        }
    }
};

var routes = [
  { path: '/', component: Dashboard, props: { code: 'sign-in', } },
  { path: '/index.html', component: Dashboard, props: { code: 'sign-in', } },
  { path: '/login', component: Login },
  { path: '/about', component: About },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
];

var router = new VueRouter({
    routes
    });

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !Auth.loggedIn) {
        next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

new Vue({
    router,
        template: `
        <div id="app">
            <p>
                <router-link to="/about">About</router-link>
                <router-link to="/dashboard">Dashboard</router-link>
            </p>
          <router-view class="view"></router-view>
        </div>
  `
}).$mount('#app')
