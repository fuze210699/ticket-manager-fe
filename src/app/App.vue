<template>
  <div class="min-h-screen bg-gray-100">
    <Toast :show="false" :message="''" :type="'info'" />
    <router-view v-slot="{ Component }">
      <component :is="Component" v-if="!requiresAuth" />
      <div v-else class="min-h-screen bg-gray-50">
        <AppLayout>
          <component :is="Component" />
        </AppLayout>
      </div>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Toast from '@core/ui/Toast.vue';
import AppLayout from '@layouts/AppLayout.vue';

const route = useRoute();
const requiresAuth = computed(() => {
  return route.meta.requiresAuth === true;
});
</script>
