import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入axios用于登录
import axios from 'axios'
// 配置请求根路径，根据接口
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂载原型的axios属性，这样每一个Vue实例都可以通过$http属性发起axios请求
Vue.prototype.$http = axios
// 设置axios拦截器即请求预处理
axios.interceptors.request.use(config => {
  // config.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
