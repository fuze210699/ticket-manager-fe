<template>
  <EditModeWidget v-if="isEditMode" :icon="ListTodo" @remove="$emit('remove')" />
  <div v-else class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div class="flex items-center gap-2">
        <ListTodo class="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('widgets.types.todo.title') }}
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            class="pl-8 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :placeholder="$t('common.search')"
          />
          <Search
            class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
        </div>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          :title="$t('widgets.types.todo.addTask')"
          @click="showAddTask = true"
        >
          <Plus class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          :title="$t('common.filter')"
          @click="toggleFilter"
        >
          <Filter class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          :title="$t('common.advancedFilter')"
          @click="showAdvancedFilter = !showAdvancedFilter"
        >
          <ChevronDown
            class="w-5 h-5 text-gray-600 dark:text-gray-300"
            :class="{ 'transform rotate-180': showAdvancedFilter }"
          />
        </button>
      </div>
    </div>

    <!-- Advanced Filter -->
    <div
      v-if="showAdvancedFilter"
      class="border-b p-4 bg-gray-50 dark:bg-gray-700 space-y-4 transition-all duration-300"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('common.category') }}
          </label>
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="null">{{ $t('common.allCategories') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('common.priority') }}
          </label>
          <select
            v-model="selectedPriority"
            class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="null">{{ $t('common.allPriorities') }}</option>
            <option v-for="priority in priorities" :key="priority.value" :value="priority.value">
              {{ priority.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="px-4 py-2 border-b dark:border-gray-700">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ completedTasksCount }}/{{ totalTasksCount }} {{ $t('widgets.types.todo.task') }}
        </span>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
          {{ progressPercentage }}%
        </span>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-500 transition-all duration-500 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Task List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <div v-if="tasks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
        <CheckCircle2 class="w-12 h-12 mb-2 mx-auto text-gray-300 dark:text-gray-600" />
        <p>{{ $t('widgets.types.todo.empty') }}</p>
        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          @click="showAddTask = true"
        >
          {{ $t('widgets.types.todo.addTask') }}
        </button>
      </div>

      <TransitionGroup name="task-list" tag="div" class="space-y-2">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          :class="{ 'opacity-75': task.completed }"
          draggable="true"
          @dragstart="onDragStart(task)"
          @dragend="onDragEnd(task)"
          @dragover.prevent
          @drop="onDrop($event, task)"
        >
          <GripVertical class="w-5 h-5 text-gray-400 self-center cursor-move" />

          <button
            class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
            :class="[
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
              priorityColors[task.priority],
            ]"
            @click="toggleTask(task)"
          >
            <Check v-if="task.completed" class="w-3 h-3 text-white" />
          </button>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div
                class="flex-1 text-sm transition-all duration-200"
                :class="{ 'line-through text-gray-400 dark:text-gray-500': task.completed }"
              >
                {{ task.title }}
              </div>
              <div
                class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  :title="$t('common.edit')"
                  @click="editTask(task)"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  :title="$t('common.delete')"
                  @click="deleteTask(task.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span v-if="task.dueDate" class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                {{ formatDate(task.dueDate) }}
              </span>
              <span
                v-if="task.priority"
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="priorityColors[task.priority]"
              >
                {{ $t(`common.priorities.${task.priority}`) }}
              </span>
              <span v-if="task.category" class="flex items-center gap-1">
                <Folder class="w-4 h-4" />
                {{ categories.find(c => c.id === task.category)?.name }}
              </span>
              <span v-if="task.tags?.length" class="flex items-center gap-1">
                <Tag class="w-4 h-4" />
                {{ task.tags.map(t => t.name).join(', ') }}
              </span>
            </div>

            <div v-if="task.subtasks?.length" class="mt-2 space-y-1">
              <div
                v-for="subtask in task.subtasks"
                :key="subtask.id"
                class="flex items-center gap-2 text-sm"
              >
                <button
                  class="w-4 h-4 rounded border flex items-center justify-center"
                  :class="subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'"
                  @click="toggleSubtask(task, subtask)"
                >
                  <Check v-if="subtask.completed" class="w-3 h-3 text-white" />
                </button>
                <span :class="{ 'line-through text-gray-400': subtask.completed }">
                  {{ subtask.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add/Edit Task Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="showAddTask"
          class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          @click.self="closeAddTask"
        >
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {{ editingTask ? $t('common.edit') : $t('common.add') }}
                {{ $t('widgets.types.todo.task') }}
              </h3>

              <div class="space-y-4">
                <div>
                  <input
                    v-model="taskForm.title"
                    type="text"
                    class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    :placeholder="$t('widgets.types.todo.titlePlaceholder')"
                    @keyup.enter="saveTask"
                  />
                </div>

                <div>
                  <textarea
                    v-model="taskForm.description"
                    class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    :placeholder="$t('widgets.types.todo.descriptionPlaceholder')"
                    rows="3"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('common.dueDate') }}
                    </label>
                    <input
                      v-model="taskForm.dueDate"
                      type="date"
                      class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('common.priority') }}
                    </label>
                    <select
                      v-model="taskForm.priority"
                      class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option
                        v-for="priority in priorities"
                        :key="priority.value"
                        :value="priority.value"
                      >
                        {{ priority.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('common.category') }}
                    </label>
                    <select
                      v-model="taskForm.category"
                      class="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option :value="null">{{ $t('common.selectCategory') }}</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ $t('common.tags') }}
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="tag in availableTags"
                        :key="tag.id"
                        class="px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all duration-200"
                        :class="[
                          taskForm.tags.some(t => t.id === tag.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                        ]"
                        @click="toggleTag(tag)"
                      >
                        <Tag class="w-3 h-3" />
                        {{ tag.name }}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('widgets.types.todo.subtasks') }}
                  </label>
                  <div class="space-y-2">
                    <div
                      v-for="(subtask, index) in taskForm.subtasks"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="subtask.title"
                        type="text"
                        class="flex-1 px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        :placeholder="$t('widgets.types.todo.subtaskPlaceholder')"
                      />
                      <button
                        class="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        @click="removeSubtask(index)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      @click="addSubtask"
                    >
                      {{ $t('widgets.types.todo.addSubtask') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                @click="closeAddTask"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                @click="saveTask"
              >
                {{ $t('common.save') }}
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
import { useToast } from '@core/ui/use-toast';
import {
  Plus,
  Filter,
  CheckCircle2,
  Check,
  Pencil,
  Trash2,
  Flag,
  ListTodo,
  Search,
  Tag,
  Folder,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
} from 'lucide-vue-next';
import EditModeWidget from './EditModeWidget.vue';

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

const { success } = useToast();

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

// Define priorities array
const priorities = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

// State
const tasks = ref([]);
const showAddTask = ref(false);
const showFilter = ref(false);
const editingTask = ref(null);
const currentFilter = ref('all');
const selectedPriority = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref('');
const showAdvancedFilter = ref(false);
const undoStack = ref([]);
const redoStack = ref([]);

// Form state
const taskForm = ref({
  title: '',
  dueDate: '',
  priority: 4,
  completed: false,
  subtasks: [],
  tags: [],
  category: null,
  description: '',
  attachments: [],
});

// Categories
const categories = [
  { id: 1, name: 'Work', color: 'blue' },
  { id: 2, name: 'Personal', color: 'green' },
  { id: 3, name: 'Shopping', color: 'purple' },
  { id: 4, name: 'Health', color: 'red' },
];

// Tags
const availableTags = [
  { id: 1, name: 'Urgent', color: 'red' },
  { id: 2, name: 'Important', color: 'orange' },
  { id: 3, name: 'Later', color: 'blue' },
  { id: 4, name: 'Routine', color: 'green' },
];

// Keyboard shortcuts
const handleKeydown = e => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'z':
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        break;
      case 'y':
        e.preventDefault();
        redo();
        break;
      case 'n':
        e.preventDefault();
        showAddTask.value = true;
        break;
      case 'f':
        e.preventDefault();
        showFilter.value = !showFilter.value;
        break;
    }
  }
};

// Undo/Redo
const saveState = () => {
  undoStack.value.push(JSON.stringify(tasks.value));
  redoStack.value = [];
};

const undo = () => {
  if (undoStack.value.length > 0) {
    const state = undoStack.value.pop();
    redoStack.value.push(JSON.stringify(tasks.value));
    tasks.value = JSON.parse(state);
    localStorage.setItem('tasks', state);
  }
};

const redo = () => {
  if (redoStack.value.length > 0) {
    const state = redoStack.value.pop();
    undoStack.value.push(JSON.stringify(tasks.value));
    tasks.value = JSON.parse(state);
    localStorage.setItem('tasks', state);
  }
};

// Drag and drop
const isDragging = ref(false);
const draggedTask = ref(null);

const onDragStart = task => {
  isDragging.value = true;
  draggedTask.value = task;
  task.dragging = true;
};

const onDragEnd = task => {
  isDragging.value = false;
  draggedTask.value = null;
  task.dragging = false;
};

const onDrop = (event, targetTask) => {
  if (!draggedTask.value) return;

  const targetIndex = tasks.value.findIndex(t => t.id === targetTask.id);
  const draggedIndex = tasks.value.findIndex(t => t.id === draggedTask.value.id);

  if (draggedIndex !== -1 && targetIndex !== -1) {
    tasks.value.splice(draggedIndex, 1);
    tasks.value.splice(targetIndex, 0, draggedTask.value);
    saveState();
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  }
};

// Filter and search
const filteredTasks = computed(() => {
  let result = [...tasks.value];

  // Apply filters
  if (currentFilter.value === 'active') {
    result = result.filter(task => !task.completed);
  } else if (currentFilter.value === 'completed') {
    result = result.filter(task => task.completed);
  }

  if (selectedPriority.value) {
    result = result.filter(task => task.priority === selectedPriority.value);
  }

  if (selectedCategory.value) {
    result = result.filter(task => task.category === selectedCategory.value);
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.name.toLowerCase().includes(query))
    );
  }

  return result.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });
});

// Export/Import
const exportTasks = () => {
  const data = JSON.stringify(tasks.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
  URL.revokeObjectURL(url);
};

const importTasks = event => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        tasks.value = importedTasks;
        saveState();
        localStorage.setItem('tasks', JSON.stringify(tasks.value));
        success('Tasks imported successfully');
      } catch (error) {
        success('Error importing tasks', 'error');
      }
    };
    reader.readAsText(file);
  }
};

const resetForm = () => {
  taskForm.value = {
    title: '',
    dueDate: '',
    priority: 4,
    completed: false,
    subtasks: [],
    tags: [],
    category: null,
    description: '',
    attachments: [],
  };
  editingTask.value = null;
};

const closeAddTask = () => {
  showAddTask.value = false;
  resetForm();
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const toggleTask = task => {
  task.completed = !task.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
  success(task.completed ? 'Task completed!' : 'Task uncompleted');
};

const editTask = task => {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    completed: task.completed,
    subtasks: task.subtasks,
    tags: task.tags,
    category: task.category,
    description: task.description,
    attachments: task.attachments,
  };
  showAddTask.value = true;
};

const saveTask = () => {
  if (!taskForm.value.title.trim()) {
    return;
  }

  if (editingTask.value) {
    const index = tasks.value.findIndex(t => t.id === editingTask.value.id);
    if (index !== -1) {
      tasks.value[index] = {
        ...editingTask.value,
        ...taskForm.value,
        updatedAt: new Date(),
      };
    }
    success('Task updated successfully');
  } else {
    tasks.value.push({
      id: Date.now(),
      ...taskForm.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    success('Task added successfully');
  }

  localStorage.setItem('tasks', JSON.stringify(tasks.value));
  closeAddTask();
};

const deleteTask = id => {
  tasks.value = tasks.value.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
  success('Task deleted successfully');
};

// Add tag toggling function
const toggleTag = tag => {
  const index = taskForm.value.tags.findIndex(t => t.id === tag.id);
  if (index === -1) {
    taskForm.value.tags.push(tag);
  } else {
    taskForm.value.tags.splice(index, 1);
  }
};

// Add computed properties for progress tracking
const totalTasksCount = computed(() => tasks.value.length);
const completedTasksCount = computed(() => tasks.value.filter(task => task.completed).length);
const progressPercentage = computed(() => {
  if (totalTasksCount.value === 0) return 0;
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100);
});

onMounted(() => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-move {
  transition: transform 0.3s ease;
}

.line-through {
  text-decoration: line-through;
}

.dragging {
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
