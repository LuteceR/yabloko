import { createRouter, createWebHistory } from 'vue-router'
import Home from '../App.vue'
import page from '../pages/page.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/page',
    name: 'page',
    component: page
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})