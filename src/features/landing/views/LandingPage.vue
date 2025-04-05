<template>
  <div class="min-h-screen bg-background text-foreground">
    <LandingHeader @navigate="navigateTo" @scroll="scrollToSection" />

    <main class="flex-1">
      <HeroSection @navigate="navigateTo" @scroll="scrollToSection" />
      <FeaturesSection />
      <WidgetsSection />
      <TemplatesSection />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LandingHeader from '@/features/landing/components/LandingHeader.vue';
import HeroSection from '@/features/landing/components/HeroSection.vue';
import FeaturesSection from '@/features/landing/components/FeaturesSection.vue';
import WidgetsSection from '@/features/landing/components/WidgetsSection.vue';
import TemplatesSection from '@/features/landing/components/TemplatesSection.vue';
import LandingFooter from '@/features/landing/components/LandingFooter.vue';

const router = useRouter();

// Navigation handlers
const navigateTo = path => {
  router.push(path);
};

// Smooth scroll function
const scrollToSection = sectionId => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)));
}

.container {
  margin-left: auto;
  margin-right: auto;
  max-width: 80rem;
}
</style>
