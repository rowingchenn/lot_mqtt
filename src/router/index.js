//import App from '../App';
import Vue from 'vue'
import VueRouter from "vue-router";
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