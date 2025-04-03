<template>
  <EditModeWidget
    v-if="isEditMode"
    :icon="StickyNote"
    @remove="$emit('remove')"
  />
  <div v-else class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div class="flex items-center gap-2">
        <StickyNote class="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('widgets.types.notes.title') }}</h2>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input v-model="searchQuery" type="text"
            class="pl-8 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :placeholder="$t('common.search')">
          <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          @click="showAddNote = true" :title="$t('widgets.types.notes.addNote')">
          <Plus class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          @click="showHistory = !showHistory" :title="$t('widgets.types.notes.history')">
          <History class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          @click="showSettings = !showSettings" :title="$t('common.settings')">
          <Settings class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>

    <!-- Notes List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <div v-if="notes.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
        <StickyNote class="w-12 h-12 mb-2 mx-auto text-gray-300 dark:text-gray-600" />
        <p>{{ $t('widgets.types.notes.empty') }}</p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          @click="showAddNote = true">
          {{ $t('widgets.types.notes.addNote') }}
        </button>
      </div>

      <TransitionGroup name="note-list" tag="div" class="space-y-2" s>
        <div v-for="note in filteredNotes" :key="note.id"
          class="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          @click="editNote(note)">
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                {{ note.title }}
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  @click.stop="deleteNote(note.id)" :title="$t('common.delete')">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                {{ formatDate(note.updatedAt) }}
              </span>
              <span v-if="note.tags?.length" class="flex items-center gap-1">
                <Tag class="w-4 h-4" />
                {{note.tags.map(t => t.name).join(', ')}}
              </span>
              <span v-if="note.attachments?.length" class="flex items-center gap-1">
                <Paperclip class="w-4 h-4" />
                {{ note.attachments.length }}
              </span>
            </div>

            <div class="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ note.content }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add/Edit Note Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="showAddNote" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          @click.self="closeAddNote">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {{ editingNote ? $t('common.edit') : $t('common.add') }} {{ $t('widgets.types.notes.note') }}
              </h3>

              <div class="space-y-4">
                <div>
                  <input v-model="noteForm.title" type="text"
                    class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    :placeholder="$t('widgets.types.notes.titlePlaceholder')">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('common.tags') }}
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="tag in availableTags" :key="tag.id"
                        class="px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all duration-200"
                        :class="[
                          noteForm.tags.some(t => t.id === tag.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        ]" @click="toggleTag(tag)">
                        <Tag class="w-3 h-3" />
                        {{ tag.name }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('widgets.types.notes.attachments') }}
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(attachment, index) in noteForm.attachments" :key="index"
                        class="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <File class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span class="text-sm text-gray-600 dark:text-gray-300">{{ attachment.name }}</span>
                        <button class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          @click="removeAttachment(index)">
                          <X class="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        @click="addAttachment">
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('widgets.types.notes.content') }}
                    </label>
                    <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div
                        class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-700">
                        <button v-for="tool in markdownTools" :key="tool.name"
                          class="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                          @click="applyMarkdown(tool)" :title="tool.title">
                          <component :is="tool.icon" class="w-4 h-4" />
                        </button>
                      </div>
                      <textarea v-model="noteForm.content"
                        class="w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        :placeholder="$t('widgets.types.notes.contentPlaceholder')" rows="10"></textarea>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('widgets.types.notes.preview') }}
                    </label>
                    <div
                      class="h-full p-3 border dark:border-gray-700 rounded-lg overflow-y-auto bg-gray-50 dark:bg-gray-700">
                      <div v-html="renderedContent" class="prose dark:prose-invert max-w-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                @click="closeAddNote">
                {{ $t('common.cancel') }}
              </button>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                @click="saveNote">
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- History Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="showHistory" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          @click.self="showHistory = false">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {{ $t('widgets.types.notes.history') }}
              </h3>

              <div class="space-y-4">
                <div v-for="version in noteHistory" :key="version.id"
                  class="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <Clock class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-600 dark:text-gray-300">
                        {{ formatDate(version.timestamp) }}
                      </span>
                    </div>
                    <button class="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      @click="restoreVersion(version)">
                      <RotateCcw class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {{ version.content }}
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                @click="showHistory = false">
                {{ $t('common.close') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Settings Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="showSettings" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          @click.self="showSettings = false">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {{ $t('common.settings') }}
              </h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('widgets.types.notes.autoSave') }}
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="autoSave"
                      @click="autoSave = !autoSave"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="[
                        autoSave ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="[
                          autoSave ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      {{ autoSave ? $t('common.enabled') : $t('common.disabled') }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('widgets.types.notes.syntaxHighlighting') }}
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="syntaxHighlighting"
                      @click="syntaxHighlighting = !syntaxHighlighting"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="[
                        syntaxHighlighting ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="[
                          syntaxHighlighting ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      {{ syntaxHighlighting ? $t('common.enabled') : $t('common.disabled') }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('widgets.types.notes.versionHistory') }}
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="versionHistory"
                      @click="versionHistory = !versionHistory"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="[
                        versionHistory ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="[
                          versionHistory ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      {{ versionHistory ? $t('common.enabled') : $t('common.disabled') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                @click="showSettings = false">
                {{ $t('common.close') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useToast } from '@/shared/components/ui/use-toast';
import { StickyNote, Plus, Search, History, Settings, Trash2, Calendar, Tag, Paperclip, File, X, RotateCcw, Bold, Italic, List, ListOrdered, Code, Link, Image, Table, Heading1, Heading2, Heading3, Quote } from 'lucide-vue-next';
import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import EditModeWidget from './EditModeWidget.vue';

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false
  }
});

defineEmits(['move-up', 'move-down', 'remove']);

const { success } = useToast();

// State
const notes = ref([]);
const showAddNote = ref(false);
const showHistory = ref(false);
const showSettings = ref(false);
const editingNote = ref(null);
const searchQuery = ref('');
const autoSave = ref(true);
const syntaxHighlighting = ref(true);
const versionHistory = ref(true);
const noteHistory = ref([]);

// Form state
const noteForm = ref({
  title: '',
  content: '',
  tags: [],
  attachments: []
});

// Tags
const availableTags = [
  { id: 1, name: 'Work', color: 'blue' },
  { id: 2, name: 'Personal', color: 'green' },
  { id: 3, name: 'Study', color: 'purple' },
  { id: 4, name: 'Ideas', color: 'orange' }
];

// Markdown tools
const markdownTools = [
  { name: 'bold', icon: Bold, title: 'Bold', syntax: '**text**' },
  { name: 'italic', icon: Italic, title: 'Italic', syntax: '*text*' },
  { name: 'heading1', icon: Heading1, title: 'Heading 1', syntax: '# ' },
  { name: 'heading2', icon: Heading2, title: 'Heading 2', syntax: '## ' },
  { name: 'heading3', icon: Heading3, title: 'Heading 3', syntax: '### ' },
  { name: 'list', icon: List, title: 'Unordered List', syntax: '- ' },
  { name: 'listOrdered', icon: ListOrdered, title: 'Ordered List', syntax: '1. ' },
  { name: 'code', icon: Code, title: 'Code Block', syntax: '```\ncode\n```' },
  { name: 'link', icon: Link, title: 'Link', syntax: '[text](url)' },
  { name: 'image', icon: Image, title: 'Image', syntax: '![alt](url)' },
  { name: 'table', icon: Table, title: 'Table', syntax: '| Header |\n|--------|\n| Cell   |' },
  { name: 'quote', icon: Quote, title: 'Quote', syntax: '> ' }
];

// Auto-save
let autoSaveTimeout;
watch(() => noteForm.value.content, () => {
  if (autoSave.value) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveNote();
    }, 1000);
  }
});

// Markdown rendering
const renderedContent = computed(() => {
  if (!noteForm.value.content) return '';

  marked.setOptions({
    highlight: (code, lang) => {
      if (syntaxHighlighting.value && lang && highlight.getLanguage(lang)) {
        return highlight.highlight(code, { language: lang }).value;
      }
      return code;
    }
  });

  return marked(noteForm.value.content);
});

// Filter and search
const filteredNotes = computed(() => {
  let result = [...notes.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.name.toLowerCase().includes(query))
    );
  }

  return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
});

// Export/Import
const exportNotes = () => {
  const data = JSON.stringify(notes.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notes.json';
  a.click();
  URL.revokeObjectURL(url);
};

const importNotes = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);
        notes.value = importedNotes;
        localStorage.setItem('notes', JSON.stringify(notes.value));
        success('Notes imported successfully');
      } catch (error) {
        success('Error importing notes', 'error');
      }
    };
    reader.readAsText(file);
  }
};

const resetForm = () => {
  noteForm.value = {
    title: '',
    content: '',
    tags: [],
    attachments: []
  };
  editingNote.value = null;
};

const closeAddNote = () => {
  showAddNote.value = false;
  resetForm();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const toggleTag = (tag) => {
  const index = noteForm.value.tags.findIndex(t => t.id === tag.id);
  if (index === -1) {
    noteForm.value.tags.push(tag);
  } else {
    noteForm.value.tags.splice(index, 1);
  }
};

const addAttachment = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      noteForm.value.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        file: file
      });
    }
  };
  input.click();
};

const removeAttachment = (index) => {
  noteForm.value.attachments.splice(index, 1);
};

const applyMarkdown = (tool) => {
  const textarea = document.querySelector('textarea');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = noteForm.value.content;
  const selectedText = text.substring(start, end);

  let newText;
  if (selectedText) {
    newText = text.substring(0, start) + tool.syntax.replace('text', selectedText) + text.substring(end);
  } else {
    newText = text.substring(0, start) + tool.syntax + text.substring(start);
  }

  noteForm.value.content = newText;

  // Restore cursor position
  setTimeout(() => {
    textarea.selectionStart = start + tool.syntax.length;
    textarea.selectionEnd = start + tool.syntax.length;
    textarea.focus();
  }, 0);
};

const saveNote = () => {
  if (!noteForm.value.title.trim()) {
    return;
  }

  if (editingNote.value) {
    const index = notes.value.findIndex(n => n.id === editingNote.value.id);
    if (index !== -1) {
      notes.value[index] = {
        ...editingNote.value,
        ...noteForm.value,
        updatedAt: new Date()
      };

      if (versionHistory.value) {
        noteHistory.value.push({
          id: Date.now(),
          noteId: editingNote.value.id,
          content: noteForm.value.content,
          timestamp: new Date()
        });
      }
    }
    success('Note updated successfully');
  } else {
    notes.value.push({
      id: Date.now(),
      ...noteForm.value,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    success('Note added successfully');
  }

  localStorage.setItem('notes', JSON.stringify(notes.value));
  closeAddNote();
};

const editNote = (note) => {
  editingNote.value = note;
  noteForm.value = {
    title: note.title,
    content: note.content,
    tags: note.tags,
    attachments: note.attachments
  };
  showAddNote.value = true;
};

const deleteNote = (id) => {
  notes.value = notes.value.filter(note => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes.value));
  success('Note deleted successfully');
};

const restoreVersion = (version) => {
  const note = notes.value.find(n => n.id === version.noteId);
  if (note) {
    note.content = version.content;
    note.updatedAt = new Date();
    localStorage.setItem('notes', JSON.stringify(notes.value));
    success('Version restored successfully');
    showHistory.value = false;
  }
};

onMounted(() => {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }
});

onUnmounted(() => {
  clearTimeout(autoSaveTimeout);
});
</script>

<style scoped>
.note-list-enter-active,
.note-list-leave-active {
  transition: all 0.3s ease;
}

.note-list-enter-from,
.note-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.note-list-move {
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  max-width: none;
}

.prose :where(pre):not(:where([class~="not-prose"] *)) {
  background-color: #1a1a1a;
  color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose :where(code):not(:where([class~="not-prose"] *)) {
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.dark .prose :where(code):not(:where([class~="not-prose"] *)) {
  background-color: #374151;
  color: #f3f4f6;
}
</style>