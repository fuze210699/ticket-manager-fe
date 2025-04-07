<template>
  <EditModeWidget v-if="isEditMode" :icon="Ticket" @remove="$emit('remove')" />
  <div v-else class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm bg-opacity-90"
      >
        <div class="p-8">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div class="space-y-1">
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
                {{ $t('home.title') }}
              </h1>
              <p class="text-base text-gray-600">{{ $t('home.subtitle') }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                class="group inline-flex items-center px-4 py-2.5 bg-emerald-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out hover:shadow-md"
                @click="handleImport"
              >
                <svg
                  class="w-4 h-4 mr-2 transform group-hover:translate-y-[-1px] transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {{ $t('home.importWorkspace') }}
              </button>
              <button
                class="group inline-flex items-center px-4 py-2.5 bg-violet-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-violet-700 focus:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200 ease-in-out hover:shadow-md"
                @click="handleExport"
              >
                <svg
                  class="w-4 h-4 mr-2 transform group-hover:translate-y-[-1px] transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {{ $t('home.exportWorkspace') }}
              </button>
              <button
                class="group inline-flex items-center px-4 py-2.5 bg-blue-600 border border-transparent rounded-lg font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out hover:shadow-md"
                @click="showCreateModal = true"
              >
                <svg
                  class="w-4 h-4 mr-2 transform group-hover:translate-y-[-1px] transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('home.createWorkspace') }}
              </button>
            </div>
          </div>

          <div
            v-if="workspaces.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="workspace in workspaces"
              :key="workspace.id"
              class="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:border-blue-200 hover:-translate-y-0.5"
            >
              <div class="p-6">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3
                      class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
                    >
                      {{ workspace.name }}
                    </h3>
                    <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                      {{ workspace.description }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      :aria-label="$t('workspace.editWorkspace')"
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                      @click="handleEditWorkspace(workspace)"
                    >
                      <Pencil class="w-5 h-5" />
                    </button>
                    <button
                      :aria-label="$t('workspace.deleteWorkspace')"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                      @click="handleDeleteWorkspace(workspace)"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg
                      class="w-4 h-4 mr-1.5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {{ workspace.members }} {{ $t('home.members') }}
                  </div>
                  <button
                    class="group inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-sm"
                    @click="openWorkspace(workspace)"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5 transform group-hover:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {{ $t('home.openWorkspace') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 animate-pulse"
            >
              <svg
                class="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ $t('home.noWorkspacesTitle') }}
            </h3>
            <p class="text-base text-gray-600 max-w-md mx-auto">
              {{ $t('home.noWorkspaces') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <CreateWorkspaceModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateWorkspace"
    />
    <DeleteWorkspaceModal
      :is-open="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
    <EditWorkspaceModal
      v-if="workspaceToEdit"
      :is-open="showEditModal"
      :workspace="workspaceToEdit"
      @close="showEditModal = false"
      @update="handleUpdateWorkspace"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import CreateWorkspaceModal from '@shared/widgets/ticket_manager/components/CreateWorkspaceModal.vue';
import DeleteWorkspaceModal from '@shared/widgets/ticket_manager/components/DeleteWorkspaceModal.vue';
import EditWorkspaceModal from '@shared/widgets/ticket_manager/components/EditWorkspaceModal.vue';
import EditModeWidget from '@/shared/components/widgets/EditModeWidget.vue';
import { Ticket, Trash2, Pencil } from 'lucide-vue-next';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['remove']);
const router = useRouter();
const { t } = useI18n();
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const workspaceToDelete = ref(null);
const workspaceToEdit = ref(null);

const workspaces = ref([]);

// Load workspaces from localStorage on component mount
const loadWorkspaces = () => {
  const savedWorkspaces = localStorage.getItem('workspaces');
  if (savedWorkspaces) {
    workspaces.value = JSON.parse(savedWorkspaces);
  }
};

// Save workspaces to localStorage
const saveWorkspaces = workspaces => {
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
};

// Load workspaces when component mounts
loadWorkspaces();

const openWorkspace = workspace => {
  router.push(`/workspace/${workspace.id}`);
};

const handleCreateWorkspace = workspaceData => {
  // Create new workspace
  const newWorkspace = {
    id: Date.now(), // Use timestamp as unique ID
    ...workspaceData,
    members: 1,
  };

  // Add to workspaces array
  workspaces.value.push(newWorkspace);

  // Save to localStorage
  saveWorkspaces(workspaces.value);
};

const handleDeleteWorkspace = workspace => {
  workspaceToDelete.value = workspace;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (workspaceToDelete.value) {
    // Remove workspace from array
    workspaces.value = workspaces.value.filter(w => w.id !== workspaceToDelete.value.id);

    // Save to localStorage
    saveWorkspaces(workspaces.value);

    // Close modal
    showDeleteModal.value = false;
    workspaceToDelete.value = null;
  }
};

const handleExport = () => {
  const data = localStorage.getItem('workspaces');
  if (data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspaces-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const handleImport = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          // Parse the JSON string from the file
          const importedData = JSON.parse(event.target.result);

          // If the imported data is a string (from localStorage), parse it again
          const data = typeof importedData === 'string' ? JSON.parse(importedData) : importedData;

          // Validate data structure
          if (Array.isArray(data)) {
            // Validate each workspace has required fields
            const isValidWorkspace = workspace => {
              return (
                typeof workspace === 'object' &&
                workspace !== null &&
                typeof workspace.id === 'number' &&
                typeof workspace.name === 'string' &&
                typeof workspace.members === 'number' &&
                Array.isArray(workspace.elements || [])
              );
            };

            const validWorkspaces = data.filter(isValidWorkspace);

            if (validWorkspaces.length === 0) {
              alert(t('home.invalidImportData'));
              return;
            }

            // Merge with existing workspaces, avoiding duplicates by ID
            const existingWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
            const existingIds = new Set(existingWorkspaces.map(w => w.id));

            const newWorkspaces = validWorkspaces.filter(w => !existingIds.has(w.id));
            const mergedWorkspaces = [...existingWorkspaces, ...newWorkspaces];

            localStorage.setItem('workspaces', JSON.stringify(mergedWorkspaces));
            workspaces.value = mergedWorkspaces;
          } else {
            alert(t('home.invalidImportData'));
          }
        } catch (error) {
          console.error('Import error:', error);
          alert(t('home.importError'));
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

const handleEditWorkspace = workspace => {
  if (!workspace) return;
  workspaceToEdit.value = workspace;
  showEditModal.value = true;
};

const handleUpdateWorkspace = updatedWorkspace => {
  const index = workspaces.value.findIndex(w => w.id === updatedWorkspace.id);
  if (index !== -1) {
    workspaces.value[index] = updatedWorkspace;
    saveWorkspaces(workspaces.value);
  }
};
</script>
