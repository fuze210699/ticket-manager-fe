import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@features/landing/views/LandingPage.vue';
import LoginPage from '@features/auth/views/LoginPage.vue';
import RegisterPage from '@features/auth/views/RegisterPage.vue';
import HomePage from '@features/home/views/HomePage.vue';
import WorkspacePage from '@/views/WorkspacePage.vue';
import GuidePage from '@features/guide/views/GuidePage.vue';
import ProfilePage from '@features/profile/views/ProfilePage.vue';
import SettingsPage from '@features/settings/views/SettingsPage.vue';
import SignUpPage from '@features/auth/views/SignUpPage.vue';
import LearnMorePage from '@features/landing/views/LearnMorePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuidePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/learn-more',
      name: 'learn-more',
      component: LearnMorePage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/workspace/:id',
      name: 'workspace',
      component: WorkspacePage,
      meta: { requiresAuth: true },
      props: true, // Enable props passing for route parameters
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem('token') || localStorage.getItem('isAuthenticated') === 'true';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;
