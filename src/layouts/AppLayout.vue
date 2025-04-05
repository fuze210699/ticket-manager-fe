<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot></slot>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@shared/components/layout/AppHeader.vue';
import AppFooter from '@shared/components/layout/AppFooter.vue';
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
