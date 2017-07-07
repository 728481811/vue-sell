// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import './common/stylus/index.styl'
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import axios from 'axios';

Vue.prototype.$http = axios;
Vue.use(VueRouter);
// 2. 定义路由
const routes = [
  { path:'/',redirect:'/goods'},
  { path: '/goods',component: goods },
  { path: '/seller',component: seller },
  { path: '/ratings',component: ratings},

]
// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  routes: routes,
  linkActiveClass: 'active'
})
// 4. 创建和挂载根实例。
const app = new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})


