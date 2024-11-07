import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index'
import Todos from '../pages/todos/index'
import Todo from '../pages/todos/_id'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/todos',
    name: 'Todos',
    component: Todos
  },
  {
    path: '/todos/:id',
    name: 'Todo',
    component: Todo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
