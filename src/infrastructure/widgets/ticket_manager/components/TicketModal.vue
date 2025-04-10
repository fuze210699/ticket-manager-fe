<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[500px] space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight">{{ t('ticket.add') }}</h2>
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
          <label for="ticket-code" class="text-sm font-medium">
            {{ t('ticket.code') }}
            <span class="text-red-500">*</span>
          </label>
          <input
            id="ticket-code"
            v-model="ticket.code"
            required
            placeholder="TMF-XXX"
            :aria-label="t('ticket.code')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="space-y-2">
          <label for="ticket-title" class="text-sm font-medium">
            {{ t('ticket.title') }}
            <span class="text-red-500">*</span>
          </label>
          <input
            id="ticket-title"
            v-model="ticket.title"
            required
            :placeholder="t('ticket.titlePlaceholder')"
            :aria-label="t('ticket.title')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="space-y-2">
          <label for="ticket-link" class="text-sm font-medium">
            {{ t('ticket.link') }}
          </label>
          <input
            id="ticket-link"
            v-model="ticket.link"
            type="url"
            :placeholder="t('ticket.linkPlaceholder')"
            :aria-label="t('ticket.link')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="space-y-2">
          <label for="ticket-milestone" class="text-sm font-medium">
            {{ t('ticket.milestone') }}
            <span class="text-red-500">*</span>
          </label>
          <select
            id="ticket-milestone"
            v-model="ticket.milestone"
            required
            :aria-label="t('ticket.milestone')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="" disabled>{{ t('ticket.selectMilestone') }}</option>
            <option v-for="m in milestones" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label for="ticket-status" class="text-sm font-medium">
            {{ t('ticket.status') }}
          </label>
          <select
            id="ticket-status"
            v-model="ticket.status"
            :aria-label="t('ticket.status')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="To Do">{{ t('ticket.statuses.todo') }}</option>
            <option value="In Progress">{{ t('ticket.statuses.inProgress') }}</option>
            <option value="Done">{{ t('ticket.statuses.done') }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label for="ticket-priority" class="text-sm font-medium">
            {{ t('ticket.priority') }}
          </label>
          <select
            id="ticket-priority"
            v-model="ticket.priority"
            :aria-label="t('ticket.priority')"
            class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="high">{{ t('ticket.priorities.high') }}</option>
            <option value="medium">{{ t('ticket.priorities.medium') }}</option>
            <option value="low">{{ t('ticket.priorities.low') }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="ticket-estimate" class="text-sm font-medium">
              {{ t('ticket.estimateTime') }}
            </label>
            <div class="relative">
              <input
                id="ticket-estimate"
                v-model="ticket.estimateTime"
                type="number"
                min="0"
                step="0.5"
                :aria-label="t('ticket.estimateTime')"
                class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class="absolute right-3 top-2.5 text-sm text-gray-500">h</span>
            </div>
          </div>
          <div class="space-y-2">
            <label for="ticket-actual" class="text-sm font-medium">
              {{ t('ticket.actualTime') }}
            </label>
            <div class="relative">
              <input
                id="ticket-actual"
                v-model="ticket.actualTime"
                type="number"
                min="0"
                step="0.5"
                :aria-label="t('ticket.actualTime')"
                class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class="absolute right-3 top-2.5 text-sm text-gray-500">h</span>
            </div>
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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@core/ui/Button.vue';
import router from '@infrastructure/router';
import { generateUUID } from '@core/utils/helper';

const { t } = useI18n();
const emit = defineEmits(['save', 'close']);

const ticket = ref({
  code: '',
  title: '',
  link: '',
  milestone: '',
  status: 'To Do',
  priority: 'medium',
  estimateTime: 0,
  actualTime: 0,
});

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

onMounted(() => {
  loadMilestones();
});

const isFormValid = computed(() => {
  return ticket.value.code.trim() && ticket.value.title.trim() && ticket.value.milestone;
});

const submit = () => {
  if (isFormValid.value) {
    const workspaceId = parseInt(router.currentRoute.value.params.id);
    const savedWorkspaces = localStorage.getItem('workspaces');
    if (savedWorkspaces) {
      const workspaces = JSON.parse(savedWorkspaces);
      const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
      
      if (workspaceIndex !== -1) {
        const newTicket = {
          ...ticket.value,
          id: generateUUID(),
          code: ticket.value.code.trim(),
          title: ticket.value.title.trim(),
          link: ticket.value.link.trim(),
          type: 'ticket',
          workspaceId,
        };

        // Create a new ticket element for VueFlow
        const ticketElement = {
          id: newTicket.id,
          type: 'custom',
          position: { x: 250, y: (workspaces[workspaceIndex].elements?.length || 0) * 100 + 50 },
          data: newTicket,
          draggable: true,
          connectable: true,
          selectable: true,
          class: 'ticket-node',
        };

        // Add the new ticket element to workspace elements
        if (!workspaces[workspaceIndex].elements) {
          workspaces[workspaceIndex].elements = [];
        }
        workspaces[workspaceIndex].elements.push(ticketElement);

        // Save back to localStorage
        localStorage.setItem('workspaces', JSON.stringify(workspaces));

        // Emit the new ticket for parent component
        emit('save', ticketElement);
      }
    }
  }
};
</script>
