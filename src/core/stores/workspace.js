import { defineStore } from 'pinia';

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: [],
    currentWorkspace: null,
  }),

  actions: {
    addWorkspace(workspace) {
      const newWorkspace = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...workspace,
      };
      this.workspaces.push(newWorkspace);
      return newWorkspace;
    },

    getWorkspaceById(id) {
      return this.workspaces.find(workspace => workspace.id === id);
    },

    getAllWorkspaces() {
      return this.workspaces;
    },

    setCurrentWorkspace(workspace) {
      this.currentWorkspace = workspace;
    },

    updateWorkspace(id, updates) {
      const index = this.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        this.workspaces[index] = { ...this.workspaces[index], ...updates };
        if (this.currentWorkspace?.id === id) {
          this.currentWorkspace = this.workspaces[index];
        }
      }
    },

    deleteWorkspace(id) {
      const index = this.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        this.workspaces.splice(index, 1);
        if (this.currentWorkspace?.id === id) {
          this.currentWorkspace = null;
        }
      }
    },
  },
});
