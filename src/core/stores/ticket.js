import { defineStore } from 'pinia';
import { ref } from 'vue';
import { generateUUID } from '@core/utils/helper';

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref([]);

  const addTicket = ticket => {
    const newTicket = {
      id: generateUUID(),
      ...ticket,
      createdAt: new Date().toISOString(),
    };
    tickets.value.push(newTicket);
    return newTicket;
  };

  const getTicketById = id => {
    return tickets.value.find(t => t.id === id);
  };

  const getAllTickets = () => {
    return tickets.value;
  };

  return {
    tickets,
    addTicket,
    getTicketById,
    getAllTickets,
  };
});
