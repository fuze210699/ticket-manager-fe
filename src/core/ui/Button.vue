<template>
  <button
    :class="[
      'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-gray-800 text-white hover:bg-gray-700': variant === 'default',
        'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
        'border border-gray-300 bg-white hover:bg-gray-100': variant === 'outline',
        'hover:bg-gray-100': variant === 'ghost',
        'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        'bg-gray-800 text-white hover:bg-gray-700': variant === 'primary',
        'text-gray-800 underline-offset-4 hover:bg-gray-100': variant === 'link',
        'h-9 px-3': size === 'sm',
        'h-10 px-4': size === 'default',
        'h-11 px-8': size === 'lg',
        'h-9 w-9': size === 'icon',
      },
      className,
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: value => {
      return [
        'default',
        'destructive',
        'outline',
        'ghost',
        'secondary',
        'primary',
        'link',
      ].includes(value);
    },
  },
  size: {
    type: String,
    default: 'default',
    validator: value => {
      return ['default', 'sm', 'lg', 'icon'].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
});

defineEmits(['click']);
</script>
