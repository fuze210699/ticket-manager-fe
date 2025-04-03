import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@infrastructure/i18n'

const routes = [
  {
    path: '/:locale?',
    component: () => import('@app/RootLayout.vue'),
    beforeEnter: (to, from, next) => {
      const locale = to.params.locale || navigator.language.split('-')[0]
      if (['vi', 'en', 'ja'].includes(locale)) {
        i18n.global.locale.value = locale
        next()
      } else {
        // Redirect to default language if locale is not supported
        next(`/${i18n.global.fallbackLocale.value}${to.path}`)
      }
    },
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('@features/landing/views/LandingPage.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@features/auth/views/LoginPage.vue')
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('@features/auth/views/SignUpPage.vue')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@features/home/pages/HomePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'workspace/:id',
        name: 'workspace',
        component: () => import('@features/workspace/views/WorkspacePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@shared/components/NotFound.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.name !== 'landing' && to.name !== 'login' && to.name !== 'signup' && to.name !== 'not-found' && !to.meta.requiresAuth) {
    to.meta.requiresAuth = true
  }
  if (to.meta.requiresAuth && !localStorage.getItem('isAuthenticated')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router;
