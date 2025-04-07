<template>
  <EditModeWidget v-if="isEditMode" :icon="ListTodo" @remove="$emit('remove')" />
  <div
    v-else
    class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm"
  >
    <!-- Header with Quick Stats -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700 gap-3 sm:gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
    >
      <div class="flex items-center gap-2">
        <ListTodo class="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('widgets.types.todo.title') }}
        </h2>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            {{ overdueTasksCount }} {{ $t('widgets.types.todo.overdue') }}
          </span>
          <span class="flex items-center gap-1">
            <Flag class="w-4 h-4" />
            {{ highPriorityTasksCount }} {{ $t('widgets.types.todo.highPriority') }}
          </span>
        </div>
        <div class="relative flex-grow sm:flex-grow-0">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-8 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 focus:shadow-md"
            :placeholder="$t('common.search')"
            @keyup.esc="searchQuery = ''"
          />
          <Search
            class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <button
            v-if="searchQuery"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            @click="searchQuery = ''"
          >
            <X class="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="p-2 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow group"
            :title="$t('widgets.types.todo.addTask')"
            @click="showAddTask = true"
          >
            <Plus
              class="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200"
            />
          </button>
          <button
            class="p-2 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow group"
            :title="$t('common.filter')"
            @click="toggleFilter"
          >
            <Filter
              class="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform duration-200"
            />
          </button>
          <button
            class="p-2 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow group"
            :title="$t('common.advancedFilter')"
            @click="showAdvancedFilter = !showAdvancedFilter"
          >
            <ChevronDown
              class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:scale-110"
              :class="{ 'transform rotate-180': showAdvancedFilter }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions with Visual Indicators -->
    <div
      v-if="showFilter"
      class="flex flex-col gap-3 p-3 sm:p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
    >
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
          :class="[
            currentFilter === filter.value
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600',
          ]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
          <span class="px-1.5 py-0.5 rounded-full text-xs bg-white/20 dark:bg-black/20">
            {{ getFilterCount(filter.value) }}
          </span>
        </button>
      </div>

      <div
        v-if="showAdvancedFilter"
        class="flex flex-wrap items-center gap-3 pt-2 border-t dark:border-gray-600"
      >
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >{{ $t('widgets.types.todo.sortBy') }}:</label
          >
          <div class="flex items-center gap-2">
            <button
              class="px-2 py-1 rounded-md text-sm transition-all duration-200"
              :class="[
                sortByDueDate
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
              @click="
                sortByDueDate = !sortByDueDate;
                sortByPriority = false;
                sortByCategory = false;
              "
            >
              {{ $t('widgets.types.todo.sortOptions.dueDate') }}
            </button>
            <button
              class="px-2 py-1 rounded-md text-sm transition-all duration-200"
              :class="[
                sortByPriority
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
              @click="
                sortByPriority = !sortByPriority;
                sortByDueDate = false;
                sortByCategory = false;
              "
            >
              {{ $t('widgets.types.todo.sortOptions.priority') }}
            </button>
            <button
              class="px-2 py-1 rounded-md text-sm transition-all duration-200"
              :class="[
                sortByCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
              @click="
                sortByCategory = !sortByCategory;
                sortByDueDate = false;
                sortByPriority = false;
              "
            >
              {{ $t('widgets.types.todo.sortOptions.category') }}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >{{ $t('widgets.types.todo.filterBy') }}:</label
          >
          <select
            v-model="selectedPriority"
            class="px-2 py-1 rounded-md text-sm border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">
              {{ $t('widgets.types.todo.filterOptions.allPriorities') }}
            </option>
            <option v-for="priority in priorities" :key="priority.value" :value="priority.value">
              {{ $t(`common.priorities.${priority.label.toLowerCase()}`) }}
            </option>
          </select>
          <select
            v-model="selectedCategory"
            class="px-2 py-1 rounded-md text-sm border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">
              {{ $t('widgets.types.todo.filterOptions.allCategories') }}
            </option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Progress Bar with Visual Feedback -->
    <div class="px-3 sm:px-4 py-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ completedTasksCount }}/{{ totalTasksCount }} {{ $t('widgets.types.todo.task') }}
          </span>
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
            {{ progressPercentage }}%
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5" />
            {{ completedTasksCount }} {{ $t('widgets.types.todo.stats.completed') }}
          </span>
          <span class="flex items-center gap-1">
            <Clock class="w-3.5 h-3.5" />
            {{ remainingTasksCount }} {{ $t('widgets.types.todo.stats.remaining') }}
          </span>
          <span class="flex items-center gap-1">
            <Flag class="w-3.5 h-3.5" />
            {{ highPriorityTasksCount }} {{ $t('widgets.types.todo.stats.highPriority') }}
          </span>
          <span class="flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />
            {{ overdueTasksCount }} {{ $t('widgets.types.todo.stats.overdue') }}
          </span>
        </div>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
          class="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Task List with Enhanced Visual Hierarchy -->
    <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 overflow-hidden">
      <div v-if="tasks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8 px-4">
        <CheckCircle2 class="w-16 h-16 mb-4 mx-auto text-gray-300 dark:text-gray-600 opacity-80" />
        <p class="text-lg mb-2">{{ $t('widgets.types.todo.empty') }}</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">
          Start adding tasks to stay organized
        </p>
        <button
          class="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          @click="showAddTask = true"
        >
          {{ $t('widgets.types.todo.addTask') }}
        </button>
      </div>

      <TransitionGroup name="task-list" tag="div" class="space-y-2">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="group flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-0.5 shadow-sm hover:shadow"
          :class="{ 'opacity-80 bg-gray-50 dark:bg-gray-750': task.completed }"
          draggable="true"
          @dragstart="onDragStart(task)"
          @dragend="onDragEnd(task)"
          @dragover.prevent
          @drop="onDrop($event, task)"
        >
          <GripVertical
            class="hidden sm:block w-5 h-5 text-gray-400 self-center cursor-move opacity-60 hover:opacity-100"
          />

          <button
            class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm"
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
                class="flex-1 text-sm font-medium transition-all duration-200"
                :class="{ 'line-through text-gray-400 dark:text-gray-500': task.completed }"
              >
                {{ task.title }}
              </div>
              <div
                class="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  :title="$t('common.edit')"
                  @click="editTask(task)"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                  :title="$t('common.delete')"
                  @click="deleteTask(task.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              class="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <span
                v-if="task.dueDate"
                class="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full"
              >
                <Calendar class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 dark:text-blue-400" />
                {{ formatDate(task.dueDate) }}
                <span v-if="isOverdue(task.dueDate)" class="text-red-500 dark:text-red-400 ml-1">
                  (Overdue)
                </span>
              </span>
              <span
                v-if="task.priority"
                class="px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full"
                :class="priorityColors[task.priority]"
              >
                {{ $t(`common.priorities.${task.priority}`) }}
              </span>
              <span
                v-if="task.category"
                class="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded-full"
              >
                <Folder class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 dark:text-purple-400" />
                {{ categories.find(c => c.id === task.category)?.name }}
              </span>
              <span
                v-if="task.tags?.length"
                class="flex items-center gap-1 px-2 py-0.5 bg-gray-50 dark:bg-gray-700 rounded-full"
              >
                <Tag class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                {{ task.tags.map(t => t.name).join(', ') }}
              </span>
            </div>

            <div
              v-if="task.description"
              class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
            >
              {{ task.description }}
            </div>

            <div
              v-if="task.subtasks?.length"
              class="mt-2 space-y-1.5 bg-gray-50 dark:bg-gray-750 p-2 rounded-md"
            >
              <div
                v-for="subtask in task.subtasks"
                :key="subtask.id"
                class="flex items-center gap-2 text-xs sm:text-sm"
              >
                <button
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border flex items-center justify-center shadow-sm transition-all duration-200"
                  :class="
                    subtask.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  "
                  @click="toggleSubtask(task, subtask)"
                >
                  <Check v-if="subtask.completed" class="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </button>
                <span
                  :class="{ 'line-through text-gray-400 dark:text-gray-500': subtask.completed }"
                >
                  {{ subtask.title }}
                </span>
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ getSubtaskProgress(task) }}
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add/Edit Task Modal with Enhanced UX -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="showAddTask"
          class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          @click.self="closeAddTask"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto border border-gray-200 dark:border-gray-700"
          >
            <div class="p-5 sm:p-6">
              <h3
                class="text-xl font-semibold mb-5 text-gray-900 dark:text-white flex items-center gap-2"
              >
                <span class="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                  <ListTodo class="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </span>
                {{ editingTask ? $t('common.edit') : $t('common.add') }}
                {{ $t('widgets.types.todo.task') }}
              </h3>

              <div class="space-y-5">
                <div>
                  <input
                    v-model="taskForm.title"
                    type="text"
                    class="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                    :placeholder="$t('widgets.types.todo.titlePlaceholder')"
                    @keyup.enter="saveTask"
                  />
                </div>

                <div>
                  <textarea
                    v-model="taskForm.description"
                    class="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                    :placeholder="$t('widgets.types.todo.descriptionPlaceholder')"
                    rows="3"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      {{ $t('common.dueDate') }}
                    </label>
                    <input
                      v-model="taskForm.dueDate"
                      type="date"
                      class="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      {{ $t('common.priority') }}
                    </label>
                    <select
                      v-model="taskForm.priority"
                      class="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
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

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      {{ $t('common.category') }}
                    </label>
                    <select
                      v-model="taskForm.category"
                      class="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
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
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      {{ $t('common.tags') }}
                    </label>
                    <div
                      class="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border dark:border-gray-600 min-h-[42px]"
                    >
                      <button
                        v-for="tag in availableTags"
                        :key="tag.id"
                        class="px-2.5 py-1 rounded-full text-xs flex items-center gap-1 transition-all duration-200 shadow-sm"
                        :class="[
                          taskForm.tags.some(t => t.id === tag.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500',
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
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {{ $t('widgets.types.todo.subtasks') }}
                  </label>
                  <div
                    class="space-y-2 bg-gray-50 dark:bg-gray-750 p-3 rounded-lg border dark:border-gray-700"
                  >
                    <div
                      v-for="(subtask, index) in taskForm.subtasks"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="subtask.title"
                        type="text"
                        class="flex-1 px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white shadow-sm"
                        :placeholder="$t('widgets.types.todo.subtaskPlaceholder')"
                        @keyup.enter="addSubtask"
                      />
                      <button
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                        @click="removeSubtask(index)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      class="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                      @click="addSubtask"
                    >
                      {{ $t('widgets.types.todo.addSubtask') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 dark:bg-gray-750 px-5 sm:px-6 py-4 flex justify-end gap-3 sm:gap-4 rounded-b-xl border-t dark:border-gray-700"
            >
              <button
                class="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="closeAddTask"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                class="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from '@core/ui/use-toast';
import { useI18n } from 'vue-i18n';
import {
  Plus,
  Filter,
  CheckCircle2,
  Check,
  Pencil,
  Trash2,
  ListTodo,
  Search,
  Tag,
  Folder,
  Calendar,
  ChevronDown,
  GripVertical,
  X,
  Clock,
  Flag,
  AlertCircle,
} from 'lucide-vue-next';
import EditModeWidget from '@/shared/components/widgets/EditModeWidget.vue';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

const { t } = useI18n();
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

// Define filters
const filters = [
  { value: 'all', label: t('widgets.types.todo.filters.all') },
  { value: 'active', label: t('widgets.types.todo.filters.active') },
  { value: 'completed', label: t('widgets.types.todo.filters.completed') },
  { value: 'overdue', label: t('widgets.types.todo.filters.overdue') },
  { value: 'highPriority', label: t('widgets.types.todo.filters.highPriority') },
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
const sortByDueDate = ref(true);
const sortByPriority = ref(false);
const sortByCategory = ref(false);

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
  { id: 1, name: t('widgets.types.todo.categories.work'), color: 'blue' },
  { id: 2, name: t('widgets.types.todo.categories.personal'), color: 'green' },
  { id: 3, name: t('widgets.types.todo.categories.shopping'), color: 'purple' },
  { id: 4, name: t('widgets.types.todo.categories.health'), color: 'red' },
];

// Tags
const availableTags = [
  { id: 1, name: t('widgets.types.todo.tags.urgent'), color: 'red' },
  { id: 2, name: t('widgets.types.todo.tags.important'), color: 'orange' },
  { id: 3, name: t('widgets.types.todo.tags.later'), color: 'blue' },
  { id: 4, name: t('widgets.types.todo.tags.routine'), color: 'green' },
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
      case 's':
        e.preventDefault();
        if (e.shiftKey) {
          sortByPriority.value = !sortByPriority.value;
          sortByDueDate.value = false;
          sortByCategory.value = false;
        } else {
          sortByDueDate.value = !sortByDueDate.value;
          sortByPriority.value = false;
          sortByCategory.value = false;
        }
        break;
      case 'c':
        e.preventDefault();
        sortByCategory.value = !sortByCategory.value;
        sortByDueDate.value = false;
        sortByPriority.value = false;
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
  } else if (currentFilter.value === 'overdue') {
    result = result.filter(task => isOverdue(task.dueDate));
  } else if (currentFilter.value === 'highPriority') {
    result = result.filter(task => task.priority === 3);
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

  // Sort tasks
  if (sortByDueDate.value) {
    result.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  } else if (sortByPriority.value) {
    result.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  } else if (sortByCategory.value) {
    result.sort((a, b) => {
      const categoryA = categories.find(c => c.id === a.category)?.name || '';
      const categoryB = categories.find(c => c.id === b.category)?.name || '';
      return categoryA.localeCompare(categoryB);
    });
  }

  return result;
});

const getFilterCount = filter => {
  switch (filter) {
    case 'all':
      return tasks.value.length;
    case 'active':
      return tasks.value.filter(task => !task.completed).length;
    case 'completed':
      return tasks.value.filter(task => task.completed).length;
    case 'overdue':
      return tasks.value.filter(task => isOverdue(task.dueDate)).length;
    case 'highPriority':
      return tasks.value.filter(task => task.priority === 3).length;
    default:
      return 0;
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

const isOverdue = date => {
  return new Date(date) < new Date() && !taskForm.value.completed;
};

const getSubtaskProgress = task => {
  if (!task.subtasks?.length) return '';
  const completed = task.subtasks.filter(st => st.completed).length;
  const total = task.subtasks.length;
  return t('widgets.types.todo.subtaskProgress', { completed, total });
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
    subtasks: task.subtasks || [],
    tags: task.tags || [],
    category: task.category,
    description: task.description || '',
    attachments: task.attachments || [],
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
  saveState();
  closeAddTask();
};

const deleteTask = id => {
  tasks.value = tasks.value.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
  saveState();
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

const toggleSubtask = (task, subtask) => {
  subtask.completed = !subtask.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

const addSubtask = () => {
  taskForm.value.subtasks.push({
    id: Date.now(),
    title: '',
    completed: false,
  });
};

const removeSubtask = index => {
  taskForm.value.subtasks.splice(index, 1);
};

// Add computed properties for progress tracking
const totalTasksCount = computed(() => tasks.value.length);
const completedTasksCount = computed(() => tasks.value.filter(task => task.completed).length);
const progressPercentage = computed(() => {
  if (totalTasksCount.value === 0) return 0;
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100);
});

// Add computed properties for task statistics
const overdueTasksCount = computed(() => {
  return tasks.value.filter(task => isOverdue(task.dueDate)).length;
});

const highPriorityTasksCount = computed(() => {
  return tasks.value.filter(task => task.priority === 3).length;
});

const remainingTasksCount = computed(() => {
  return totalTasksCount.value - completedTasksCount.value;
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

/* Add hover effect for interactive elements */
button:hover,
input:hover,
select:hover,
textarea:hover {
  transform: translateY(-1px);
}

/* Add active state for buttons */
button:active {
  transform: translateY(0);
}
</style>
