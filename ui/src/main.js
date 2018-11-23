import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import router from './router'
import store from './store/index'

import zh_cn from './locale/zh_cn'

import 'normalize.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/app.scss'
import 'vuetify/dist/vuetify.min.css'
import 'babel-polyfill'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/filter'

import dayis from 'dayjs'
import web3Utils from 'web3-utils'
import VueClipboard from 'vue-clipboard2'
import Vuetify from 'vuetify'

import ECharts from 'vue-echarts/components/ECharts.vue'
 

Object.defineProperty(Vue.prototype, '$dayjs',{
  value: dayis
})

Object.defineProperty(Vue.prototype, '$web3Utils', {
  value: web3Utils
})


Vue.config.productionTip = false
Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
Vue.use(VueI18n)
Vue.use(iView)
Vue.use(VueClipboard)
Vue.component('v-chart', ECharts)


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
