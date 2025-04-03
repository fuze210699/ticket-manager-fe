<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-1">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight">{{ $t('ticket.add') }}</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-900 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form @submit.prevent="submit" class="space-y-1">
        <div class="space-y-1">
          <label class="text-sm font-medium">{{ $t('ticket.code') }}:</label>
          <input v-model="ticket.code" required placeholder="TMF-XXX"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium">{{ $t('ticket.title') }}:</label>
          <input v-model="ticket.title" required
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium">{{ $t('ticket.link') }}:</label>
          <input v-model="ticket.link"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium">{{ $t('ticket.milestone') }}:</label>
          <select v-model="ticket.milestone" required
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
            <option v-for="m in milestones" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium">{{ $t('ticket.status') }}:</label>
          <select v-model="ticket.status"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
            <option value="To Do">{{ $t('ticket.statuses.todo') }}</option>
            <option value="In Progress">{{ $t('ticket.statuses.inProgress') }}</option>
            <option value="Done">{{ $t('ticket.statuses.done') }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-1">
          <div class="space-y-1">
            <label class="text-sm font-medium">{{ $t('ticket.estimateTime') }}:</label>
            <input v-model="ticket.estimateTime" type="number" min="0" step="0.5"
              class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">{{ $t('ticket.actualTime') }}:</label>
            <input v-model="ticket.actualTime" type="number" min="0" step="0.5"
              class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </div>
        <div class="flex justify-end gap-1 mt-7 gap-3">
          <Button variant="secondary" @click="emit('close')">{{ $t('common.close') }}</Button>
          <Button type="submit">{{ $t('common.save') }}</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from '@shared/components/ui/Button.vue';
import { useMilestoneStore } from '@infrastructure/stores/milestone';
import { useTicketStore } from '@infrastructure/stores/ticket';

const emit = defineEmits(['save', 'close']);
const milestoneStore = useMilestoneStore();
const ticketStore = useTicketStore();

const ticket = ref({
  code: '',
  title: '',
  link: '',
  milestone: '',
  status: 'To Do',
  estimateTime: 0,
  actualTime: 0,
});

const milestones = computed(() => milestoneStore.getAllMilestones());

const submit = () => {
  const newTicket = ticketStore.addTicket(ticket.value);
  emit('save', newTicket);
};
</script>

