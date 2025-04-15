import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '../views/LayoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutView,
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'recipes',
          name: 'recipes',
          component: () => import('../views/RecipesView.vue')
        },
        {
          path: 'recipes/:id',
          name: 'recipe-detail',
          component: () => import('../views/RecipeDetailView.vue')
        },
        {
          path: 'brewing',
          name: 'brewing',
          component: () => import('../views/BrewingView.vue')
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../views/InventoryView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    }
  ]
})

export default router 