import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/pages/Accounts.vue'),
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
    path: '/hr',
    name: 'HR',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
    path: '/projects/:tab?',
    name: 'Projects',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('@/pages/Dashboard.vue'), // placeholder
  },
  {
  path: '/:pathMatch(.*)*',
  redirect: '/'
  },
]

let router = createRouter({
  history: createWebHistory('/integratech/'),
  routes,
})

export default router