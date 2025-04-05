<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 items-center mx-auto px-4">
      <!-- Mobile View -->
      <div class="flex items-center justify-between w-full lg:hidden">
        <a class="flex items-center space-x-2" href="/">
          <LogoIcon class="h-6 w-6" />
          <span class="font-bold text-sm">Workspace</span>
        </a>
        <div class="flex items-center space-x-2">
          <button
            class="p-2 text-primary rounded-md focus:outline-none"
            aria-label="Toggle menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg
              v-if="!isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Button variant="outline" size="sm" @click="$emit('navigate', '/login')"> Sign In </Button>
        </div>
      </div>

      <!-- Desktop View -->
      <div class="mr-4 hidden lg:flex">
        <a class="mr-6 flex items-center space-x-2" href="/">
          <LogoIcon class="h-6 w-6" />
          <span class="hidden font-bold lg:inline-block">Your Workspace Hub</span>
        </a>
        <nav class="flex items-center space-x-6 text-sm font-medium">
          <a
            href="#features"
            class="hover:text-primary transition-colors"
            @click.prevent="$emit('scroll', 'features')"
            >Features</a
          >
          <a
            href="#widgets"
            class="hover:text-primary transition-colors"
            @click.prevent="$emit('scroll', 'widgets')"
            >Widgets</a
          >
          <a
            href="#templates"
            class="hover:text-primary transition-colors"
            @click.prevent="$emit('scroll', 'templates')"
            >Templates</a
          >
          <a href="docs" class="hover:text-primary transition-colors">Documentation</a>
        </nav>
      </div>
      <div class="hidden flex-1 items-center justify-end space-x-2 lg:flex">
        <Button variant="primary" @click="$emit('navigate', '/login')"> Sign In </Button>
        <Button variant="ghost" @click="$emit('navigate', '/signup')"> Get Started </Button>
      </div>
    </div>

    <!-- Mobile Navigation Menu with Animation -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="mobile-menu fixed inset-x-0 top-14 z-50 border-t bg-white dark:bg-background shadow-lg"
      >
        <div class="container mx-auto px-4 py-6">
          <nav class="flex flex-col space-y-5">
            <a
              href="#features"
              class="nav-item text-sm font-medium hover:text-primary transition-colors"
              @click="handleMobileNavClick('features')"
              >Features</a
            >
            <a
              href="#widgets"
              class="nav-item text-sm font-medium hover:text-primary transition-colors"
              @click="handleMobileNavClick('widgets')"
              >Widgets</a
            >
            <a
              href="#templates"
              class="nav-item text-sm font-medium hover:text-primary transition-colors"
              @click="handleMobileNavClick('templates')"
              >Templates</a
            >
            <a href="docs" class="nav-item text-sm font-medium hover:text-primary transition-colors"
              >Documentation</a
            >
            <Button
              variant="default"
              class="w-full mt-4 nav-button"
              @click="$emit('navigate', '/signup')"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import Button from '@core/ui/Button.vue';
import LogoIcon from '@/shared/components/icons/LogoIcon.vue';

const isMenuOpen = ref(false);
const emit = defineEmits(['navigate', 'scroll']);

const handleMobileNavClick = sectionId => {
  emit('scroll', sectionId);
  isMenuOpen.value = false;
};
</script>

<style scoped>
.container {
  transition: all 0.3s ease;
}

.nav-item {
  position: relative;
  padding: 0.5rem 0;
  display: block;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: hsl(var(--muted));
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-item:hover::after {
  transform: scaleX(1);
}

.nav-button {
  transform: translateY(0);
  transition: transform 0.2s ease;
}

.nav-button:hover {
  transform: translateY(-2px);
}
</style>
