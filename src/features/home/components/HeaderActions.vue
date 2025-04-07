<template>
  <div class="flex items-center gap-4">
    <template v-if="isEditMode">
      <Button variant="primary" @click="saveLayout">
        <Save class="w-5 h-5 mr-2" />
        {{ $t('common.save') }}
      </Button>
      <Button variant="secondary" @click="resetLayout">
        <Undo class="w-5 h-5 mr-2" />
        {{ $t('common.reset') }}
      </Button>
      <Button variant="destructive" @click="exitEditMode">
        <X class="w-5 h-5 mr-2" />
        {{ $t('common.cancel') }}
      </Button>
      <Button variant="primary" @click="toggleTheme">
        <Palette class="w-5 h-5 mr-2" />
        {{ $t('dashboard.changeTheme') }}
      </Button>
      <Button variant="primary" @click="exportLayout">
        <Download class="w-5 h-5 mr-2" />
        {{ $t('dashboard.exportLayout') }}
      </Button>
      <Button variant="primary">
        <Upload class="w-5 h-5 mr-2" />
        {{ $t('dashboard.importLayout') }}
        <input type="file" accept=".json" class="hidden" @change="handleImportLayout" />
      </Button>
    </template>
    <template v-else-if="hasAnyWidgets">
      <Button variant="primary" @click="enterEditMode">
        <Edit class="w-5 h-5 mr-2" />
        {{ $t('dashboard.editLayout') }}
      </Button>
    </template>
  </div>
</template>

<script setup>
import { Save, Undo, X, Palette, Download, Upload, Edit } from 'lucide-vue-next';
import Button from '@/core/ui/Button.vue';

defineProps({
  isEditMode: {
    type: Boolean,
    required: true,
  },
  hasAnyWidgets: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  'save',
  'reset',
  'exit-edit-mode',
  'enter-edit-mode',
  'toggle-theme',
  'export',
  'import',
]);

const saveLayout = () => {
  emit('save');
};

const resetLayout = () => {
  emit('reset');
};

const exitEditMode = () => {
  emit('exit-edit-mode');
};

const enterEditMode = () => {
  emit('enter-edit-mode');
};

const toggleTheme = () => {
  emit('toggle-theme');
};

const exportLayout = () => {
  emit('export');
};

const handleImportLayout = event => {
  emit('import', event);
};
</script>
