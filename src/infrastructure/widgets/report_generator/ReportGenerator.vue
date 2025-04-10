<template>
  <EditModeWidget v-if="isEditMode" :icon="BookOpen" />
  <div v-else class="report-generator">
    <div class="header">
      <h2>{{ $t('widgets.types.reportGenerator.title') }}</h2>
      <div class="header-subtitle">{{ $t('widgets.types.reportGenerator.subtitle') }}</div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label>{{ $t('widgets.types.reportGenerator.projectName') }}:</label>
        <input
          v-model="projectName"
          type="text"
          :placeholder="$t('widgets.types.reportGenerator.projectNamePlaceholder')"
        />
      </div>

      <div class="task-section">
        <div class="section-header">
          <h3>{{ $t('widgets.types.reportGenerator.taskList') }}</h3>
          <button class="add-btn" @click="addTask">
            <span class="icon">+</span>{{ $t('widgets.types.reportGenerator.addTask') }}
          </button>
        </div>

        <div class="task-list">
          <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <select v-model="task.status" class="status-select">
              <option value="[ ]">
                {{ $t('widgets.types.reportGenerator.status.notStarted') }}
              </option>
              <option value="[w]">
                {{ $t('widgets.types.reportGenerator.status.inProgress') }}
              </option>
              <option value="[x]">
                {{ $t('widgets.types.reportGenerator.status.completed') }}
              </option>
            </select>
            <input
              v-model="task.content"
              type="text"
              :placeholder="$t('widgets.types.reportGenerator.taskPlaceholder')"
            />
            <button class="remove-btn" @click="removeTask(index)">
              {{ $t('widgets.types.reportGenerator.deleteTask') }}
            </button>
          </div>
        </div>
      </div>

      <button class="generate-btn" @click="copyToClipboard">
        <span class="icon">📋</span>
        <span v-if="!copySuccess">{{ $t('widgets.types.reportGenerator.generateReport') }}</span>
        <span v-else>{{ $t('widgets.types.reportGenerator.copied') }}</span>
      </button>
    </div>

    <div class="preview-section">
      <div class="section-header">
        <h3>{{ $t('widgets.types.reportGenerator.preview') }}</h3>
      </div>
      <div class="preview-content">
        <pre>{{ generatedReport }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EditModeWidget from '@infrastructure/widgets/EditModeWidget.vue';
import { BookOpen } from 'lucide-vue-next';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const projectName = ref('');
const tasks = ref([{ status: '[ ]', content: '' }]);
const copySuccess = ref(false);

const addTask = () => {
  tasks.value.push({ status: '[ ]', content: '' });
};

const removeTask = index => {
  tasks.value.splice(index, 1);
};

const generateReport = () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '/');

  let report = `## ${dateStr} 作業報告\n`;
  if (projectName.value.trim()) {
    report += `  ### ${projectName.value}\n`;
  }

  const hasContent = tasks.value.some(task => task.content.trim());

  if (hasContent) {
    tasks.value.forEach(task => {
      if (task.content.trim()) {
        report += `   - ${task.status} ${task.content}\n`;
      }
    });
  } else if (!projectName.value.trim()) {
    report = t('widgets.types.reportGenerator.emptyState');
  }

  return report;
};

const generatedReport = computed(() => {
  return generateReport();
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedReport.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

// Watch for changes to update preview in real-time
watch(
  [projectName, tasks],
  () => {
    // The computed property will automatically update
  },
  { deep: true }
);
</script>

<style scoped>
.report-generator {
  padding: 20px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .report-generator {
    padding: 15px;
  }
}

.header {
  margin-bottom: 24px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 16px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

.header-subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 4px;
}

.form-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.task-section {
  margin-bottom: 24px;
}

.task-list {
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 8px;
  background-color: #f9f9f9;
  max-height: 300px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s;
  flex-wrap: wrap;
}

.task-item:hover {
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .task-item {
    flex-direction: column;
    align-items: stretch;
  }

  .status-select {
    width: 100%;
    margin-bottom: 8px;
  }

  .task-item input {
    width: 100%;
    margin-bottom: 8px;
  }

  .remove-btn {
    align-self: flex-end;
  }
}

.status-select {
  width: 100px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #2c3e50;
  font-size: 14px;
}

.task-item input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.task-item input:focus,
.status-select:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.icon {
  display: inline-block;
  margin-right: 5px;
}

.remove-btn {
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: #e60000;
}

.add-btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #3d9640;
}

.generate-btn {
  padding: 12px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.generate-btn:hover {
  background-color: #0d8aee;
}

.preview-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-section .section-header {
  background-color: #f1f1f1;
  padding: 12px 16px;
  margin-bottom: 0;
}

.preview-content {
  padding: 16px;
  background-color: #f8f8f8;
  border-top: 1px solid #eaeaea;
  min-height: 150px;
}

.preview-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Consolas', 'Monaco', monospace;
  line-height: 1.5;
  color: #2c3e50;
  margin: 0;
}
</style>
