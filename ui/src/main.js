import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router'
import store from './store'

import zh_cn from './locale/zh_cn'

import 'normalize.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/app.scss'

import '@/filter'

import dayis from 'dayjs'
import web3Utils from 'web3-utils'
import VueClipboard from 'vue-clipboard2'

Object.defineProperty(Vue.prototype, '$dayjs',{
  value: dayis
})

Object.defineProperty(Vue.prototype, '$web3Utils', {
  value: web3Utils
})


Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(iView)
Vue.use(VueClipboard)


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
