<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div class="mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold bg-clip-text text-primary">
            {{ $t('dashboard.title') }}
          </h1>
          <p class="text-gray-500 text-lg">{{ $t('dashboard.subtitle') }}</p>
        </div>
        <HeaderActions
          :is-edit-mode="isEditMode"
          :has-any-widgets="hasAnyWidgets"
          @save="saveLayout"
          @reset="resetLayout"
          @exit-edit-mode="exitEditMode"
          @enter-edit-mode="enterEditMode"
          @toggle-theme="toggleTheme"
          @export="exportLayout"
          @import="importLayout"
        />
      </div>

      <!-- Main Content -->
      <div class="flex gap-6">
        <!-- Widget Palette (Left Side) -->
        <WidgetPalette
          v-if="isEditMode"
          :available-widgets="availableWidgets"
          :preset-layouts="presetLayouts"
          :current-theme="currentTheme"
          :widget-themes="widgetThemes"
          @apply-preset="applyPreset"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
        />

        <!-- Widget Drop Zones (Right Side) -->
        <DropZoneContainer
          :drop-zones="dropZones"
          :is-edit-mode="isEditMode"
          :is-dragging="isDragging"
          :current-theme="currentTheme"
          :widget-themes="widgetThemes"
          :sizes="sizes"
          @add-zone="addZone"
          @remove-widget="removeWidget"
          @toggle-minimize="toggleMinimize"
          @set-size="setSize"
          @start-drag="startDrag"
          @handle-drag-end="handleDragEnd"
          @handle-drop="handleDrop"
          @enter-edit-mode="enterEditMode"
          @remove-zone="removeZone"
        />
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast v-if="toast.show" :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw, computed } from 'vue';
import { useToast } from '@core/ui/use-toast';
import Toast from '@core/ui/Toast.vue';
import HeaderActions from '../components/HeaderActions.vue';
import WidgetPalette from '../components/WidgetPalette.vue';
import DropZoneContainer from '../components/DropZoneContainer.vue';
import {
  AVAILABLE_WIDGETS,
  PRESET_LAYOUTS,
  WIDGET_THEMES,
  SIZES,
} from '../components/dashboard-constants';
import { handleDragEnd } from '../components/drag-drop-utils';

const { toast, success, warning } = useToast();

const isEditMode = ref(false);
const isDragging = ref(false);
const draggedWidget = ref(null);
const draggedIndex = ref(null);

const availableWidgets = AVAILABLE_WIDGETS;
const presetLayouts = PRESET_LAYOUTS;
const widgetThemes = WIDGET_THEMES;
const sizes = SIZES;

const dropZones = ref([{ widget: null, minimized: false, size: 'col-6' }]);
const currentTheme = ref('light');

// Kiểm tra xem có widget nào trong bất kỳ zone nào không
const hasAnyWidgets = computed(() => {
  return dropZones.value.some(zone => zone.widget !== null);
});

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

const handleDrop = (event, index) => {
  if (!isEditMode.value) return;

  if (draggedWidget.value) {
    // Add new widget with animation
    dropZones.value[index].widget = markRaw(draggedWidget.value.component);
    dropZones.value[index].minimized = false;
    success('Widget added successfully');
  } else if (draggedIndex.value !== null) {
    // Reorder existing widget with animation
    const temp = dropZones.value[draggedIndex.value].widget;
    dropZones.value[draggedIndex.value].widget = dropZones.value[index].widget;
    dropZones.value[index].widget = temp;
    success('Widget reordered successfully');
  }

  // Reset dragging state
  isDragging.value = false;
  draggedWidget.value = null;
  draggedIndex.value = null;
};

const removeWidget = index => {
  if (!isEditMode.value) return;
  dropZones.value[index].widget = null;
  dropZones.value[index].minimized = false;
  success('Widget removed successfully');
};

const toggleMinimize = index => {
  if (!isEditMode.value) return;
  dropZones.value[index].minimized = !dropZones.value[index].minimized;
};

const setSize = (index, size) => {
  if (!isEditMode.value) return;
  dropZones.value[index].size = size;
};

const startDrag = index => {
  if (!isEditMode.value) return;
  isDragging.value = true;
  draggedIndex.value = index;
  const element = document.querySelector(`[data-index="${index}"]`);
  if (element) {
    element.setAttribute('draggable', true);
    if (event) {
      event.dataTransfer.setData('text/plain', 'reorder');
    }
  }
};

const addZone = () => {
  dropZones.value.push({
    widget: null,
    minimized: false,
    size: 'col-6',
  });
  success('New zone added');
};

const removeZone = index => {
  if (!isEditMode.value) return;
  // Don't remove the last zone
  if (dropZones.value.length <= 1) {
    warning('Cannot remove the last zone');
    return;
  }
  dropZones.value.splice(index, 1);
  success('Zone removed');
};

const applyPreset = preset => {
  dropZones.value = [...preset.zones];
  success('Preset layout applied');
};

const saveLayout = () => {
  const layout = dropZones.value.map(zone => ({
    widget: zone.widget ? availableWidgets.find(w => w.component === zone.widget)?.name : null,
    minimized: zone.minimized,
    size: zone.size,
  }));
  localStorage.setItem('widgetLayout', JSON.stringify(layout));
  success('Layout saved successfully');
  exitEditMode();
};

const resetLayout = () => {
  dropZones.value = [{ widget: null, minimized: false, size: 'col-6' }];
  success('Layout reset successfully');
};

const toggleTheme = () => {
  const themes = Object.keys(widgetThemes);
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];
  success(`Theme changed to ${currentTheme.value}`);
};

const exportLayout = () => {
  const layout = {
    zones: dropZones.value.map(zone => ({
      widget: zone.widget ? availableWidgets.find(w => w.component === zone.widget)?.name : null,
      minimized: zone.minimized,
      size: zone.size,
    })),
    timestamp: new Date().toISOString(),
    version: '1.0',
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

const importLayout = async event => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const layout = JSON.parse(text);

    if (!layout.version || !layout.zones) {
      throw new Error('Invalid layout file');
    }

    dropZones.value = layout.zones.map(item => ({
      widget: item.widget
        ? markRaw(availableWidgets.find(w => w.name === item.widget)?.component)
        : null,
      minimized: item.minimized,
      size: item.size || 'col-6',
    }));

    success('Layout imported successfully');
  } catch (error) {
    console.error('Failed to import layout:', error);
    toast({
      message: 'Failed to import layout',
      type: 'error',
      show: true,
    });
  }
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
            size: item?.size || 'col-6',
          };
        });
      } else if (layout.zones && Array.isArray(layout.zones)) {
        // Handle new format with version and timestamp
        dropZones.value = layout.zones.map(item => {
          const widget = item?.widget ? availableWidgets.find(w => w.name === item.widget) : null;
          return {
            widget: widget?.component ? markRaw(widget.component) : null,
            minimized: item?.minimized ?? false,
            size: item?.size || 'col-6',
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

/* Precise calculations for width with gap-4 (1rem) */
.w-1\/2 {
  width: calc(50% - 0.5rem); /* Half the gap (1rem / 2) */
}

.w-1\/3 {
  width: calc(33.333333% - 0.6667rem); /* Adjusted for 3-column layout */
}

.w-1\/4 {
  width: calc(25% - 0.75rem); /* Adjusted for 4-column layout */
}

.widget-container {
  transition: all 0.3s ease;
}

.dragging {
  cursor: grabbing;
  transition: all 0.2s ease;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.02) rotate(1deg);
}

.drop-target {
  transform: scale(1.02);
  transition: all 0.2s ease;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drop-zone {
  transition: all 0.2s ease;
}

.drop-zone-active {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: scale(1.02);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Add smooth transitions for all interactive elements */
button,
.widget-container,
.drop-zone {
  transition: all 0.2s ease;
}

/* Add hover effects for interactive elements */
button:hover,
.widget-container:hover {
  transform: translateY(-1px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Add active state for buttons */
button:active {
  transform: translateY(1px);
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.05);
}

/* Add focus styles for accessibility */
button:focus,
.widget-container:focus {
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
