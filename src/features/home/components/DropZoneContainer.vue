<template>
  <div :class="isEditMode ? 'w-3/4' : 'w-full'">
    <div class="flex flex-wrap gap-4 drop-zone-grid">
      <!-- Empty state message when not in edit mode and no widgets -->
      <div
        v-if="!isEditMode && !hasAnyWidgets"
        class="w-full py-12 flex flex-col items-center justify-center text-center rounded-xl shadow-md bg-white"
      >
        <div class="text-gray-400 mb-4">
          <PlusCircle class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">{{ $t('dashboard.noWidgets') }}</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">{{ $t('dashboard.addWidgetsDesc') }}</p>
        <Button variant="outline" @click="$emit('enter-edit-mode')">
          <Edit class="w-5 h-5 mr-2" />
          {{ $t('dashboard.editLayout') }}
        </Button>
      </div>

      <div
        v-for="(zone, index) in dropZones"
        v-show="isEditMode || zone.widget"
        :key="index"
        class="relative"
        :data-index="index"
        :class="[getWidthClass(zone.size), 'transition-all duration-300 ease-in-out']"
        :draggable="isEditMode"
        @dragstart="isEditMode && startDrag(index)"
        @dragend="isEditMode && handleDragEnd"
        @dragover.prevent="isEditMode && handleDragOver"
        @dragleave="isEditMode && handleDragLeave"
        @drop.prevent="isEditMode && handleDrop($event, index)"
      >
        <div
          class="rounded-xl shadow-lg relative group min-h-[16rem]"
          :class="[
            widgetThemes[currentTheme].bg,
            widgetThemes[currentTheme].text,
            widgetThemes[currentTheme].border,
            { 'border-2 border-dashed': isEditMode },
            { 'border-blue-500': isDragging && isEditMode },
            { 'border-gray-300': !isDragging && isEditMode },
            'transition-all duration-300',
          ]"
        >
          <!-- Width selector in edit mode -->
          <div
            v-if="isEditMode"
            class="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <div class="relative">
              <button
                :class="[
                  'p-1.5 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 flex items-center gap-1',
                  widgetThemes[currentTheme].iconColor,
                  'text-xs bg-white/80',
                ]"
                @click="toggleWidthMenu(index)"
              >
                <component :is="getSizeIcon(zone.size)" class="w-3.5 h-3.5" />
                <span class="hidden sm:inline text-xs font-medium">{{
                  $t(`dashboard.sizes.${zone.size}`)
                }}</span>
                <ChevronDown class="w-3 h-3" />
              </button>
              <div
                v-if="activeWidthMenu === index"
                :class="[
                  'absolute left-0 mt-1 w-28 rounded-lg shadow-lg py-1 z-20',
                  widgetThemes[currentTheme].bg,
                  widgetThemes[currentTheme].border,
                  'transition-all duration-200 border',
                ]"
              >
                <button
                  v-for="size in sizes"
                  :key="size"
                  :class="[
                    'w-full px-2 py-1.5 text-left text-xs transition-all duration-200 flex items-center gap-1.5',
                    widgetThemes[currentTheme].buttonHover,
                    { [widgetThemes[currentTheme].buttonBg]: zone.size === size },
                    'hover:bg-opacity-50',
                  ]"
                  @click="setSize(index, size)"
                >
                  <component :is="getSizeIcon(size)" class="w-3.5 h-3.5" />
                  <span>{{ $t(`dashboard.sizes.${size}`) }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Delete button for empty dropzones -->
          <div
            v-if="isEditMode && !zone.widget"
            class="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <button
              :class="[
                'p-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200',
                widgetThemes[currentTheme].iconColor,
                'bg-white/80 shadow-sm',
              ]"
              @click="removeZone(index)"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div v-if="zone.widget" class="h-full">
            <!-- Widget Controls -->
            <div
              v-if="isEditMode"
              class="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <button
                :class="[
                  'p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200',
                  widgetThemes[currentTheme].iconColor,
                ]"
                @click="removeWidget(index)"
              >
                <X class="w-5 h-5" />
              </button>
              <button
                :class="[
                  'p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200',
                  widgetThemes[currentTheme].iconColor,
                ]"
                @click="toggleMinimize(index)"
              >
                <component :is="zone.minimized ? ChevronDown : ChevronUp" class="w-5 h-5" />
              </button>
              <div class="relative">
                <button
                  :class="[
                    'p-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition-all duration-200',
                    widgetThemes[currentTheme].iconColor,
                  ]"
                  @click="toggleSizeMenu(index)"
                >
                  <GripVertical class="w-5 h-5" />
                </button>
                <div
                  v-if="activeSizeMenu === index"
                  :class="[
                    'absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-10',
                    widgetThemes[currentTheme].bg,
                    widgetThemes[currentTheme].border,
                    'transition-all duration-200',
                  ]"
                >
                  <button
                    v-for="size in sizes"
                    :key="size"
                    :class="[
                      'w-full px-4 py-2 text-left text-sm transition-all duration-200',
                      widgetThemes[currentTheme].buttonHover,
                      { [widgetThemes[currentTheme].buttonBg]: zone.size === size },
                      'hover:bg-opacity-50',
                    ]"
                    @click="setSize(index, size)"
                  >
                    <div class="flex items-center gap-2">
                      <component :is="getSizeIcon(size)" class="w-5 h-5" />
                      <span>{{ $t(`dashboard.sizes.${size}`) }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Widget Content -->
            <div class="p-3">
              <component
                :is="zone.widget"
                class="h-full"
                :class="{ 'opacity-50': zone.minimized }"
                :is-edit-mode="isEditMode"
                @remove="removeWidget(index)"
              />
            </div>
          </div>
          <div
            v-else-if="isEditMode"
            class="absolute inset-0 flex items-center justify-center text-gray-400 drop-zone"
          >
            <div class="text-center space-y-2 flex items-center justify-center flex-col">
              <PlusCircle class="w-10 h-10" />
              <p class="text-lg">{{ $t('dashboard.dropZone') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Add Zone Button -->
      <button
        v-if="isEditMode"
        class="w-full px-6 py-4 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm flex items-center justify-center gap-3"
        @click="addZone"
      >
        <PlusCircle class="w-5 h-5" />
        <span class="text-lg">{{ $t('dashboard.addZone') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
  PlusCircle,
  Square,
  GripHorizontal,
  LayoutTemplate,
  LayoutList,
  Edit,
} from 'lucide-vue-next';
import Button from '@/core/ui/Button.vue';

const props = defineProps({
  dropZones: {
    type: Array,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    required: true,
  },
  isDragging: {
    type: Boolean,
    required: true,
  },
  currentTheme: {
    type: String,
    required: true,
  },
  widgetThemes: {
    type: Object,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  'add-zone',
  'remove-widget',
  'toggle-minimize',
  'set-size',
  'start-drag',
  'handle-drag-end',
  'handle-drop',
  'enter-edit-mode',
  'remove-zone',
]);

const activeSizeMenu = ref(null);
const activeWidthMenu = ref(null);

// Check if any zone has a widget
const hasAnyWidgets = computed(() => {
  return props.dropZones.some(zone => zone.widget !== null);
});

const getWidthClass = size => {
  switch (size) {
    case 'col-12':
      return 'w-full';
    case 'col-9':
      return 'w-3/4';
    case 'col-6':
      return 'w-1/2';
    case 'col-4':
      return 'w-1/3';
    case 'col-3':
      return 'w-1/4';
    default:
      return 'w-full';
  }
};

const getSizeIcon = size => {
  switch (size) {
    case 'col-12':
      return Square;
    case 'col-6':
      return GripHorizontal;
    case 'col-4':
      return LayoutTemplate;
    case 'col-3':
      return LayoutList;
    default:
      return Square;
  }
};

const addZone = () => {
  emit('add-zone');
};

const removeWidget = index => {
  emit('remove-widget', index);
};

const toggleMinimize = index => {
  emit('toggle-minimize', index);
};

const toggleSizeMenu = index => {
  if (!props.isEditMode) return;
  activeSizeMenu.value = activeSizeMenu.value === index ? null : index;
  // Close width menu if it's open
  activeWidthMenu.value = null;
};

const setSize = (index, size) => {
  emit('set-size', index, size);
  activeSizeMenu.value = null;
};

const startDrag = index => {
  emit('start-drag', index);
};

const handleDragEnd = event => {
  emit('handle-drag-end', event);
};

const handleDragOver = event => {
  if (!props.isEditMode) return;
  event.preventDefault();

  // Add drop-target class to the element being dragged over
  const element = event.currentTarget;
  element.classList.add('drop-target');

  // Add visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.add('drop-zone-active');
  }
};

const handleDragLeave = event => {
  if (!props.isEditMode) return;

  // Remove drop-target class when leaving the element
  const element = event.currentTarget;
  element.classList.remove('drop-target');

  // Remove visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.remove('drop-zone-active');
  }
};

const handleDrop = (event, index) => {
  if (!props.isEditMode) return;

  // Remove drop-target class
  const element = event.currentTarget;
  element.classList.remove('drop-target');

  // Remove visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.remove('drop-zone-active');
  }

  emit('handle-drop', event, index);
};

const toggleWidthMenu = index => {
  if (!props.isEditMode) return;
  activeWidthMenu.value = activeWidthMenu.value === index ? null : index;
  // Close size menu if it's open
  activeSizeMenu.value = null;
};

const removeZone = index => {
  emit('remove-zone', index);
};
</script>

<style scoped>
.drop-zone-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.drop-zone-grid > .w-full {
  width: 100%;
}

.drop-zone-grid > .w-3\/4 {
  width: calc(66.666666% - 0.333rem);
  max-width: calc(66.666666% - 0.333rem);
}

.drop-zone-grid > .w-1\/2 {
  width: calc(50% - 0.5rem);
  max-width: calc(50% - 0.5rem);
}

.drop-zone-grid > .w-1\/3 {
  width: calc(33.333333% - 0.667rem);
  max-width: calc(33.333333% - 0.667rem);
}

.drop-zone-grid > .w-1\/4 {
  width: calc(25% - 0.75rem);
  max-width: calc(25% - 0.75rem);
}

/* Make sure the items don't grow beyond their intended width */
.drop-zone-grid > [class*='w-'] {
  flex-grow: 0;
  flex-shrink: 0;
}

/* Ensure proper row alignment for col-3 and col-9 */
.drop-zone-grid > .w-3\/4 + .w-1\/4,
.drop-zone-grid > .w-1\/4 + .w-3\/4 {
  margin-left: 0;
}
</style>
