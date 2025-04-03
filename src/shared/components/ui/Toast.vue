<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed right-4 top-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-center">
          <div
            class="flex-shrink-0"
            :class="{
              'text-green-400': type === 'success',
              'text-red-400': type === 'error',
              'text-yellow-400': type === 'warning',
              'text-blue-400': type === 'info'
            }"
          >
            <i
              :class="{
                'fas fa-check-circle': type === 'success',
                'fas fa-exclamation-circle': type === 'error',
                'fas fa-exclamation-triangle': type === 'warning',
                'fas fa-info-circle': type === 'info'
              }"
            ></i>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              @click="show = false"
            >
              <span class="sr-only">Close</span>
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
});

const emit = defineEmits(['update:show']);

const show = ref(props.show);

watch(() => props.show, (newValue) => {
  show.value = newValue;
});

watch(show, (newValue) => {
  emit('update:show', newValue);
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
