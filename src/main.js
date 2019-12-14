import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui'
import './plugins/element'

import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'

import animate from 'animate.css'
Vue.use(animate)

import qs from 'qs'
Vue.prototype.$qs = qs

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8089/api/v1'
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
