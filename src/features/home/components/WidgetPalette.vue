<template>
  <div class="w-1/4 space-y-6">
    <div
      :class="[
        'rounded-xl shadow-lg p-4',
        widgetThemes[currentTheme].bg,
        widgetThemes[currentTheme].text,
        widgetThemes[currentTheme].border,
        'transition-all duration-300',
      ]"
    >
      <h3 class="text-lg font-semibold mb-4">{{ $t('dashboard.presetLayouts.title') }}</h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="preset in presetLayouts"
          :key="preset.name"
          :class="[
            'p-2 rounded-lg transition-all duration-200 text-center group flex items-center justify-center flex-col',
            widgetThemes[currentTheme].buttonBg,
            widgetThemes[currentTheme].buttonHover,
            'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
          ]"
          @click="applyPreset(preset)"
        >
          <div
            :class="[
              'text-xl mb-1',
              widgetThemes[currentTheme].iconColor,
              widgetThemes[currentTheme].buttonHover,
            ]"
          >
            <component :is="preset.icon" class="w-6 h-6" />
          </div>
          <div :class="['text-sm font-medium', widgetThemes[currentTheme].text]">
            {{ $t(`dashboard.presetLayouts.${preset.name}`) }}
          </div>
        </button>
      </div>
    </div>

    <div
      :class="[
        'rounded-xl shadow-lg p-6',
        widgetThemes[currentTheme].bg,
        widgetThemes[currentTheme].text,
        widgetThemes[currentTheme].border,
        'transition-all duration-300',
      ]"
    >
      <h3 class="text-xl font-semibold mb-6">{{ $t('dashboard.availableWidgets') }}</h3>
      <div class="space-y-4">
        <div
          v-for="widget in availableWidgets"
          :key="widget.name"
          :class="[
            'rounded-xl p-4 cursor-move transition-all duration-200',
            widgetThemes[currentTheme].buttonBg,
            widgetThemes[currentTheme].buttonHover,
            'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
          ]"
          draggable="true"
          @dragstart="handleDragStart($event, widget)"
          @dragend="handleDragEnd"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'text-xl p-3 rounded-lg',
                widgetThemes[currentTheme].iconColor,
                widgetThemes[currentTheme].buttonHover,
              ]"
            >
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
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  availableWidgets: {
    type: Array,
    required: true,
  },
  presetLayouts: {
    type: Array,
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
});

const emit = defineEmits(['apply-preset', 'drag-start', 'drag-end']);

const handleDragStart = (event, widget) => {
  emit('drag-start', event, widget);
};

const handleDragEnd = () => {
  emit('drag-end');
};

const applyPreset = preset => {
  emit('apply-preset', preset);
};
</script>
