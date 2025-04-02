<template>
  <BaseEdge :path="path[0]" />
  <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px, ${path[2]}px)`,
      }"
      class="bg-gray-800 text-white text-xs px-2 py-1 rounded"
    >
      {{ data.type }}
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

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
