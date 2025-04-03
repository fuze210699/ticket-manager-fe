<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {{ $t('dashboard.title') }}
          </h1>
          <p class="text-gray-500 text-lg">{{ $t('dashboard.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-4">
          <template v-if="isEditMode">
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="saveLayout"
            >
              <Save class="w-5 h-5 mr-2" />
              {{ $t('common.save') }}
            </button>
            <button
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="resetLayout"
            >
              <Undo class="w-5 h-5 mr-2" />
              {{ $t('common.reset') }}
            </button>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="exitEditMode"
            >
              <X class="w-5 h-5 mr-2" />
              {{ $t('common.cancel') }}
            </button>
            <button
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="toggleTheme"
            >
              <Palette class="w-5 h-5 mr-2" />
              {{ $t('dashboard.changeTheme') }}
            </button>
            <button
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="exportLayout"
            >
              <Download class="w-5 h-5 mr-2" />
              {{ $t('dashboard.exportLayout') }}
            </button>
            <label
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm cursor-pointer"
            >
              <Upload class="w-5 h-5 mr-2" />
              {{ $t('dashboard.importLayout') }}
              <input
                type="file"
                accept=".json"
                class="hidden"
                @change="importLayout"
              >
            </label>
          </template>
          <template v-else>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
              @click="enterEditMode"
            >
              <Edit class="w-5 h-5 mr-2" />
              {{ $t('dashboard.editLayout') }}
            </button>
          </template>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex gap-6">
        <!-- Widget Palette (Left Side) -->
        <div v-if="isEditMode" class="w-1/4 space-y-6">
          <div :class="[
            'rounded-xl shadow-lg p-4',
            widgetThemes[currentTheme].bg,
            widgetThemes[currentTheme].text,
            widgetThemes[currentTheme].border,
            'transition-all duration-300'
          ]">
            <h3 class="text-lg font-semibold mb-4">{{ $t('dashboard.presetLayouts.title') }}</h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="preset in presetLayouts"
                :key="preset.name"
                :class="[
                  'p-2 rounded-lg transition-all duration-200 text-center group',
                  widgetThemes[currentTheme].buttonBg,
                  widgetThemes[currentTheme].buttonHover,
                  'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                ]"
                @click="applyPreset(preset)"
              >
                <div :class="[
                  'text-xl mb-1',
                  widgetThemes[currentTheme].iconColor,
                  widgetThemes[currentTheme].buttonHover
                ]">
                  <component :is="preset.icon" class="w-6 h-6" />
                </div>
                <div :class="['text-sm font-medium', widgetThemes[currentTheme].text]">
                  {{ $t(`dashboard.presetLayouts.${preset.name}`) }}
                </div>
              </button>
            </div>
          </div>

          <div :class="[
            'rounded-xl shadow-lg p-6',
            widgetThemes[currentTheme].bg,
            widgetThemes[currentTheme].text,
            widgetThemes[currentTheme].border,
            'transition-all duration-300'
          ]">
            <h3 class="text-xl font-semibold mb-6">{{ $t('dashboard.availableWidgets') }}</h3>
            <div class="space-y-4">
              <div
                v-for="widget in availableWidgets"
                :key="widget.name"
                :class="[
                  'rounded-xl p-4 cursor-move transition-all duration-200',
                  widgetThemes[currentTheme].buttonBg,
                  widgetThemes[currentTheme].buttonHover,
                  'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                ]"
                draggable="true"
                @dragstart="handleDragStart($event, widget)"
                @dragend="handleDragEnd"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'text-xl p-3 rounded-lg',
                    widgetThemes[currentTheme].iconColor,
                    widgetThemes[currentTheme].buttonHover
                  ]">
                    <component :is="widget.icon" class="w-6 h-6" />
                  </div>
                  <div>
                    <h4 :class="['text-sm font-medium', widgetThemes[currentTheme].text]">
                      {{ $t(`widgets.types.${widget.name}.title`) }}
                    </h4>
                    <p :class="['text-xs', widgetThemes[currentTheme].description]">
                      {{ $t(`widgets.types.${widget.name}.description`) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget Drop Zones (Right Side) -->
        <div :class="isEditMode ? 'w-3/4' : 'w-full'">
          <div class="flex flex-wrap gap-6">
            <div
              v-for="(zone, index) in dropZones"
              :key="index"
              v-show="isEditMode || zone.widget"
              class="relative"
              :data-index="index"
              :class="[
                getWidthClass(zone.size),
                'transition-all duration-300 ease-in-out'
              ]"
              draggable="true"
              @dragstart="startDrag(index)"
              @dragend="handleDragEnd"
              @dragover.prevent="handleDragOver($event, index)"
              @dragleave="handleDragLeave"
              @drop.prevent="handleDrop($event, index)"
            >
              <div
                class="rounded-xl shadow-lg p-6 relative group min-h-[16rem]"
                :class="[
                  widgetThemes[currentTheme].bg,
                  widgetThemes[currentTheme].text,
                  widgetThemes[currentTheme].border,
                  { 'border-2 border-dashed': isEditMode },
                  { 'border-blue-500': isDragging && isEditMode },
                  { 'border-gray-300': !isDragging && isEditMode },
                  'transition-all duration-300'
                ]"
              >
                <div v-if="zone.widget" class="h-full">
                  <!-- Widget Controls -->
                  <div
                    v-if="isEditMode"
                    class="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <button
                      :class="[
                        'p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all duration-200',
                        widgetThemes[currentTheme].iconColor
                      ]"
                      @click="removeWidget(index)"
                    >
                      <X class="w-5 h-5" />
                    </button>
                    <button
                      :class="[
                        'p-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200',
                        widgetThemes[currentTheme].iconColor
                      ]"
                      @click="toggleMinimize(index)"
                    >
                      <component :is="zone.minimized ? ChevronDown : ChevronUp" class="w-5 h-5" />
                    </button>
                    <div class="relative">
                      <button
                        :class="[
                          'p-2 rounded-lg hover:bg-green-100 hover:text-green-600 transition-all duration-200',
                          widgetThemes[currentTheme].iconColor
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
                          'transition-all duration-200'
                        ]"
                      >
                        <button
                          v-for="size in sizes"
                          :key="size"
                          :class="[
                            'w-full px-4 py-2 text-left text-sm transition-all duration-200',
                            widgetThemes[currentTheme].buttonHover,
                            { [widgetThemes[currentTheme].buttonBg]: zone.size === size },
                            'hover:bg-opacity-50'
                          ]"
                          @click="setSize(index, size)"
                        >
                          <div class="flex items-center gap-2">
                            <i :class="[getSizeIcon(size), widgetThemes[currentTheme].iconColor]"></i>
                            <span>{{ $t(`dashboard.sizes.${size}`) }}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div
                      class="h-8 w-8 cursor-move text-gray-400 hover:text-gray-600 transition-all duration-200"
                      @mousedown="startDrag(index)"
                    >
                      <GripVertical class="w-5 h-5" />
                    </div>
                  </div>

                  <!-- Widget Content -->
                  <component
                    :is="zone.widget"
                    class="h-full"
                    :class="{ 'opacity-50': zone.minimized }"
                    :isEditMode="isEditMode"
                  />
                </div>
                <div
                  v-else-if="isEditMode"
                  class="absolute inset-0 flex items-center justify-center text-gray-400 drop-zone"
                >
                  <div class="text-center space-y-2">
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
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast
      v-if="toast.show"
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue';
import { useToast } from '@shared/components/ui/use-toast'
import Toast from '@/shared/components/ui/Toast.vue';
import Calendar from '@/shared/components/widgets/Calendar.vue';
import Notes from '@/shared/components/widgets/Notes.vue';
import Weather from '@/shared/components/widgets/Weather.vue';
import Todo from '@/shared/components/widgets/Todo.vue';
import { 
  Save, Undo, X, Palette, Download, Upload, Edit, 
  ChevronDown, ChevronUp, GripVertical, PlusCircle,
  Calendar as CalendarIcon, StickyNote, CloudSun, 
  ListTodo, LayoutGrid, LayoutTemplate, LayoutList,
  AlignJustify, Share2, Square, GripHorizontal
} from 'lucide-vue-next';

const { toast, success } = useToast();

const isEditMode = ref(false);
const isDragging = ref(false);
const draggedWidget = ref(null);
const draggedIndex = ref(null);

const availableWidgets = [
  {
    name: 'calendar',
    component: markRaw(Calendar),
    icon: CalendarIcon
  },
  {
    name: 'notes',
    component: markRaw(Notes),
    icon: StickyNote
  },
  {
    name: 'weather',
    component: markRaw(Weather),
    icon: CloudSun
  },
  {
    name: 'todo',
    component: markRaw(Todo),
    icon: ListTodo
  }
];

const presetLayouts = [
  {
    name: 'default',
    icon: LayoutGrid,
    description: 'Basic layout with one main content area and two side panels',
    zones: [
      { widget: null, minimized: false, size: 'col-12' },
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-6' }
    ]
  },
  {
    name: 'dashboard',
    icon: LayoutTemplate,
    description: 'Perfect for monitoring with one large widget and multiple smaller ones',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' }
    ]
  },
  {
    name: 'grid',
    icon: LayoutList,
    description: 'Equal-sized widgets in a grid pattern',
    zones: [
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' }
    ]
  },
  {
    name: 'contentFocus',
    icon: AlignJustify,
    description: 'Large main content area with sidebar widgets',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' }
    ]
  },
  {
    name: 'social',
    icon: Share2,
    description: 'Optimized for social media feeds and updates',
    zones: [
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-12' }
    ]
  },
  {
    name: 'productivity',
    icon: ListTodo,
    description: 'Balanced layout for task management and productivity tools',
    zones: [
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' }
    ]
  }
];

const dropZones = ref([
  { widget: null, minimized: false, size: 'col-12' }
]);

const sizes = ['col-12', 'col-6', 'col-4', 'col-3'];
const activeSizeMenu = ref(null);

const getWidthClass = (size) => {
  switch (size) {
    case 'col-12':
      return 'w-full';
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

const getSizeIcon = (size) => {
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
  dropZones.value.push({
    widget: null,
    minimized: false,
    size: 'col-12'
  });
  success('New zone added');
};

const applyPreset = (preset) => {
  dropZones.value = [...preset.zones];
  success('Preset layout applied');
};

const enterEditMode = () => {
  isEditMode.value = true;
};

const exitEditMode = () => {
  isEditMode.value = false;
};

const handleDragStart = (event, widget) => {
  if (!isEditMode.value) return;
  isDragging.value = true;
  draggedWidget.value = widget;
  event.dataTransfer.setData('text/plain', widget.name);
  
  // Add dragging class to the dragged element
  const element = event.target;
  element.classList.add('dragging');
  element.style.opacity = '0.5';
  element.style.transform = 'scale(1.05)';
};

const handleDragOver = (event, index) => {
  if (!isEditMode.value) return;
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

const handleDragLeave = (event) => {
  if (!isEditMode.value) return;
  
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
  if (!isEditMode.value) return;
  
  // Remove drop-target class
  const element = event.currentTarget;
  element.classList.remove('drop-target');
  
  // Remove visual feedback for drop zones
  const dropZone = element.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.classList.remove('drop-zone-active');
  }
  
  if (draggedWidget.value) {
    // Add new widget with animation
    dropZones.value[index].widget = markRaw(draggedWidget.value.component);
    dropZones.value[index].minimized = false;
    dropZones.value[index].size = 'col-12';
    success('Widget added successfully');
  } else if (draggedIndex.value !== null) {
    // Reorder existing widget with animation
    const temp = dropZones.value[draggedIndex.value].widget;
    dropZones.value[draggedIndex.value].widget = dropZones.value[index].widget;
    dropZones.value[index].widget = temp;
    success('Widget reordered successfully');
  }
};

const handleDragEnd = (event) => {
  isDragging.value = false;
  draggedWidget.value = null;
  draggedIndex.value = null;
  
  // Remove dragging class from all elements
  document.querySelectorAll('.dragging').forEach(el => {
    el.classList.remove('dragging');
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });
  
  // Remove drop-target class from all elements
  document.querySelectorAll('.drop-target').forEach(el => {
    el.classList.remove('drop-target');
  });
  
  // Remove visual feedback from all drop zones
  document.querySelectorAll('.drop-zone-active').forEach(el => {
    el.classList.remove('drop-zone-active');
  });
};

const removeWidget = (index) => {
  if (!isEditMode.value) return;
  dropZones.value[index].widget = null;
  dropZones.value[index].minimized = false;
  dropZones.value[index].size = 'col-12';
  success('Widget removed successfully');
};

const toggleMinimize = (index) => {
  if (!isEditMode.value) return;
  dropZones.value[index].minimized = !dropZones.value[index].minimized;
};

const toggleSizeMenu = (index) => {
  if (!isEditMode.value) return;
  activeSizeMenu.value = activeSizeMenu.value === index ? null : index;
};

const setSize = (index, size) => {
  if (!isEditMode.value) return;
  dropZones.value[index].size = size;
  activeSizeMenu.value = null;
};

const startDrag = (index) => {
  if (!isEditMode.value) return;
  isDragging.value = true;
  draggedIndex.value = index;
  const element = document.querySelector(`[data-index="${index}"]`);
  if (element) {
    element.setAttribute('draggable', true);
    event.dataTransfer.setData('text/plain', 'reorder');
  }
};

const saveLayout = () => {
  const layout = dropZones.value.map(zone => ({
    widget: zone.widget ? availableWidgets.find(w => w.component === zone.widget)?.name : null,
    minimized: zone.minimized,
    size: zone.size
  }));
  localStorage.setItem('widgetLayout', JSON.stringify(layout));
  success('Layout saved successfully');
  exitEditMode();
};

const resetLayout = () => {
  dropZones.value = [{ widget: null, minimized: false, size: 'col-12' }];
  success('Layout reset successfully');
};

const exportLayout = () => {
  const layout = {
    zones: dropZones.value.map(zone => ({
      widget: zone.widget ? availableWidgets.find(w => w.component === zone.widget)?.name : null,
      minimized: zone.minimized,
      size: zone.size
    })),
    timestamp: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workspace-layout-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  success('Layout exported successfully');
};

const importLayout = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const layout = JSON.parse(text);

    if (!layout.version || !layout.zones) {
      throw new Error('Invalid layout file');
    }

    dropZones.value = layout.zones.map(item => ({
      widget: item.widget ? markRaw(availableWidgets.find(w => w.name === item.widget)?.component) : null,
      minimized: item.minimized,
      size: item.size || 'col-12'
    }));

    success('Layout imported successfully');
  } catch (error) {
    console.error('Failed to import layout:', error);
    error('Failed to import layout');
  }
};

const widgetThemes = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    buttonBg: 'bg-gray-50',
    buttonHover: 'hover:bg-gray-100',
    iconColor: 'text-blue-600',
    description: 'text-gray-600'
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    buttonBg: 'bg-gray-800',
    buttonHover: 'hover:bg-gray-700',
    iconColor: 'text-blue-400',
    description: 'text-gray-400'
  },
  colorful: {
    bg: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    text: 'text-white',
    border: 'border-white border-opacity-20',
    hover: 'hover:opacity-90',
    buttonBg: 'bg-white/15',
    buttonHover: 'hover:bg-white hover:bg-opacity-25',
    iconColor: 'text-white',
    description: 'text-white text-opacity-80'
  }
};

const currentTheme = ref('light');

const toggleTheme = () => {
  const themes = Object.keys(widgetThemes);
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];
  success(`Theme changed to ${currentTheme.value}`);
};

onMounted(() => {
  const savedLayout = localStorage.getItem('widgetLayout');
  if (savedLayout) {
    try {
      const layout = JSON.parse(savedLayout);
      if (Array.isArray(layout)) {
        dropZones.value = layout.map(item => {
          const widget = item?.widget ? availableWidgets.find(w => w.name === item.widget) : null;
          return {
            widget: widget?.component ? markRaw(widget.component) : null,
            minimized: item?.minimized ?? false,
            size: item?.size || 'col-12'
          };
        });
      } else if (layout.zones && Array.isArray(layout.zones)) {
        // Handle new format with version and timestamp
        dropZones.value = layout.zones.map(item => {
          const widget = item?.widget ? availableWidgets.find(w => w.name === item.widget) : null;
          return {
            widget: widget?.component ? markRaw(widget.component) : null,
            minimized: item?.minimized ?? false,
            size: item?.size || 'col-12'
          };
        });
      } else {
        console.warn('Invalid layout format, resetting to default');
        resetLayout();
      }
    } catch (error) {
      console.error('Failed to load saved layout:', error);
      resetLayout();
    }
  }
});
</script>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.w-1\/2 {
  width: calc(50% - 0.75rem);
}

.w-1\/3 {
  width: calc(33.333333% - 0.75rem);
}

.w-1\/4 {
  width: calc(25% - 0.75rem);
}

.widget-container {
  transition: all 0.3s ease;
}

.dragging {
  cursor: grabbing;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.02) rotate(1deg);
}

.drop-target {
  transform: scale(1.02);
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drop-zone {
  transition: all 0.2s ease;
}

.drop-zone-active {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Add smooth transitions for all interactive elements */
button, .widget-container, .drop-zone {
  transition: all 0.2s ease;
}

/* Add hover effects for interactive elements */
button:hover, .widget-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Add active state for buttons */
button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
}

/* Add focus styles for accessibility */
button:focus, .widget-container:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Add glass effect for dark theme */
.dark .widget-container {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Add gradient overlay for colorful theme */
.colorful .widget-container {
  position: relative;
}

.colorful .widget-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: inherit;
  pointer-events: none;
}
</style> 