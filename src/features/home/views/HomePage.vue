<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 text-gray-900">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">{{ $t('home.title') }}</h1>
              <p class="mt-1 text-sm text-gray-500">{{ $t('home.subtitle') }}</p>
            </div>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ $t('home.createWorkspace') }}
            </button>
          </div>

          <div v-if="workspaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="workspace in workspaces"
              :key="workspace.id"
              class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900">{{ workspace.name }}</h3>
                <p class="mt-2 text-sm text-gray-500">{{ workspace.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-sm text-gray-500">{{ workspace.members }} {{ $t('home.members') }}</span>
                  <button
                    @click="openWorkspace(workspace)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {{ $t('home.openWorkspace') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('home.noWorkspacesTitle') }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ $t('home.noWorkspaces') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CreateWorkspaceModal
    :is-open="showCreateModal"
    @close="showCreateModal = false"
    @create="handleCreateWorkspace"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CreateWorkspaceModal from '@features/workspace/components/CreateWorkspaceModal.vue'

const router = useRouter()
const showCreateModal = ref(false)

const workspaces = ref([
  {
    id: 1,
    name: 'Project A',
    description: 'Description for Project A',
    members: 5
  },
  {
    id: 2,
    name: 'Project B',
    description: 'Description for Project B',
    members: 3
  }
])

const openWorkspace = (workspace) => {
  router.push(`/workspace/${workspace.id}`)
}

const handleCreateWorkspace = (workspaceData) => {
  // TODO: Implement workspace creation
  console.log('Creating workspace:', workspaceData)
  // Add new workspace to the list
  workspaces.value.push({
    id: workspaces.value.length + 1,
    ...workspaceData,
    members: 1
  })
}
</script>

