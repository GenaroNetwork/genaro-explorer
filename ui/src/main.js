import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router'
import store from './store'

import zh_cn from './locale/zh_cn'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './app.scss'

import Web3 from 'genaro-web3';

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(iView)
Object.defineProperty(Vue.prototype, 'Web3', {
  value: Web3
})

const i18n = new VueI18n({
  locale: 'zh_cn',
  messages: {
    zh_cn
  }
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
