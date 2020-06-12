import Vue from 'vue'
import router from './router/router.js'
import store from './store/store.js'

import axios from 'axios'
Vue.prototype.$http = axios

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('./assets/loader.jpg')
})

const app = new Vue({
  router,
  store
}).$mount('#app')

export default app
