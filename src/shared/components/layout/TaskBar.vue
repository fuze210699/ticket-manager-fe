<template>
  <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center">
    <div class="flex items-center gap-1">
      <button @click="emit('addTicket')" class="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="text-sm">{{ $t('ticket.add') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['addTicket']);
</script>

