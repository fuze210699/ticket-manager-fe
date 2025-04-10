<template>
  <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
    <button
      class="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
      :aria-label="t('workspace.addTicket')"
      @click="$emit('add-ticket')"
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
        <path d="M12 2v20M2 12h20" />
      </svg>
      <span class="text-sm">{{ t('workspace.addTicket') }}</span>
    </button>

    <!-- Filter Button -->
    <button
      class="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
      :aria-label="t('workspace.filter')"
      @click="showFilterModal = true"
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
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span class="text-sm">{{ t('workspace.filter') }}</span>
    </button>

    <!-- Settings Button -->
    <button
      class="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
      :aria-label="t('workspace.settings')"
      @click="showSettingsModal = true"
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
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
      <span class="text-sm">{{ t('workspace.settings') }}</span>
    </button>
  </div>

  <!-- Filter Modal -->
  <FilterModal
    v-model="showFilterModal"
    :filters="filters"
    @apply="handleFilterApply"
  />

  <!-- Settings Modal -->
  <SettingsModal
    v-model="showSettingsModal"
    :settings="settings"
    @save="handleSettingsSave"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterModal from '@infrastructure/widgets/ticket_manager/components/FilterModal.vue';
import SettingsModal from '@infrastructure/widgets/ticket_manager/components/SettingsModal.vue';

const { t } = useI18n();

const showFilterModal = ref(false);
const showSettingsModal = ref(false);

const filters = ref({
  status: '',
  priority: '',
  dueDate: '',
  milestone: ''
});

const settings = ref({
  nodeColor: '#ffffff',
  nodeSize: 'medium',
  showMiniMap: true,
  showControls: true
});

const handleFilterApply = (newFilters) => {
  filters.value = newFilters;
  emit('filter-change', newFilters);
};

const handleSettingsSave = (newSettings) => {
  settings.value = newSettings;
  emit('settings-change', newSettings);
};

const emit = defineEmits(['add-ticket', 'filter-change', 'settings-change']);
</script>
