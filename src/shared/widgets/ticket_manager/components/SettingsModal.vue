<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">{{ t('workspace.settings') }}</h3>
      <div class="space-y-4">
        <!-- Node Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('workspace.nodeColor') }}</label>
          <input
            v-model="localSettings.nodeColor"
            type="color"
            class="w-full h-10 rounded-md border border-gray-300"
          />
        </div>

        <!-- Node Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('workspace.nodeSize') }}</label>
          <select v-model="localSettings.nodeSize" class="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="small">{{ t('workspace.small') }}</option>
            <option value="medium">{{ t('workspace.medium') }}</option>
            <option value="large">{{ t('workspace.large') }}</option>
          </select>
        </div>

        <!-- Show MiniMap -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">{{ t('workspace.showMiniMap') }}</label>
          <input
            v-model="localSettings.showMiniMap"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <!-- Show Controls -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">{{ t('workspace.showControls') }}</label>
          <input
            v-model="localSettings.showControls"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          @click="handleCancel"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          @click="handleSave"
        >
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  settings: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localSettings = ref({ ...props.settings });

// Watch for changes in props.settings
watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
}, { deep: true });

const handleCancel = () => {
  emit('update:modelValue', false);
};

const handleSave = () => {
  emit('save', localSettings.value);
  emit('update:modelValue', false);
};
</script>