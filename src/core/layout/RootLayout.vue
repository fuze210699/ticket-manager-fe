<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { i18n } from '@infrastructure/i18n';

const route = useRoute();

onMounted(() => {
  const locale = route.params.locale || navigator.language.split('-')[0];
  if (['vi', 'en', 'ja'].includes(locale)) {
    i18n.global.locale.value = locale;
  }
});
</script>
