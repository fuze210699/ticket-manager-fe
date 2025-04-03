<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        © {{ new Date().getFullYear() }} {{ $t('footer.appName') }}. {{ $t('footer.allRightsReserved') }}
      </div>
      <div class="flex items-center gap-4">
        <a href="#" class="text-sm text-gray-600 hover:text-gray-800">{{ $t('footer.privacyPolicy') }}</a>
        <a href="#" class="text-sm text-gray-600 hover:text-gray-800">{{ $t('footer.termsOfService') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

