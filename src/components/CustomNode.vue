<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-w-[200px]">
    <!-- Compact Mode -->
    <div v-if="!isExpanded" class="flex items-center justify-between rounded-lg p-2" :class="{
      'bg-blue-100': data.status === 'To Do',
      'bg-yellow-100': data.status === 'In Progress',
      'bg-green-100': data.status === 'Done'
    }">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium" :class="{
          'text-blue-800': data.status === 'To Do',
          'text-yellow-800': data.status === 'In Progress',
          'text-green-800': data.status === 'Done'
        }">{{ data.code }}</span>
        <a v-if="data.link" :href="data.link" target="_blank" class="text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </a>
      </div>
      <button @click="toggleExpand" class="p-1 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- Full Mode -->
    <div v-else>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-900">{{ data.code }}</span>
          <span :class="{
            'px-2 py-1 text-xs font-medium rounded-full': true,
            'bg-blue-100 text-blue-800': data.status === 'To Do',
            'bg-yellow-100 text-yellow-800': data.status === 'In Progress',
            'bg-green-100 text-green-800': data.status === 'Done'
          }">
            {{ data.status }}
          </span>
        </div>
        <button @click="toggleExpand" class="p-1 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
      <h3 class="font-medium text-gray-900 mb-2">{{ data.name }}</h3>
      <div class="text-sm text-gray-500 mb-2">{{ data.milestone }}</div>
      <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Est: {{ data.estimateTime }}h</span>
        </div>
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Act: {{ data.actualTime }}h</span>
        </div>
      </div>
      <a v-if="data.link" :href="data.link" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Link
      </a>
    </div>

    <Handle type="target" position="top" class="w-3 h-3 bg-gray-400" />
    <Handle type="source" position="bottom" class="w-3 h-3 bg-gray-400" />
  </div>
</template>

<script setup>
import { Handle } from '@vue-flow/core';
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
