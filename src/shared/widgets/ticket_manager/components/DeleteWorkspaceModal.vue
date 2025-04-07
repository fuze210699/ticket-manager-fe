<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-500/75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ $t('workspace.deleteTitle') }}</h3>
      <p class="text-sm text-gray-500 mb-4">{{ $t('workspace.deleteConfirm') }}</p>
      
      <div class="mb-4">
        <input
          ref="deleteInput"
          v-model="deleteText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          :placeholder="$t('workspace.typeDelete')"
          @keyup.enter="handleConfirm"
          @copy.prevent
          @paste.prevent
          @cut.prevent
          @contextmenu.prevent
        />
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          @click="$emit('close')"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="deleteText !== 'DELETE'"
          @click="handleConfirm"
        >
          {{ $t('common.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'confirm']);

const deleteText = ref('');
const deleteInput = ref(null);

onMounted(() => {
  if (props.isOpen) {
    deleteInput.value?.focus();
  }
});

const handleConfirm = () => {
  if (deleteText.value === 'DELETE') {
    emit('confirm');
    deleteText.value = '';
  }
};
</script> 