<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">{{ t('workspace.filter') }}</h3>
      <div class="space-y-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t('ticket.status')
          }}</label>
          <select
            v-model="localFilters.status"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="todo">{{ t('ticket.todo') }}</option>
            <option value="in_progress">{{ t('ticket.inProgress') }}</option>
            <option value="done">{{ t('ticket.done') }}</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t('ticket.priority')
          }}</label>
          <select
            v-model="localFilters.priority"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="high">{{ t('ticket.high') }}</option>
            <option value="medium">{{ t('ticket.medium') }}</option>
            <option value="low">{{ t('ticket.low') }}</option>
          </select>
        </div>

        <!-- Due Date Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t('ticket.dueDate')
          }}</label>
          <input
            v-model="localFilters.dueDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <!-- Milestone Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t('ticket.milestone')
          }}</label>
          <select
            v-model="localFilters.milestone"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">{{ t('common.all') }}</option>
            <option v-for="m in milestones" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
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
          @click="handleApply"
        >
          {{ t('common.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@infrastructure/router';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'apply']);

const localFilters = ref({ ...props.filters });
const milestones = ref([]);

// Load milestones from localStorage
const loadMilestones = () => {
  const savedWorkspaces = localStorage.getItem('workspaces');
  if (savedWorkspaces) {
    const workspaces = JSON.parse(savedWorkspaces);
    const workspaceId = parseInt(router.currentRoute.value.params.id);
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace && workspace.elements) {
      // Filter out milestone elements
      milestones.value = workspace.elements
        .filter(element => element.data?.type === 'milestone')
        .map(element => element.data);
    }
  }
};

loadMilestones();

// Watch for changes in props.filters
watch(
  () => props.filters,
  newFilters => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);

const handleCancel = () => {
  emit('update:modelValue', false);
};

const handleApply = () => {
  emit('apply', localFilters.value);
  emit('update:modelValue', false);
};
</script> 