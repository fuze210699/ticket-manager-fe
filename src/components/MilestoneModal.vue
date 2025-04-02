<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ $t('milestone.add') }}</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('milestone.title') }}</label>
          <input v-model="milestone.name" type="text" :placeholder="$t('milestone.placeholder.title')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('milestone.description') }}</label>
          <textarea v-model="milestone.description" :placeholder="$t('milestone.placeholder.description')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('milestone.startTime') }}</label>
            <input v-model="milestone.startTime" type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('milestone.endTime') }}</label>
            <input v-model="milestone.endTime" type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button @click="emit('close')" class="px-4 py-2 text-gray-700 hover:text-gray-900 cursor-pointer bg-gray-200 rounded-md">
          {{ $t('common.close') }}
        </button>
        <button @click="handleSave" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          {{ $t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMilestoneStore } from '../stores/milestone';

const emit = defineEmits(['close', 'save']);
const milestoneStore = useMilestoneStore();

const milestone = ref({
  name: '',
  description: '',
  startTime: '',
  endTime: ''
});

const handleSave = () => {
  const newMilestone = milestoneStore.addMilestone(milestone.value);
  emit('save', newMilestone);
  milestone.value = {
    name: '',
    description: '',
    startTime: '',
    endTime: ''
  };
};
</script> 