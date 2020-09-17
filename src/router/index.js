import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/User'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [{
    path: '/',
    // 路由重定向
    redirect: '/login'
  },
  {
    // 访问哪个路由就展示对应组件
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ]
  }]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转过来
  // next是个函数，表示放行，有两种调用方式
  // next()  放行    next('/login')  强制跳转
  // 访问登录页直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  // 上面没有return 掉说明存在，说明登录成功，直接放行
  next()
})
export default router
