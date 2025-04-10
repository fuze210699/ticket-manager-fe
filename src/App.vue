<template>
  <div class="min-h-screen bg-gray-100">
    <Toast :show="false" :message="''" :type="'info'" />
    <router-view v-slot="{ Component }">
      <div class="min-h-screen bg-gray-50">
        <AppLayout>
          <component :is="Component" />
        </AppLayout>
      </div>
      <!-- <component :is="Component" v-if="!requiresAuth" /> -->
    </router-view>
  </div>
</template>

<script setup>
// import { computed } from 'vue';
// import { useRoute } from 'vue-router';
import Toast from '@core/ui/Toast.vue';
import AppLayout from '@core/layout/AppLayout.vue';

// const route = useRoute();
// const requiresAuth = computed(() => {
//   return false; // route.meta.requiresAuth === true;
// });
</script>
