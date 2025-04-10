<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-[500px] space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight">{{ t('dependency.confirm') }}</h2>
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
      <form class="space-y-4" @submit.prevent="submit">
        <div class="space-y-2">
          <label for="dependency-type" class="text-sm font-medium">
            {{ t('dependency.type') }}
            <span class="text-red-500">*</span>
          </label>
          <select
            id="dependency-type"
            v-model="dependency.type"
            required
            :aria-label="t('dependency.type')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="hard">{{ t('dependency.types.hard') }}</option>
            <option value="soft">{{ t('dependency.types.soft') }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label for="dependency-note" class="text-sm font-medium">
            {{ t('dependency.note') }}
          </label>
          <textarea
            id="dependency-note"
            v-model="dependency.note"
            :placeholder="t('dependency.notePlaceholder')"
            :aria-label="t('dependency.note')"
            rows="3"
            class="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          ></textarea>
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

const { t } = useI18n();
const emit = defineEmits(['save', 'close']);

const dependency = ref({
  type: 'hard',
  note: '',
});

const isFormValid = computed(() => {
  return dependency.value.type && dependency.value.type.trim();
});

const submit = () => {
  if (isFormValid.value) {
    emit('save', {
      ...dependency.value,
      note: dependency.value.note.trim(),
    });
  }
};
</script>
