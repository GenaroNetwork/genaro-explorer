import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router'
import store from './store'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(iView)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
