import { createRouter, createWebHistory } from 'vue-router';
import { i18n } from '@infrastructure/i18n';

// Define lazy-loaded components
const RootLayout = () => import('@core/layout/RootLayout.vue');
const LandingPage = () => import('@features/landing/views/LandingPage.vue');
const LoginPage = () => import('@features/auth/views/LoginPage.vue');
const SignUpPage = () => import('@features/auth/views/SignUpPage.vue');
const HomePage = () => import('@features/home/views/HomePage.vue');
const WorkspaceDetail = () => import('@infrastructure/widgets/ticket_manager/views/WorkspaceDetail.vue');
const NotFound = () => import('@core/ui/NotFound.vue');

const routes = [
  {
    path: '/:locale?',
    component: RootLayout,
    beforeEnter: (to, from, next) => {
      const locale = to.params.locale || navigator.language.split('-')[0];
      if (['vi', 'en', 'ja'].includes(locale)) {
        i18n.global.locale.value = locale;
        next();
      } else {
        // Redirect to default language if locale is not supported
        next(`/${i18n.global.fallbackLocale.value}${to.path}`);
      }
    },
    children: [
      {
        path: '',
        name: 'landing',
        component: LandingPage,
      },
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
      {
        path: 'signup',
        name: 'signup',
        component: SignUpPage,
      },
      {
        path: 'home',
        name: 'home',
        component: HomePage,
        meta: { requiresAuth: true },
      },
      {
        path: 'workspace/:id',
        name: 'workspace-detail',
        component: WorkspaceDetail,
        meta: { requiresAuth: true },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // Redirect root path to home
  if (to.path === '/') {
    next('/home');
    return;
  }

  if (
    to.name !== 'landing' &&
    to.name !== 'login' &&
    to.name !== 'signup' &&
    to.name !== 'not-found' &&
    !to.meta.requiresAuth
  ) {
    to.meta.requiresAuth = true;
  }
  if (to.meta.requiresAuth && !localStorage.getItem('isAuthenticated')) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
