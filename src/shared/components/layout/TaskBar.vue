<template>
  <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
        :aria-label="t('ticket.add')"
        @click="emit('addTicket')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="text-sm">{{ t('ticket.add') }}</span>
      </button>
      <div class="h-6 w-px bg-gray-200"></div>
      <div class="flex items-center gap-2">
        <input
          type="text"
          :placeholder="t('common.search')"
          :aria-label="t('common.search')"
          class="h-9 w-64 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          class="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
          :aria-label="t('common.filter')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span class="text-sm">{{ t('common.filter') }}</span>
        </button>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
        :aria-label="t('common.settings')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          ></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span class="text-sm">{{ t('common.settings') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['addTicket']);
</script>
