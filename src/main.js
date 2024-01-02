import Vue from 'vue'
import App from './App.vue'
//import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 定义全局变量
Vue.prototype.isAuthenticated = false;
/*
router.beforeEach((to, from, next) => {
  if(to.path === '/home' && !Vue.prototype.isAuthenticated){
    next('/login')
  }
  else{
    next();
  }
});
*/

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')

/*
new Vue({
  router,
}).$mount('#app') 
*/