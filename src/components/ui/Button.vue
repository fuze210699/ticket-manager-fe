<template>
  <button :class="buttonClasses" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'sm', 'lg'].includes(value),
  },
});

const buttonClasses = computed(() => ({
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer': true,
  'bg-blue-600 text-white hover:bg-blue-700': props.variant === 'default',
  'border border-gray-300 bg-transparent hover:bg-gray-100': props.variant === 'outline',
  'bg-transparent hover:bg-gray-100': props.variant === 'ghost',
  'h-10 px-4': props.size === 'default',
  'h-8 px-3': props.size === 'sm',
  'h-12 px-6': props.size === 'lg',
}));
</script>
