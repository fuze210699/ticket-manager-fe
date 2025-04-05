<template>
  <EditModeWidget v-if="isEditMode" :icon="StickyNote" @remove="$emit('remove')" />
  <div
    v-else
    class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-black dark:border-gray-700"
  >
    <div class="flex h-full overflow-hidden flex-col md:flex-row">
      <!-- Sidebar -->
      <div
        :class="[
          showSidebar ? 'block' : 'hidden md:block',
          'md:w-72 w-full border-r dark:border-gray-700 flex flex-col overflow-hidden',
        ]"
      >
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h2 class="font-medium text-gray-900 dark:text-white flex items-center">
            <button
              @click="toggleSidebar"
              class="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft v-if="showSidebar" class="w-4 h-4" />
              <ChevronRight v-else class="w-4 h-4" />
            </button>
            {{ $t('widgets.types.notes.title') }}
          </h2>
          <button
            class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            :title="$t('widgets.types.notes.addNote')"
            @click="createNewNote"
          >
            <Plus class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <!-- Search Box -->
        <div class="p-3 border-b dark:border-gray-700">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors duration-200"
              :placeholder="$t('common.search')"
            />
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <button
              v-if="searchQuery"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              @click="searchQuery = ''"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-if="notes.length === 0"
            class="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4"
          >
            <StickyNote class="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
            <p>{{ $t('widgets.types.notes.empty') }}</p>
          </div>

          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="px-4 py-3 cursor-pointer transition-colors duration-150 border-l-2 group"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500':
                activeNote && activeNote.id === note.id,
              'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-transparent':
                !activeNote || activeNote.id !== note.id,
            }"
            @click="selectNote(note)"
          >
            <div class="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
              {{ note.title || $t('widgets.types.notes.untitled') }}
            </div>
            <div class="flex items-center justify-between mt-1.5">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatRelativeDate(note.updatedAt) }}
              </div>
              <button
                class="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                :title="$t('common.delete')"
                @click.stop="deleteNote(note.id)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-1">
              {{ note.content || $t('widgets.types.notes.noContent') }}
            </div>
            <div v-if="note.tags && note.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <div
                v-for="tag in note.tags"
                :key="tag.id"
                class="px-1.5 py-0.5 rounded-full text-xs inline-flex items-center"
                :class="`bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-1" :class="`bg-${tag.color}-500`"></span>
                {{ tag.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Content -->
      <div class="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
        <!-- Mobile Header with back button -->
        <div class="md:hidden flex items-center px-4 py-3 border-b dark:border-gray-700">
          <button
            @click="toggleSidebar"
            class="p-1.5 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <h2 class="font-medium text-gray-900 dark:text-white">
            {{
              activeNote
                ? activeNote.title || $t('widgets.types.notes.untitled')
                : $t('widgets.types.notes.title')
            }}
          </h2>
        </div>

        <!-- Empty State -->
        <div
          v-if="!activeNote"
          class="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400"
        >
          <StickyNote class="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
          <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">
            {{ $t('widgets.types.notes.noSelection') }}
          </h3>
          <p class="mt-2 max-w-xs text-gray-500 dark:text-gray-400">
            {{ $t('widgets.types.notes.selectOrCreate') }}
          </p>
          <button
            class="mt-5 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
            @click="createNewNote"
          >
            {{ $t('widgets.types.notes.addNote') }}
          </button>
        </div>

        <!-- Note Editor -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <!-- Note Toolbar -->
          <div
            class="flex items-center justify-between p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-wrap gap-1"
          >
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="(tag, idx) in availableTags"
                :key="idx"
                class="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors"
                :class="[
                  activeNote.tags && activeNote.tags.some(t => t.id === tag.id)
                    ? `bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-200`
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                ]"
                @click="toggleNoteTag(tag)"
              >
                <span class="w-2 h-2 rounded-full" :class="`bg-${tag.color}-500`"></span>
                {{ tag.name }}
              </button>
            </div>
            <button
              class="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              :title="$t('common.delete')"
              @click="deleteActiveNote"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <!-- Note Title and Content -->
          <div class="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
            <input
              v-model="activeNote.title"
              type="text"
              class="w-full text-xl font-medium mb-5 border-0 p-0 bg-transparent text-gray-900 dark:text-white focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              :placeholder="$t('widgets.types.notes.titlePlaceholder')"
              @input="autoSaveActiveNote"
            />

            <textarea
              v-model="activeNote.content"
              class="w-full h-full resize-none border-0 p-0 bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
              :placeholder="$t('widgets.types.notes.contentPlaceholder')"
              @input="autoSaveActiveNote"
            ></textarea>
          </div>

          <!-- Status Bar -->
          <div
            class="text-xs text-gray-500 dark:text-gray-400 px-4 py-1.5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          >
            <span v-if="lastSaved"
              >{{ $t('widgets.types.notes.lastSaved') }}: {{ formatTime(lastSaved) }}</span
            >
            <span v-else>{{ $t('widgets.types.notes.editing') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useToast } from '@core/ui/use-toast';
import { StickyNote, Plus, Search, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import EditModeWidget from './EditModeWidget.vue';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

const { success } = useToast();

// State
const notes = ref([]);
const activeNote = ref(null);
const searchQuery = ref('');
const autoSave = ref(true);
const lastSaved = ref(null);
const showSidebar = ref(true);

// Handle responsive sidebar toggle
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Handle note selection
const selectNote = note => {
  activeNote.value = { ...note };
  // On mobile, hide sidebar after selecting a note
  if (window.innerWidth < 768) {
    showSidebar.value = false;
  }
};

// Tags
const availableTags = [
  { id: 1, name: 'Work', color: 'blue' },
  { id: 2, name: 'Personal', color: 'green' },
  { id: 3, name: 'Study', color: 'purple' },
  { id: 4, name: 'Ideas', color: 'orange' },
];

// Auto-save
let autoSaveTimeout;

// Filter and search
const filteredNotes = computed(() => {
  let result = [...notes.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.name.toLowerCase().includes(query))
    );
  }

  return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
});

const formatTime = date => {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeDate = dateString => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return formatTime(date); // Today, show time
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  } else {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
};

const createNewNote = () => {
  const newNote = {
    id: Date.now(),
    title: '',
    content: '',
    tags: [],
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to beginning of notes array
  notes.value.unshift(newNote);

  // Set as active note
  activeNote.value = { ...newNote };

  // Hide sidebar on mobile when creating new note
  if (window.innerWidth < 768) {
    showSidebar.value = false;
  }

  // Save to localStorage
  localStorage.setItem('notes', JSON.stringify(notes.value));
};

const toggleNoteTag = tag => {
  if (!activeNote.value) return;

  if (!activeNote.value.tags) {
    activeNote.value.tags = [];
  }

  const index = activeNote.value.tags.findIndex(t => t.id === tag.id);
  if (index === -1) {
    activeNote.value.tags.push(tag);
  } else {
    activeNote.value.tags.splice(index, 1);
  }

  autoSaveActiveNote();
};

const autoSaveActiveNote = () => {
  if (autoSave.value && activeNote.value) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveActiveNote();
    }, 800);
  }
};

const saveActiveNote = () => {
  if (!activeNote.value) return;

  // Update the updatedAt timestamp
  activeNote.value.updatedAt = new Date();

  // Find and update the note in the notes array
  const index = notes.value.findIndex(n => n.id === activeNote.value.id);
  if (index !== -1) {
    notes.value[index] = { ...activeNote.value };
  }

  // Save to localStorage
  localStorage.setItem('notes', JSON.stringify(notes.value));

  // Update last saved timestamp
  lastSaved.value = new Date();
};

const deleteActiveNote = () => {
  if (!activeNote.value) return;

  deleteNote(activeNote.value.id);
};

const deleteNote = id => {
  notes.value = notes.value.filter(note => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes.value));

  if (activeNote.value && activeNote.value.id === id) {
    activeNote.value = notes.value.length > 0 ? { ...notes.value[0] } : null;
    // On mobile, show sidebar again if no active note
    if (!activeNote.value && window.innerWidth < 768) {
      showSidebar.value = true;
    }
  }

  success('Note deleted successfully');
};

// Handle note selection going back to list with saving
watch(activeNote, (newValue, oldValue) => {
  if (oldValue && newValue && oldValue.id !== newValue.id) {
    // Switching to a different note, save the previous one
    const index = notes.value.findIndex(n => n.id === oldValue.id);
    if (index !== -1) {
      notes.value[index] = { ...oldValue, updatedAt: new Date() };
      localStorage.setItem('notes', JSON.stringify(notes.value));
    }
  }
});

// Watch for window resize events
const handleResize = () => {
  if (window.innerWidth >= 768) {
    // Ensure sidebar is visible in medium and large screens
    showSidebar.value = true;
  }
};

onMounted(() => {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);

    // Set first note as active if available
    if (notes.value.length > 0) {
      activeNote.value = { ...notes.value[0] };
    }
  }

  // Add resize event listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  clearTimeout(autoSaveTimeout);

  // Save active note when component is unmounted
  if (activeNote.value) {
    saveActiveNote();
  }

  // Remove resize event listener
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

textarea {
  min-height: 300px;
  line-height: 1.6;
}
</style>
