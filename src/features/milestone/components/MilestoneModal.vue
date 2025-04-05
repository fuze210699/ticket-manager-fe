<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[500px] space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight">{{ t('milestone.add') }}</h2>
        <button
          class="text-gray-500 hover:text-gray-900 cursor-pointer"
          :aria-label="t('common.close')"
          @click="emit('close')"
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
            class="h-4 w-4"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <label for="milestone-name" class="text-sm font-medium">
            {{ t('milestone.title') }}
            <span class="text-red-500">*</span>
          </label>
          <input
            id="milestone-name"
            v-model="milestone.name"
            type="text"
            required
            :placeholder="t('milestone.placeholder.title')"
            :aria-label="t('milestone.title')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="space-y-2">
          <label for="milestone-description" class="text-sm font-medium">
            {{ t('milestone.description') }}
          </label>
          <textarea
            id="milestone-description"
            v-model="milestone.description"
            :placeholder="t('milestone.placeholder.description')"
            :aria-label="t('milestone.description')"
            rows="3"
            class="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="milestone-start" class="text-sm font-medium">
              {{ t('milestone.startTime') }}
              <span class="text-red-500">*</span>
            </label>
            <input
              id="milestone-start"
              v-model="milestone.startTime"
              type="datetime-local"
              required
              :aria-label="t('milestone.startTime')"
              class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="milestone-end" class="text-sm font-medium">
              {{ t('milestone.endTime') }}
              <span class="text-red-500">*</span>
            </label>
            <input
              id="milestone-end"
              v-model="milestone.endTime"
              type="datetime-local"
              required
              :aria-label="t('milestone.endTime')"
              class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <Button variant="secondary" :aria-label="t('common.cancel')" @click="emit('close')">
            {{ t('common.cancel') }}
          </Button>
          <Button type="submit" :disabled="!isFormValid" :aria-label="t('common.save')">
            {{ t('common.save') }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@core/ui/Button.vue';
import { useMilestoneStore } from '@core/stores/milestone';

const { t } = useI18n();
const emit = defineEmits(['close', 'save']);
const milestoneStore = useMilestoneStore();

const milestone = ref({
  name: '',
  description: '',
  startTime: '',
  endTime: '',
});

const isFormValid = computed(() => {
  return (
    milestone.value.name.trim() &&
    milestone.value.startTime &&
    milestone.value.endTime &&
    new Date(milestone.value.startTime) <= new Date(milestone.value.endTime)
  );
});

const handleSave = () => {
  if (isFormValid.value) {
    const newMilestone = milestoneStore.addMilestone({
      ...milestone.value,
      name: milestone.value.name.trim(),
      description: milestone.value.description.trim(),
    });
    emit('save', newMilestone);
    milestone.value = {
      name: '',
      description: '',
      startTime: '',
      endTime: '',
    };
  }
};
</script>
