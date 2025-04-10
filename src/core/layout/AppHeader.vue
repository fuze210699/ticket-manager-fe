<template>
  <div class="bg-white border-b border-gray-200 w-full">
    <div class="p-3">
      <!-- Desktop Header -->
      <div class="hidden md:flex items-center justify-between">
        <div class="flex items-center gap-4 cursor-pointer" @click="goToHome">
          <LogoIcon class="h-6 w-6" />
          <span class="hidden font-bold lg:inline-block">Your Workspace Hub</span>
        </div>
        <div class="flex items-center gap-6">
          <div class="relative">
            <div
              class="flex items-center gap-2 focus:outline-none cursor-pointer"
              @click="toggleProfileMenu"
            >
              <img src="https://placehold.co/32x32" alt="Avatar" class="w-8 h-8 rounded-full" />
              <span class="text-sm text-gray-700">Tran Thien</span>
              <svg
                class="w-4 h-4 text-gray-500"
                :class="{ 'transform rotate-180': isProfileMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <!-- Profile Dropdown Menu -->
            <div
              v-if="isProfileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeProfileMenu"
              >
                {{ $t('nav.profile') }}
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeProfileMenu"
              >
                {{ $t('nav.settings') }}
              </router-link>
              <span
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleLogout"
              >
                {{ $t('nav.logout') }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{ $t('common.language') }}:</span>
            <select
              v-model="currentLocale"
              class="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="changeLocale"
            >
              <option value="vi">{{ $t('common.vietnamese') }}</option>
              <option value="en">{{ $t('common.english') }}</option>
              <option value="ja">{{ $t('common.japanese') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" @click="goToHome">
          <LogoIcon class="h-6 w-6" />
          <span class="hidden font-bold lg:inline-block">Your Workspace Hub</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            @click="toggleMobileMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div class="relative">
            <button class="flex items-center focus:outline-none" @click="toggleProfileMenu">
              <img src="https://placehold.co/32x32" alt="Avatar" class="w-8 h-8 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-gray-200">
        <nav class="flex flex-col space-y-4">
          <router-link
            to="/profile"
            class="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
            @click="closeMobileMenu"
          >
            {{ $t('nav.profile') }}
          </router-link>
          <router-link
            to="/settings"
            class="text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
            @click="closeMobileMenu"
          >
            {{ $t('nav.settings') }}
          </router-link>
          <button
            class="text-left text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md"
            @click="handleLogout"
          >
            {{ $t('nav.logout') }}
          </button>
          <div class="flex items-center gap-2 px-2 py-1">
            <span class="text-sm text-gray-600">{{ $t('common.language') }}:</span>
            <select
              v-model="currentLocale"
              class="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="changeLocale"
            >
              <option value="vi">{{ $t('common.vietnamese') }}</option>
              <option value="en">{{ $t('common.english') }}</option>
              <option value="ja">{{ $t('common.japanese') }}</option>
            </select>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LogoIcon from '@core/ui/LogoIcon.vue';

const router = useRouter();
const isProfileMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const { locale } = useI18n();
const currentLocale = ref(locale.value);

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  // Clear authentication state
  localStorage.removeItem('isAuthenticated');
  // Redirect to login page
  router.push('/login');
};

const goToHome = () => {
  router.push('/home');
};

// Close menus when clicking outside
const handleClickOutside = event => {
  if (isProfileMenuOpen.value && !event.target.closest('.relative')) {
    closeProfileMenu();
  }
  if (isMobileMenuOpen.value && !event.target.closest('.md\\:hidden')) {
    closeMobileMenu();
  }
};

const changeLocale = () => {
  locale.value = currentLocale.value;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
