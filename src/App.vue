<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="!requiresAuth" />
    <AuthenticatedLayout v-else>
      <component :is="Component" />
    </AuthenticatedLayout>
  </router-view>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthenticatedLayout from './layouts/AuthenticatedLayout.vue';

const route = useRoute();
const requiresAuth = computed(() => {
  return route.meta.requiresAuth !== false;
});
</script>
