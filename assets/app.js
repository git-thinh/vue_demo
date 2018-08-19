//var load = function (url) { var request = new XMLHttpRequest(); request.open('GET', url, false); request.send(null); if (request.status === 200) return request.responseText; };

//var Auth = {
//    loggedIn: false,
//    login: function () { this.loggedIn = true },
//    logout: function () { this.loggedIn = false }
//};

//var PARTS = [
//  {
//      name: 'blank',
//      component: {
//          template: '<div>blank</div>'
//      }
//  },
//  {
//      name: 'Login',
//      component: {
//          template: '<input type="submit" value="Login" v-on:click="login">',
//          methods: {
//              login: function () {
//                  Auth.login();
//                  router.push(this.$route.query.redirect);
//              }
//          }
//      }
//  },
//  {
//      name: 'Dashboard',
//      component: {
//          template: load('/assets/parts/user-sign-in-001/temp.html'),
//          props: ['code'],
//          data: {
//              Loaded: false
//          },
//          beforeCreate: function () {
//              console.log('beforeCreate = ', this.$route.params);

//              //var css = load('/parts/sign-in/css.css');
//              //console.log(css);
//          },
//          mounted: function () {
//              console.log('mounted.code = ', this.code);
//              console.log('mounted = ', this.$route.params);
//              document.body.className = 'text-center';
//          },
//          computed: {
//          },
//          watch: {
//              Loaded: function (newValueLoad, oldValueLoad) {
//                  this.f_Ready();
//              }
//          },
//          methods: {
//              f_getId: function () {
//                  return 'sign-in';
//              },
//              f_Ready: function () {

//              }
//          }
//      }
//  },
//  {
//      name: 'About',
//      component: {
//          template: '<div>About component</div>'
//      }
//  },
//  {
//      name: 'Home',
//      component: {
//          template: '<div>Home component</div>'
//      }
//  },
//  {
//      name: 'Posts',
//      component: {
//          template: '<div>Posts component</div>'
//      }
//  },
//  {
//      name: 'Archive',
//      component: {
//          template: '<div>Archive component</div>',
//      }
//  }
//]

//var routes = [
//  { path: '/', component: PARTS[2].component, props: { code: 'sign-in', } },
//  { path: '/index.html', component: PARTS[2].component, props: { code: 'sign-in', } },
//  { path: '/login', component: PARTS[1].component },
//  { path: '/about', component: PARTS[3].component },
//  { path: '/dashboard', component: PARTS[2].component, meta: { requiresAuth: true } },
//];

//var app;
//var router = new VueRouter({ routes });

//router.beforeEach((to, from, next) => {
//    if (to.matched.some(record => record.meta.requiresAuth) && !Auth.loggedIn) {
//        next({ path: '/login', query: { redirect: to.fullPath } });
//    } else {
//        next();
//    }
//});

//function f_initApp() {
//    return new Vue({
//        router,
//        template: '<div id="app"><p><router-link to="/about">About</router-link><router-link to="/dashboard">Dashboard</router-link></p><router-view class="view"></router-view></div>',
//        mounted: function () {            
//        }
//    }).$mount('#app');
//}

//function f_runApp(coms) {
//    app = f_initApp();
//}

////fetch(API_CF.APP_SETTING).then(r=>r.json()).then(jo=> {
////    console.log(jo);
////});