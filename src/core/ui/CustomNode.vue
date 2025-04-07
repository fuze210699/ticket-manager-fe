<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-w-[200px]">
    <!-- Compact Mode -->
    <div
      v-if="!isExpanded"
      class="flex items-center justify-between rounded-lg p-2"
      :class="statusClass"
    >
      <div class="flex items-center gap-2">
        <span
          class="text-sm font-medium"
          :class="statusTextClass"
          >{{ data.code }}</span
        >
        <a
          v-if="data.link"
          :href="data.link"
          target="_blank"
          class="text-blue-600 hover:text-blue-800"
          :aria-label="t('ticket.openLink')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </a>
      </div>
      <button
        class="p-1 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
        :aria-label="isExpanded ? t('common.collapse') : t('common.expand')"
        @click="toggleExpand"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- Full Mode -->
    <div v-else>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-900">{{ data.code }}</span>
          <span
            :class="{
              'px-2 py-1 text-xs font-medium rounded-full': true,
              'bg-blue-100 text-blue-800': data.status === 'To Do',
              'bg-yellow-100 text-yellow-800': data.status === 'In Progress',
              'bg-green-100 text-green-800': data.status === 'Done',
            }"
          >
            {{ t(statusTranslationKey) }}
          </span>
          <span
            :class="{
              'px-2 py-1 text-xs font-medium rounded-full': true,
              'bg-red-100 text-red-800': data.priority === 'high',
              'bg-yellow-100 text-yellow-800': data.priority === 'medium',
              'bg-green-100 text-green-800': data.priority === 'low',
            }"
          >
            {{ t(`ticket.priorities.${data.priority || 'medium'}`) }}
          </span>
        </div>
        <button
          class="p-1 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
          :aria-label="isExpanded ? t('common.collapse') : t('common.expand')"
          @click="toggleExpand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
      <h3 class="font-medium text-gray-900 mb-2">{{ data.name }}</h3>
      <div class="text-sm text-gray-500 mb-2">{{ data.milestone }}</div>
      <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <div class="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ t('ticket.estimateTime') }}: {{ data.estimateTime }}h</span>
        </div>
        <div class="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ t('ticket.actualTime') }}: {{ data.actualTime }}h</span>
        </div>
      </div>
      <a
        v-if="data.link"
        :href="data.link"
        target="_blank"
        class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        :aria-label="t('ticket.openLink')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        {{ t('ticket.link') }}
      </a>
    </div>

    <Handle
      type="target"
      position="top"
      class="w-3 h-3 bg-gray-400"
      :aria-label="t('ticket.dependencyTarget')"
    />
    <Handle
      type="source"
      position="bottom"
      class="w-3 h-3 bg-gray-400"
      :aria-label="t('ticket.dependencySource')"
    />
  </div>
</template>

<script setup>
import { Handle } from '@vue-flow/core';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      status: 'To Do',
      priority: 'medium',
      code: '',
      name: '',
      milestone: '',
      estimateTime: 0,
      actualTime: 0,
      link: '',
      type: 'ticket'
    })
  },
});

const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// Computed property for status class
const statusClass = computed(() => {
  const status = props.data?.status || 'To Do';
  return {
    'bg-blue-100': status === 'To Do',
    'bg-yellow-100': status === 'In Progress',
    'bg-green-100': status === 'Done',
  };
});

// Computed property for status text class
const statusTextClass = computed(() => {
  const status = props.data?.status || 'To Do';
  return {
    'text-blue-800': status === 'To Do',
    'text-yellow-800': status === 'In Progress',
    'text-green-800': status === 'Done',
  };
});

// Computed property for status translation key
const statusTranslationKey = computed(() => {
  const status = props.data?.status || 'To Do';
  const keyMap = {
    'To Do': 'todo',
    'In Progress': 'inProgress',
    'Done': 'done'
  };
  return `ticket.statuses.${keyMap[status]}`;
});
</script>
