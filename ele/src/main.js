import Vue from 'vue'
import VueResource from 'vue-resource'
import VueScroller from 'vue-scroller'

import moment from 'moment'
import app from './app'
import router from './router'
import './mock/mockServer' // 引入加载模块
import './common/stylus/fonts.styl'

Vue.use(VueResource)
Vue.use(VueScroller)

// 注册全局的过滤器
Vue.filter('date-string', function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(app),
  router
})
