import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/user/Login'
import Register from '@/components/user/Register'
import Home from '@/components/Home'
import EditTodo from '@/components/todo/Edit'
import store from '../store'

Vue.use(Router)

const protectRoute = (to, fr, next) => {
  if (store.state.token && store.state.user) {
    next()
  } else {
    next('/login')
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: protectRoute
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/todo/:id',
      name: 'EditTodo',
      component: EditTodo,
      beforeEnter: protectRoute
    },
  ]
})
