import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('toTime', timestamp => {
  return new Date(timestamp * 1000)
})

Vue.filter('formatTime', time => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
})