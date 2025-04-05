<template>
  <BaseEdge :path="path[0]" />
  <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px, ${path[2]}px)`,
      }"
      class="bg-gray-800 text-white text-xs px-2 py-1 rounded"
      :aria-label="t(`dependency.types.${data.type}`)"
    >
      {{ t(`dependency.types.${data.type}`) }}
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  data: Object,
});

const path = computed(() => getBezierPath(props));
</script>
