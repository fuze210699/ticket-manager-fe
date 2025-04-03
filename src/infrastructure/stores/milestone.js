import { defineStore } from 'pinia';
import { ref } from 'vue';
import { generateUUID } from "@shared/utils/helper";

export const useMilestoneStore = defineStore('milestone', () => {
  const milestones = ref([]);

  const addMilestone = (milestone) => {
    const newMilestone = {
      id: generateUUID(),
      ...milestone,
      createdAt: new Date().toISOString()
    };
    milestones.value.push(newMilestone);
    return newMilestone;
  };

  const getMilestoneById = (id) => {
    return milestones.value.find(m => m.id === id);
  };

  const getAllMilestones = () => {
    return milestones.value;
  };

  const updateMilestone = (id, milestone) => {
    const index = milestones.value.findIndex(m => m.id === id);
    if (index !== -1) {
      milestones.value[index] = {
        ...milestones.value[index],
        ...milestone,
        updatedAt: new Date().toISOString()
      };
      return milestones.value[index];
    }
    return null;
  };

  const deleteMilestone = (id) => {
    const index = milestones.value.findIndex(m => m.id === id);
    if (index !== -1) {
      milestones.value.splice(index, 1);
      return true;
    }
    return false;
  };

  return {
    milestones,
    addMilestone,
    getMilestoneById,
    getAllMilestones,
    updateMilestone,
    deleteMilestone
  };
}); 
