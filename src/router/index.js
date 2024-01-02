//import App from '../App';
import Vue from 'vue'
import VueRouter from "vue-router";
//import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Source from '../views/Source.vue';
import Processing from '../views/Processing.vue';
import Visualization from '../views/Visualization.vue';

Vue.use(VueRouter)
const router = new VueRouter({
  routes:[
    {path:'/',component:Login},
    {path:'/home',component:Home},
    {path:'/processing',component:Processing},
    {path:'/source',component:Source},
    {path:'/visualization',component:Visualization},
  ]
});

/*
router.beforeEach((to, from, next) => {
  // 在全局前置守卫中执行断开连接的逻辑
  console.log(store.getters.getClient);
  if (store.getters.getClient && to.path === '/') {
    store.dispatch('disconnectClient').then(() => {
      next(); // 继续导航
    });
  } else {
    next(); // 如果没有 client，直接继续导航
  }
});*/

export default router