<template>
  <div class="preset-layout-container">
    <div class="search-container mb-4 relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('dashboard.presetLayouts.search')"
        :class="[
          'w-full px-4 py-2.5 rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'text-sm',
          widgetThemes[currentTheme].bg,
          widgetThemes[currentTheme].text,
          widgetThemes[currentTheme].border,
        ]"
      />
      <Search class="absolute right-3 top-3 text-gray-400" size="18" />
    </div>

    <div class="layouts-grid pt-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
      <div
        v-for="layout in filteredLayouts"
        :key="layout.name"
        :class="[
          'layout-item mb-3 p-4 rounded-lg transition-all duration-200 cursor-pointer',
          'transform hover:translate-y-[-2px]',
          widgetThemes[currentTheme].buttonBg,
          widgetThemes[currentTheme].buttonHover,
          'hover:shadow-lg border border-opacity-10',
        ]"
        @click="$emit('select', layout)"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              'icon-container p-2 rounded-lg transition-colors duration-200',
              widgetThemes[currentTheme].iconBg,
              'hover:opacity-90',
            ]"
          >
            <component
              :is="layout.icon"
              :class="['w-5 h-5', widgetThemes[currentTheme].iconColor]"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 :class="['font-medium text-base mb-1 truncate', widgetThemes[currentTheme].text]">
              {{ $t(`dashboard.presetLayouts.${layout.name}`) }}
            </h3>
            <p :class="['text-sm mb-2 line-clamp-2', widgetThemes[currentTheme].description]">
              {{ $t(`dashboard.presetLayouts.${layout.name}_description`) }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(zone, index) in layout.zones"
                :key="index"
                :class="[
                  'px-2 py-0.5 rounded text-xs font-medium transition-colors duration-200',
                  widgetThemes[currentTheme].tagBg,
                  widgetThemes[currentTheme].tagText,
                  'hover:opacity-90',
                ]"
              >
                {{ zone.size }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';

const props = defineProps({
  layouts: {
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

const searchQuery = ref('');

const filteredLayouts = computed(() => {
  if (!searchQuery.value) return props.layouts;

  const query = searchQuery.value.toLowerCase();
  return props.layouts.filter(layout => {
    const name = layout.name.toLowerCase();
    const description = layout.description.toLowerCase();
    return name.includes(query) || description.includes(query);
  });
});

defineEmits(['select']);
</script>

<style scoped>
.preset-layout-container {
  max-width: 100%;
}

.layouts-grid {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .layout-item {
    transition: none;
  }
}
</style>
