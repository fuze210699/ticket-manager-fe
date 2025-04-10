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
      <TaskBar @add-ticket="openTicketModal" @filter-change="applyFilters" />

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
        <template #node-ticket-node="props">
          <CustomNode v-bind="props.data" />
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
import { ref, watch } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import TaskBar from '@infrastructure/widgets/ticket_manager/components/TaskBar.vue';
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
const milestones = ref([]);
const workspaceName = ref('');
const currentFilters = ref({
  status: '',
  priority: '',
  dueDate: '',
  milestone: ''
});

// Load workspace data from localStorage
const loadWorkspaceData = () => {
  const savedWorkspaces = localStorage.getItem('workspaces');
  if (savedWorkspaces) {
    const workspaces = JSON.parse(savedWorkspaces);
    const workspaceId = parseInt(router.currentRoute.value.params.id);
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      workspaceName.value = workspace.name;
      if (workspace.elements) {
        const { tickets, milestones: savedMilestones } = workspace.elements.reduce(
          (acc, element) => {
            if (element.data?.type === 'milestone') {
              acc.milestones.push(element.data);
            } else if (element.data?.type === 'ticket') {
              // Ensure all required VueFlow node properties are present
              acc.tickets.push({
                id: element.id,
                type: 'ticket-node',
                label: element.data.name || element.data.label,
                position: element.position || { x: 0, y: 0 },
                data: {
                  ...element.data,
                  id: element.id,
                  type: 'ticket',
                  workspaceId,
                  name: element.data.name || element.data.label,
                  description: element.data.description || '',
                  status: element.data.status || 'TODO',
                  priority: element.data.priority || 'MEDIUM',
                  dueDate: element.data.dueDate || null,
                  assignee: element.data.assignee || null,
                  dependencies: element.data.dependencies || [],
                  createdAt: element.data.createdAt || new Date().toISOString(),
                  updatedAt: element.data.updatedAt || new Date().toISOString(),
                },
                draggable: true,
                connectable: true,
                selectable: true,
                class: 'ticket-node',
              });
            }
            return acc;
          },
          { tickets: [], milestones: [] }
        );

        elements.value = tickets;
        milestones.value = savedMilestones;
      }
    }
  }
};

// Watch for route changes
watch(
  () => router.currentRoute.value,
  () => {
    loadWorkspaceData();
  },
  { immediate: true }
);

// Save workspace data to localStorage
const saveWorkspaceData = () => {
  const savedWorkspaces = localStorage.getItem('workspaces');
  if (savedWorkspaces) {
    const workspaces = JSON.parse(savedWorkspaces);
    const workspaceId = parseInt(router.currentRoute.value.params.id);
    const index = workspaces.findIndex(w => w.id === workspaceId);
    if (index !== -1) {
      // Combine tickets and milestones
      const allElements = [
        ...elements.value,
        ...milestones.value.map(milestone => ({
          id: milestone.id,
          type: 'milestone-node',
          data: milestone,
        })),
      ];

      // Update workspace data
      workspaces[index] = {
        ...workspaces[index],
        name: workspaceName.value,
        elements: allElements,
      };

      // Save to localStorage
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
    }
  }
};

// Load data when component mounts
loadWorkspaceData();

// Save data when workspace name changes
watch(workspaceName, () => {
  saveWorkspaceData();
});

// Save data when elements or milestones change
watch(
  [elements, milestones],
  () => {
    saveWorkspaceData();
  },
  { deep: true }
);

const showTicketModal = ref(false);
const showMilestoneModal = ref(false);
const showDependencyModal = ref(false);
const selectedEdge = ref(null);

const { onInit, onConnect, addEdges, onNodeDoubleClick } = useVueFlow();

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
  const workspaceId = parseInt(router.currentRoute.value.params.id);
  const newNode = {
    id: newId,
    type: 'ticket-node',
    label: ticket.name,
    position: { x: 250, y: elements.value.length * 100 + 50 },
    data: {
      ...ticket,
      id: newId,
      type: 'ticket',
      workspaceId,
    },
    // Add required VueFlow node properties
    draggable: true,
    connectable: true,
    selectable: true,
    class: 'ticket-node',
  };

  // Add the new node to elements
  elements.value = [...elements.value, newNode];
  closeTicketModal();
};

const saveMilestone = milestone => {
  const newId = generateUUID();
  const workspaceId = parseInt(router.currentRoute.value.params.id);
  const newMilestone = {
    id: newId,
    name: milestone.name,
    description: milestone.description,
    dueDate: milestone.dueDate,
    type: 'milestone',
    workspaceId,
  };

  // Add the new milestone to milestones array
  milestones.value = [...milestones.value, newMilestone];

  // Save to localStorage immediately
  const savedWorkspaces = localStorage.getItem('workspaces');
  if (savedWorkspaces) {
    const workspaces = JSON.parse(savedWorkspaces);
    const index = workspaces.findIndex(w => w.id === workspaceId);
    if (index !== -1) {
      // Create a milestone element for storage
      const milestoneElement = {
        id: newId,
        type: 'milestone-node',
        data: newMilestone,
      };

      // Add to existing elements
      const existingElements = workspaces[index].elements || [];
      workspaces[index].elements = [...existingElements, milestoneElement];

      // Save back to localStorage
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
    }
  }

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

const goBack = async () => {
  await router.push('/home');
  // Force reload the page to ensure data is refreshed
  window.location.reload();
};

// Apply filters to elements
const applyFilters = (filters) => {
  currentFilters.value = filters;
  
  // If all filters are empty, show all nodes
  if (Object.values(filters).every(filter => filter === '')) {
    elements.value = elements.value.map(element => ({
      ...element,
      hidden: false
    }));
    return;
  }

  // Update hidden property for each element based on filters
  elements.value = elements.value.map(element => {
    if (element.data?.data?.type === 'ticket') {
      // Skip empty filters
      const matchesStatus = filters.status === '' || element.data.data.status.toLowerCase() === filters.status.toLowerCase();
      const matchesPriority = filters.priority === '' || element.data.data.priority.toLowerCase() === filters.priority.toLowerCase();
      const matchesDueDate = filters.dueDate === '' || element.data.data.dueDate === filters.dueDate;
      // Show ticket if milestone filter is empty or ticket's milestone matches the filter
      const matchesMilestone = filters.milestone === '' || (element.data.data.milestone && element.data.data.milestone === filters.milestone);

      return {
        ...element,
        hidden: !(matchesStatus && matchesPriority && matchesDueDate && matchesMilestone)
      };
    }
    return element;
  });
};
</script>
