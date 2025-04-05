<template>
  <EditModeWidget v-if="isEditMode" :icon="Calendar" @remove="$emit('remove')" />
  <div v-else class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800">
    <!-- Quick Add Toolbar -->
    <div class="flex items-center gap-2 p-2 border-b bg-gray-50 dark:bg-gray-700">
      <button
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
        @click="quickAddEvent('meeting')"
      >
        <Users class="w-4 h-4" />
        {{ $t('common.meeting') }}
      </button>
      <button
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 hover:bg-green-200"
        @click="quickAddEvent('task')"
      >
        <CheckCircle2 class="w-4 h-4" />
        {{ $t('common.task') }}
      </button>
      <button
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        @click="quickAddEvent('reminder')"
      >
        <Bell class="w-4 h-4" />
        {{ $t('common.reminder') }}
      </button>
      <button
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
        @click="quickAddEvent('personal')"
      >
        <User class="w-4 h-4" />
        {{ $t('common.personal') }}
      </button>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold">{{ calendarTitle }}</h2>
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="navigateMonth(-1)">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            @click="navigateToday"
          >
            {{ $t('common.today') }}
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="navigateMonth(1)">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <button
            :class="{ 'bg-blue-100 text-blue-600': viewMode === 'month' }"
            class="px-4 py-2 text-sm rounded-md hover:bg-gray-100"
            @click="viewMode = 'month'"
          >
            {{ $t('common.month') }}
          </button>
          <button
            :class="{ 'bg-blue-100 text-blue-600': viewMode === 'week' }"
            class="px-4 py-2 text-sm rounded-md hover:bg-gray-100"
            @click="viewMode = 'week'"
          >
            {{ $t('common.week') }}
          </button>
          <button
            :class="{ 'bg-blue-100 text-blue-600': viewMode === 'day' }"
            class="px-4 py-2 text-sm rounded-md hover:bg-gray-100"
            @click="viewMode = 'day'"
          >
            {{ $t('common.day') }}
          </button>
        </div>
        <button
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="addEvent"
        >
          {{ $t('common.add') }}
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full" @click="toggleSettings">
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 overflow-auto p-4">
      <!-- Week View -->
      <div v-if="viewMode === 'week'" class="h-full flex flex-col">
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div
            v-for="day in weekDays"
            :key="day"
            class="bg-white p-2 text-center text-sm font-medium"
          >
            {{ day }}
          </div>
        </div>
        <div class="flex-1 grid grid-cols-7 gap-px bg-gray-200">
          <div v-for="day in weekDays" :key="day" class="bg-white p-2 min-h-[100px] relative">
            <div class="text-sm font-medium mb-2">{{ day }}</div>
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDay(day)"
                :key="event.id"
                class="p-1 text-xs rounded cursor-pointer truncate"
                :style="{
                  backgroundColor: event.color + '20',
                  borderLeft: `3px solid ${event.color}`,
                }"
                draggable="true"
                @dragstart="onDragStart(event)"
                @dragend="onDragEnd(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day View -->
      <div v-else-if="viewMode === 'day'" class="h-full flex flex-col">
        <div class="grid grid-cols-1 gap-px bg-gray-200">
          <div class="bg-white p-2 text-center text-sm font-medium">
            {{ formatDate(currentDate) }}
          </div>
        </div>
        <div class="flex-1 grid grid-cols-1 gap-px bg-gray-200">
          <div class="bg-white p-2 min-h-[100px] relative">
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDate(currentDate)"
                :key="event.id"
                class="p-1 text-xs rounded cursor-pointer truncate"
                :style="{
                  backgroundColor: event.color + '20',
                  borderLeft: `3px solid ${event.color}`,
                }"
                draggable="true"
                @dragstart="onDragStart(event)"
                @dragend="onDragEnd(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-else class="grid grid-cols-7 gap-px bg-gray-200">
        <div
          v-for="day in weekDays"
          :key="day"
          class="bg-white p-2 text-center text-sm font-medium"
        >
          {{ day }}
        </div>

        <div
          v-for="(day, index) in monthDays"
          :key="index"
          class="bg-white p-2 min-h-[100px] relative"
          :class="{ 'bg-gray-50': !day.isCurrentMonth }"
          @dragover.prevent
          @drop="onDrop($event, day.date)"
        >
          <div class="flex items-center justify-between">
            <span :class="{ 'text-gray-400': !day.isCurrentMonth }">{{ day.day }}</span>
            <button
              v-if="day.isCurrentMonth"
              class="p-1 hover:bg-gray-100 rounded-full"
              @click="addEvent(day.date)"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="mt-1 space-y-1">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="p-1 text-xs rounded cursor-pointer truncate"
              :style="{
                backgroundColor: event.color + '20',
                borderLeft: `3px solid ${event.color}`,
              }"
              draggable="true"
              @click="editEvent(event)"
              @dragstart="onDragStart(event)"
              @dragend="onDragEnd(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Form Modal -->
    <div v-if="showEventForm" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ editingEvent ? $t('common.edit') : $t('common.add') }} {{ $t('common.event') }}
          </h3>
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="closeEventForm">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.title') }}</label>
            <input v-model="eventForm.title" type="text" class="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.description') }}</label>
            <textarea
              v-model="eventForm.description"
              class="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('common.startDate') }}</label>
              <input
                v-model="eventForm.startDate"
                type="datetime-local"
                class="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('common.endDate') }}</label>
              <input
                v-model="eventForm.endDate"
                type="datetime-local"
                class="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input id="allDay" v-model="eventForm.allDay" type="checkbox" class="rounded" />
            <label for="allDay" class="text-sm">{{ $t('common.allDay') }}</label>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.location') }}</label>
            <input v-model="eventForm.location" type="text" class="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.color') }}</label>
            <input v-model="eventForm.color" type="color" class="w-full h-10 rounded-md" />
          </div>
        </div>
        <div class="p-4 border-t flex justify-end gap-2">
          <button
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            @click="closeEventForm"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="saveEvent"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white rounded-lg w-[400px]">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ $t('common.settings') }}</h3>
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="showSettings = false">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.theme') }}</label>
            <select v-model="theme" class="w-full p-2 border rounded-md">
              <option value="light">{{ $t('common.light') }}</option>
              <option value="dark">{{ $t('common.dark') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.view') }}</label>
            <select v-model="view" class="w-full p-2 border rounded-md">
              <option value="month">{{ $t('common.month') }}</option>
              <option value="week">{{ $t('common.week') }}</option>
              <option value="day">{{ $t('common.day') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('common.timezone') }}</label>
            <select v-model="timezone" class="w-full p-2 border rounded-md">
              <option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input id="showWeekends" v-model="showWeekends" type="checkbox" class="rounded" />
            <label for="showWeekends" class="text-sm">{{ $t('common.showWeekends') }}</label>
          </div>
          <div class="flex items-center gap-2">
            <input id="showHolidays" v-model="showHolidays" type="checkbox" class="rounded" />
            <label for="showHolidays" class="text-sm">{{ $t('common.showHolidays') }}</label>
          </div>
        </div>
        <div class="p-4 border-t flex justify-end gap-2">
          <button
            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            @click="showSettings = false"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="saveSettings"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useToast } from '@core/ui/use-toast';
import {
  Calendar,
  Plus,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tag,
  Clock,
  MapPin,
  Users,
  Bell,
  Trash2,
  X,
  ChevronUp,
  User,
  CheckCircle2,
} from 'lucide-vue-next';
import EditModeWidget from './EditModeWidget.vue';

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

const isMinimized = ref(false);
const showSettings = ref(false);
const showEventForm = ref(false);
const editingEvent = ref(null);
const currentDate = ref(new Date());
const selectedDate = ref(null);
const theme = ref('light');
const view = ref('month');
const viewMode = ref('month');
const timezone = ref('Asia/Ho_Chi_Minh');
const showWeekends = ref(true);
const showHolidays = ref(true);

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const eventForm = ref({
  title: '',
  type: 'meeting',
  startTime: '',
  endTime: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  color: '#3b82f6',
  location: '',
  guests: [],
});

const events = ref([]);

const calendarTitle = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add days from previous month
  const prevMonthDays = firstDay.getDay();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
      events: getEventsForDate(date),
    });
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      day: i,
      isCurrentMonth: true,
      events: getEventsForDate(date),
    });
  }

  // Add days from next month
  const nextMonthDays = 6 - lastDay.getDay();
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      day: i,
      isCurrentMonth: false,
      events: getEventsForDate(date),
    });
  }

  return days;
});

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return [];
  return getEventsForDate(selectedDate.value);
});

const getEventsForDate = date => {
  return events.value.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });
};

const isToday = date => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const formatDate = date => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = time => {
  return time;
};

const getEventColor = type => {
  const colors = {
    meeting: 'bg-blue-100 text-blue-800',
    task: 'bg-green-100 text-green-800',
    reminder: 'bg-yellow-100 text-yellow-800',
    personal: 'bg-purple-100 text-purple-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = date => {
  selectedDate.value = date;
};

const addEvent = () => {
  eventForm.value = {
    title: '',
    type: 'meeting',
    startTime: '',
    endTime: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    allDay: false,
    color: '#3b82f6',
    location: '',
    guests: [],
  };
  editingEvent.value = null;
  showEventForm.value = true;
};

const openEvent = event => {
  eventForm.value = { ...event };
  editingEvent.value = event;
  showEventForm.value = true;
};

const saveEvent = () => {
  if (editingEvent.value) {
    const index = events.value.findIndex(e => e.id === editingEvent.value.id);
    if (index !== -1) {
      events.value[index] = {
        ...eventForm.value,
        id: editingEvent.value.id,
        date: selectedDate.value,
      };
    }
  } else {
    events.value.push({
      ...eventForm.value,
      id: events.value.length + 1,
      date: selectedDate.value,
    });
  }
  closeEventForm();
};

const deleteEvent = event => {
  events.value = events.value.filter(e => e.id !== event.id);
};

const closeEventForm = () => {
  showEventForm.value = false;
  editingEvent.value = null;
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const saveSettings = () => {
  const settings = {
    theme: theme.value,
    view: view.value,
    timezone: timezone.value,
    showWeekends: showWeekends.value,
    showHolidays: showHolidays.value,
  };
  localStorage.setItem('calendarSettings', JSON.stringify(settings));
  showSettings.value = false;
};

const loadState = () => {
  const savedEvents = localStorage.getItem('calendarEvents');
  if (savedEvents) {
    events.value = JSON.parse(savedEvents);
  }

  const savedSettings = localStorage.getItem('calendarSettings');
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    theme.value = parsedSettings.theme;
    view.value = parsedSettings.view;
    timezone.value = parsedSettings.timezone;
    showWeekends.value = parsedSettings.showWeekends;
    showHolidays.value = parsedSettings.showHolidays;
  }
};

const saveState = () => {
  localStorage.setItem('calendarEvents', JSON.stringify(events.value));
  localStorage.setItem(
    'calendarSettings',
    JSON.stringify({
      theme: theme.value,
      view: view.value,
      timezone: timezone.value,
      showWeekends: showWeekends.value,
      showHolidays: showHolidays.value,
    })
  );
};

// Drag and drop
const isDragging = ref(false);
const draggedEvent = ref(null);

const onDragStart = event => {
  isDragging.value = true;
  draggedEvent.value = event;
  event.dragging = true;
};

const onDragEnd = event => {
  isDragging.value = false;
  draggedEvent.value = null;
  event.dragging = false;
};

const onDrop = (event, date) => {
  if (!draggedEvent.value) return;

  const index = events.value.findIndex(e => e.id === draggedEvent.value.id);
  if (index !== -1) {
    events.value[index] = {
      ...draggedEvent.value,
      date: date,
    };
    saveState();
  }
};

// Quick add event
const quickAddEvent = type => {
  const colors = {
    meeting: '#3b82f6',
    task: '#10b981',
    reminder: '#f59e0b',
    personal: '#8b5cf6',
  };

  eventForm.value = {
    title: '',
    type,
    startDate: new Date(),
    endDate: new Date(),
    allDay: false,
    color: colors[type],
    location: '',
    guests: [],
  };

  showEventForm.value = true;
};

// Get events for specific day
const getEventsForDay = day => {
  const dayIndex = weekDays.indexOf(day);
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - date.getDay() + dayIndex);
  return getEventsForDate(date);
};

onMounted(() => {
  loadState();
});

onUnmounted(() => {
  saveState();
});
</script>
