// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies'
import router from './router'
import store from './store'
import db from './db'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
