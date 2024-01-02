//import App from '../App';
import Vue from 'vue'
import VueRouter from "vue-router";
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Publish from '../views/Publish.vue';
import Process from '../views/Process.vue';
import Subscribe from '../views/Subscribe.vue';

Vue.use(VueRouter)
const router = new VueRouter({
  routes:[
    {path:'/login',component:Login},
    {path:'/home',component:Home},
    {path:'/publish',component:Publish},
    {path:'/process',component:Process},
    {path:'/subscribe',component:Subscribe},
  ]
})

export default router

/*
export default [{
    path: '/',
    component: App,
    children: [{
        path: '',
        component: () => import('../views/Login.vue'),
    }, {
        path: '/home',
        component: () => import('../views/Home.vue')
        //component: r => require.ensure([], () => r(require('../views/home')), 'home')
    }/*, {
        path: '/score',
        component: r => require.ensure([], () => r(require('../page/score')), 'score')
    }]
}]
*/