import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import App from './App'
/*import Login from './components/login'
import Reg from './components/reg'*/
import yeniüye from './components/yeniüye'
import üyegirisi from './components/üyegirisi'
import hakkımızda from './components/hakkımızda'
import iletisim from './components/iletisim'
import sepetim from './components/sepetim'
import objekoleksiyonu from './components/objekoleksiyonu'
import pikapignesi2 from './components/pikapignesi2'

import CartList from './components/cart/CartList'
import ProductList from './components/product/ProductList'
import sss from './components/sss'
import body from './components/body'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/templatemo.css'
import './assets/css/font-awesome.min.css'
import store from './store/index'
import VueClazyLoad from 'vue-clazy-load'
import "vue-loading-overlay/dist/vue-loading.css";
import VueMaterial from 'vue-material'
import '@fortawesome/fontawesome-free/css/all.min.css'
import BootstrapVue from 'bootstrap-vue'
import VueTinyLazyloadImg from 'vue-tiny-lazyload-img'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(VueTinyLazyloadImg);
Vue.use(VueClazyLoad)
Vue.use(BootstrapVue)
Vue.use(VueMaterial)

const routes = [{
  path : '/',
  component : body,
  meta: { auth: false },
},
/*{
  path : '/login',
  component : Login,
},{
  path : '/reg',
  component : Reg,
  meta: { auth: false },
},*/

{
  path : '/giris',
  component : üyegirisi,
  meta: { auth: false },
},
  {
    path : '/kayıt',
    component : yeniüye,
    meta: { auth: false },
  },
  {
    path : '/hakkımızda',
    component : hakkımızda,
    meta: { auth: false },
  },
  {
    path : '/iletisim',
    component : iletisim,
    meta: { auth: false },
  },
  {
    path : '/sepetim',
    component : sepetim,
    meta: { auth: false },
  },
  {
    path : '/cartlist',
    component : CartList,
    meta: { auth: false },
  },
  {
    path : '/productlist',
    component : ProductList,
    meta: { auth: false },
  },
  {
    path : '/SSS',
    component : sss,
    meta: { auth: false },
  },
  {
    path : '/objekoleksiyon',
    component : objekoleksiyonu,
    meta: { auth: false },
  },
  {
    path : '/pikapignesi',
    component : pikapignesi2,
    meta: { auth: false },
  }
  
];

const router = new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  routes
});

router.beforeEach(({meta, path}, from, next) => {
  var { auth = true } = meta;
  var isLogin = Boolean(store.state.login.token) //true用户已登录， false用户未登录

  if (auth && !isLogin && path !== '/login') {
    return next({ path: '/login' })
  }
  if(isLogin && (path == '/login' || path == '/reg')){
   return next({ path: '/person' })
   }
  next()
});

var app = new Vue({
  el: '#app',
  router,
  store,
  ...App,
});
