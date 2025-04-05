<template>
  <div class="h-screen flex flex-col">
    <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      <button
        class="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
        :aria-label="t('workspace.back')"
        @click="goBack"
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
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span class="text-sm">{{ t('workspace.back') }}</span>
      </button>
      <input
        v-model="workspaceName"
        type="text"
        :placeholder="t('workspace.namePlaceholder')"
        :aria-label="t('home.workspaceName')"
        class="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      />
      <button
        class="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
        :aria-label="t('workspace.addMilestone')"
        @click="openMilestoneModal"
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
          aria-hidden="true"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
        <span class="text-sm">{{ t('workspace.addMilestone') }}</span>
      </button>
    </div>
    <div class="h-screen flex-1 flex flex-col">
      <TaskBar @add-ticket="openTicketModal" />

      <VueFlow
        v-model="elements"
        :pan-on-scroll="true"
        :pan-on-drag="true"
        :nodes-draggable="true"
        :nodes-connectable="true"
        :elements-selectable="true"
        :zoom-on-scroll="true"
        :zoom-on-pinch="true"
        :zoom-on-double-click="true"
        :min-zoom="0.2"
        :max-zoom="4"
        class="flex-1"
        @edge-create="handleEdgeCreate"
        @node-click="openTicketDetails"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <template #node-custom="props">
          <CustomNode v-bind="props" />
        </template>
        <template #edge-custom="props">
          <CustomEdge v-bind="props" />
        </template>
        <MiniMap />
        <Controls />
      </VueFlow>

      <TicketModal v-if="showTicketModal" @close="closeTicketModal" @save="saveTicket" />

      <MilestoneModal
        v-if="showMilestoneModal"
        @close="closeMilestoneModal"
        @save="saveMilestone"
      />

      <DependencyModal
        v-if="showDependencyModal"
        @close="closeDependencyModal"
        @save="saveDependency"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import TaskBar from '@shared/components/layout/TaskBar.vue';
import TicketModal from '@features/ticket/components/TicketModal.vue';
import MilestoneModal from '@features/milestone/components/MilestoneModal.vue';
import DependencyModal from '@features/ticket/components/DependencyModal.vue';
import CustomNode from '@core/ui/CustomNode.vue';
import CustomEdge from '@core/ui/CustomEdge.vue';
import { generateUUID } from '@core/utils/helper';
import router from '@infrastructure/router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const elements = ref([]);
const workspaceName = ref('');

const showTicketModal = ref(false);
const showMilestoneModal = ref(false);
const showDependencyModal = ref(false);
const selectedEdge = ref(null);

const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject, onNodeDoubleClick } =
  useVueFlow();

onNodeDoubleClick(event => {
  event.instance.zoomIn();
});

onInit(vueFlowInstance => {
  vueFlowInstance.fitView();
});

onConnect(connection => {
  addEdges(connection);
});

const openTicketModal = () => {
  showTicketModal.value = true;
};

const closeTicketModal = () => {
  showTicketModal.value = false;
};

const openMilestoneModal = () => {
  showMilestoneModal.value = true;
};

const closeMilestoneModal = () => {
  showMilestoneModal.value = false;
};

const closeDependencyModal = () => {
  showDependencyModal.value = false;
  selectedEdge.value = null;
};

const saveTicket = ticket => {
  const newId = generateUUID();
  elements.value.push({
    id: newId,
    type: 'custom',
    label: ticket.name,
    position: { x: 250, y: elements.value.length * 100 + 50 },
    data: { ...ticket, id: newId },
  });
  closeTicketModal();
};

const saveMilestone = milestone => {
  const newId = generateUUID();
  elements.value.push({
    id: newId,
    type: 'custom',
    label: milestone.name,
    position: { x: 250, y: elements.value.length * 100 + 50 },
    data: { ...milestone, id: newId, isMilestone: true },
  });
  closeMilestoneModal();
};

const handleEdgeCreate = edge => {
  showDependencyModal.value = true;
  selectedEdge.value = edge;
};

const saveDependency = dependency => {
  if (selectedEdge.value) {
    const edgeId = `e${selectedEdge.value.source}-${selectedEdge.value.target}`;
    elements.value.push({
      id: edgeId,
      source: selectedEdge.value.source,
      target: selectedEdge.value.target,
      type: 'custom',
      data: dependency,
    });
  }
  closeDependencyModal();
};

const openTicketDetails = event => {
  console.log(t('workspace.ticketDetails') + ':', event.node);
};

const goBack = () => {
  router.push('/home');
};
</script>
