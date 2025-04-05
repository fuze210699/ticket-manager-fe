<template>
  <div
    class="relative min-h-[16rem] h-full w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl group"
  >
    <!-- Widget Icon -->
    <div class="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-600">
      <component :is="icon" class="w-12 h-12" />
    </div>

    <!-- Hover Overlay -->
    <div
      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 rounded-xl"
    >
      <!-- Drag Handle -->
      <div class="cursor-move text-white hover:text-blue-500 transition-colors duration-200 cursor-move">
        <GripVertical class="w-6 h-6" />
      </div>
      <!-- Delete Button -->
      <button
        class="text-white hover:text-red-500 transition-colors duration-200 cursor-pointer"
        @click="$emit('remove')"
      >
        <Trash2 class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { GripVertical, Trash2 } from 'lucide-vue-next';

defineProps({
  icon: {
    type: [Object, Function],
    required: true,
  },
});

defineEmits(['remove']);
</script>
