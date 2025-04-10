<template>
  <EditModeWidget v-if="isEditMode" :icon="StickyNote" @remove="$emit('remove')" />
  <div
    v-else
    class="notes-widget h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <div class="flex h-full flex-col overflow-hidden">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      >
        <h2 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <StickyNote class="w-5 h-5" />
          {{ $t('widgets.types.notes.title') }}
        </h2>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ characterCount }}/5000</div>
      </div>

      <!-- Note Content -->
      <div class="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
        <!-- Note Editor -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Note Title and Content -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <input
              v-model="note.title"
              type="text"
              class="w-full text-xl font-medium mb-5 border-0 p-0 bg-transparent text-gray-900 dark:text-white focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              :placeholder="$t('widgets.types.notes.titlePlaceholder')"
              @input="saveNote"
              @keydown.ctrl.s.prevent="saveNote"
            />

            <textarea
              ref="contentTextarea"
              v-model="note.content"
              class="w-full h-full resize-none border-0 p-0 bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed transition-colors duration-200"
              :placeholder="$t('widgets.types.notes.contentPlaceholder')"
              @input="saveNote"
              @keydown.ctrl.s.prevent="saveNote"
            ></textarea>
          </div>

          <!-- Status Bar -->
          <div
            class="text-xs text-gray-500 dark:text-gray-400 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span v-if="lastSaved" class="flex items-center gap-1">
                <span class="save-indicator" :class="{ saving: isSaving }"></span>
                {{ $t('widgets.types.notes.lastSaved') }}: {{ formatTime(lastSaved) }}
              </span>
              <span v-else class="flex items-center gap-1">
                <span class="save-indicator"></span>
                {{ $t('widgets.types.notes.editing') }}
              </span>
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500">
              {{ $t('widgets.types.notes.shortcuts') }}: Ctrl + S
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { StickyNote } from 'lucide-vue-next';
import EditModeWidget from '@infrastructure/widgets/EditModeWidget.vue';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

// State
const note = ref({
  title: '',
  content: '',
  updatedAt: new Date(),
});
const lastSaved = ref(null);
const isSaving = ref(false);
const contentTextarea = ref(null);

const characterCount = computed(() => {
  return note.value.content.length;
});

const formatTime = date => {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const saveNote = async () => {
  if (characterCount.value > 5000) {
    note.value.content = note.value.content.slice(0, 5000);
  }

  // Update the updatedAt timestamp
  note.value.updatedAt = new Date();
  isSaving.value = true;

  // Save to localStorage
  localStorage.setItem('note', JSON.stringify(note.value));

  // Simulate network delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300));

  // Update last saved timestamp
  lastSaved.value = new Date();
  isSaving.value = false;
};

onMounted(() => {
  const savedNote = localStorage.getItem('note');
  if (savedNote) {
    note.value = JSON.parse(savedNote);
  }
});
</script>

<style scoped>
.notes-widget {
  transition: all 0.2s ease-in-out;
}

.notes-widget:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

textarea {
  min-height: 300px;
  line-height: 1.6;
}

/* Add smooth transitions for all interactive elements */
button,
input,
select,
textarea {
  transition: all 0.2s ease;
}

/* Add focus styles for better accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Dark mode transitions */
.dark .notes-widget {
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.dark .notes-widget:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

/* Save indicator styles */
.save-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  transition: all 0.3s ease;
}

.save-indicator.saving {
  background-color: #f59e0b;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Placeholder styles */
textarea::placeholder,
input::placeholder {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

textarea:focus::placeholder,
input:focus::placeholder {
  opacity: 0.3;
}

/* Character count warning */
.character-count-warning {
  color: #ef4444;
}
</style>
