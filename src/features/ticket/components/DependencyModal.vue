<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-[400px] space-y-4">
      <h2 class="text-lg font-semibold">{{ $t('dependency.confirm') }}</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm">{{ $t('dependency.type') }}:</label>
          <select v-model="dependency.type" required class="w-full p-2 border rounded focus:ring focus:ring-blue-200">
            <option value="hard">{{ $t('dependency.types.hard') }}</option>
            <option value="soft">{{ $t('dependency.types.soft') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm">{{ $t('dependency.note') }}:</label>
          <textarea v-model="dependency.note" class="w-full p-2 border rounded focus:ring focus:ring-blue-200"></textarea>
        </div>
        <div class="flex gap-2">
          <Button type="submit">{{ $t('common.save') }}</Button>
          <Button variant="outline" @click="emit('close')">{{ $t('common.close') }}</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '@shared/components/ui/Button.vue';
const emit = defineEmits(['save', 'close']);

const dependency = ref({
  type: 'hard',
  note: '',
});

const submit = () => {
  emit('save', { ...dependency.value });
};
</script>

