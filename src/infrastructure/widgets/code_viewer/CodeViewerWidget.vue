<template>
  <EditModeWidget v-if="isEditMode" :icon="Code" />
  <div v-else class="code-viewer-widget">
    <div class="header">
      <h2>
        <component :is="Code" class="icon" />
        {{ $t('widgets.types.codeViewer.title') }}
      </h2>
      <div class="header-subtitle">{{ $t('widgets.types.codeViewer.subtitle') }}</div>
    </div>

    <div class="code-panel">
      <div class="code-controls">
        <input
          v-model="fileName"
          type="text"
          class="file-name-input"
          :placeholder="$t('widgets.types.codeViewer.fileNamePlaceholder')"
        />
        <select v-model="selectedLanguage" class="language-select">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="vue">Vue</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button class="action-button" @click="toggleFullScreen">
          <component :is="isFullScreen ? Minimize2 : Maximize2" class="icon-sm" />
        </button>
      </div>

      <div class="code-editor-container" :class="{ 'full-screen': isFullScreen }">
        <textarea
          v-model="codeContent"
          class="code-editor"
          :placeholder="$t('widgets.types.codeViewer.codePlaceholder')"
          @input="onCodeInput"
        ></textarea>
        <pre v-if="highlightedCode" class="code-preview" v-html="highlightedCode"></pre>
        <div class="line-numbers">
          <div v-for="i in lineCount" :key="i" class="line-number">{{ i }}</div>
        </div>
      </div>
    </div>

    <div class="refactor-suggestions">
      <div class="section-header">
        <h3>
          <component :is="Sparkles" class="icon" />
          {{ $t('widgets.types.codeViewer.refactorSuggestions') }}
        </h3>
        <button class="analyze-btn" @click="analyzeCode">
          <component :is="Search" class="icon-sm" />
          {{ $t('widgets.types.codeViewer.analyzeCode') }}
        </button>
      </div>
      <div v-if="isAnalyzing" class="analyzing">
        <div class="spinner"></div>
        <span>{{ $t('widgets.types.codeViewer.analyzing') }}</span>
      </div>
      <div v-else-if="suggestions.length > 0" class="suggestions-list">
        <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
          <div class="suggestion-header">
            <span class="suggestion-type">
              <component :is="getIconForSuggestionType(suggestion.category)" class="icon-xs" />
              {{ suggestion.category }} {{ $t('widgets.types.codeViewer.suggestion') }}
            </span>
            <span class="suggestion-line">
              <component :is="FileCode" class="icon-xs" />
              {{ $t('widgets.types.codeViewer.line') }} {{ suggestion.lineNumber }}
            </span>
          </div>
          <div class="suggestion-content">{{ suggestion.description }}</div>
          <div v-if="suggestion.originalSnippet" class="suggestion-original-code">
            <div class="code-label">{{ $t('widgets.types.codeViewer.codeToReplace') }}</div>
            <pre>{{ suggestion.originalSnippet }}</pre>
          </div>
          <div v-if="suggestion.improvedSnippet" class="suggestion-fixed-code">
            <div class="code-label">{{ $t('widgets.types.codeViewer.suggestedCode') }} <span class="not-applied-note">{{ $t('widgets.types.codeViewer.notAppliedYet') }}</span></div>
            <div v-html="suggestion.improvedSnippet"></div>
          </div>
          <button class="apply-btn pulse-animation" @click="applySuggestion(index)">
            <component :is="Check" class="icon-sm" />
            {{ $t('widgets.types.codeViewer.apply') }}
          </button>
        </div>
      </div>
      <div v-else-if="analyzed" class="no-suggestions">
        <component :is="ThumbsUp" class="icon" />
        {{ $t('widgets.types.codeViewer.noSuggestions') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import EditModeWidget from '@infrastructure/widgets/EditModeWidget.vue';
import {
  Code,
  Search,
  Check,
  AlertCircle,
  FileCode,
  Sparkles,
  Maximize2,
  Minimize2,
  ThumbsUp,
  Wrench,
  AlertTriangle,
  Hammer,
} from 'lucide-vue-next';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { deepseekService } from '@/infrastructure/api/deepseekService';

// Import specific languages
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';

// Register the languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
// Use HTML highlighting for Vue files since Vue is not built into highlight.js
hljs.registerLanguage('vue', html);

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const fileName = ref('example.js');
const selectedLanguage = ref('javascript');
const codeContent = ref('');
const highlightedCode = ref('');
const isAnalyzing = ref(false);
const analyzed = ref(false);
const suggestions = ref([]);
const isFullScreen = ref(false);
const errorMessage = ref('');

// Computed property for line count
const lineCount = computed(() => {
  if (!codeContent.value) return 1;
  return codeContent.value.split('\n').length;
});

// Function to toggle full screen mode
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
};

// Function to get the appropriate icon for suggestion type
const getIconForSuggestionType = type => {
  switch (type) {
    case 'Complexity':
      return Wrench;
    case 'Production Code':
      return AlertTriangle;
    case 'Style':
      return Hammer;
    default:
      return AlertCircle;
  }
};

// Sample code for initial load
const sampleCode = {
  javascript:
    '// Example JavaScript code\n' +
    'function calculateSum(numbers) {\n' +
    '  let sum = 0;\n' +
    '  \n' +
    '  // Loop through the array of numbers\n' +
    '  for (let i = 0; i < numbers.length; i++) {\n' +
    '    sum += numbers[i];\n' +
    '    console.log("Running sum: " + sum);\n' +
    '  }\n' +
    '  \n' +
    '  return sum;\n' +
    '}\n' +
    '\n' +
    'const result = calculateSum([1, 2, 3, 4, 5]);\n' +
    'console.log("The sum is: " + result);',

  html:
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '  <title>Sample HTML</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <h1>Hello World</h1>\n' +
    '  <p>This is a sample HTML document.</p>\n' +
    '</body>\n' +
    '</html>',

  css:
    '/* Sample CSS */\n' +
    'body {\n' +
    '  font-family: Arial, sans-serif;\n' +
    '  margin: 0;\n' +
    '  padding: 20px;\n' +
    '  background-color: #f5f5f5;\n' +
    '}\n' +
    '\n' +
    'h1 {\n' +
    '  color: #333;\n' +
    '  border-bottom: 1px solid #ccc;\n' +
    '  padding-bottom: 10px;\n' +
    '}',
};

// Mock refactoring suggestions - in a real app, this would call an API
async function analyzeCode() {
  if (!codeContent.value || isAnalyzing.value) return;
  
  isAnalyzing.value = true;
  errorMessage.value = '';
  
  try {
    // Sử dụng deepseekService để phân tích code
    const apiSuggestions = await deepseekService.analyzeCode(
      codeContent.value,
      selectedLanguage.value || 'js',
      true
    );
    
    // Chuyển đổi kết quả API sang định dạng suggestions
    suggestions.value = apiSuggestions.map(suggestion => ({
      id: suggestion.id || Math.random().toString(36).substring(2, 9),
      line: suggestion.line,
      type: mapCategoryToType(suggestion.category),
      message: suggestion.message,
      explanation: suggestion.explanation || '',
      suggestedCode: suggestion.suggestedCode || '',
      originalCode: suggestion.originalCode || getCodeLine(suggestion.line),
      isApplied: false
    }));
    
    // Phân loại đề xuất
    suggestions.value.sort((a, b) => a.line - b.line);
  } catch (error) {
    console.error('Error analyzing code:', error);
    errorMessage.value = t('codeViewer.analyzeError');
    
    // Chuyển sang phân tích tĩnh nếu API thất bại
    fallbackToStaticAnalysis();
  } finally {
    isAnalyzing.value = false;
  }
}

// Hàm chuyển đổi category từ API sang type hiện tại
function mapCategoryToType(category) {
  const typeMap = {
    'security': 'security',
    'performance': 'performance',
    'bug': 'bug',
    'style': 'style',
    'logic': 'bug',
    'best_practice': 'improvement',
    'refactoring': 'improvement'
  };
  
  return typeMap[category.toLowerCase()] || 'improvement';
}

// Phân tích tĩnh (fallback nếu API thất bại)
function fallbackToStaticAnalysis() {
  console.log('Fallback to static analysis');
  
  // Đây là phân tích cơ bản khi API không hoạt động
  const lines = codeContent.value.split('\n');
  const newSuggestions = [];
  
  // Kiểm tra từ khóa var (nên dùng let/const)
  lines.forEach((line, index) => {
    if (line.trim().startsWith('var ')) {
      newSuggestions.push({
        id: Math.random().toString(36).substring(2, 9),
        line: index + 1,
        type: 'style',
        message: t('codeViewer.suggestions.useLetConst'),
        explanation: t('codeViewer.explanations.useLetConst'),
        suggestedCode: line.replace('var ', 'const '),
        originalCode: line.trim(),
        isApplied: false
      });
    }
  });
  
  suggestions.value = newSuggestions;
}

// Lấy một dòng code cụ thể
function getCodeLine(lineNumber) {
  const lines = codeContent.value.split('\n');
  return lines[lineNumber - 1] || '';
}

// Function to handle code input with debounce
let debounceTimer = null;
const onCodeInput = () => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    highlightCode();

    // After highlighting, ensure scroll positions are in sync
    setTimeout(() => {
      const editor = document.querySelector('.code-editor');
      const preview = document.querySelector('.code-preview');
      const lineNumbers = document.querySelector('.line-numbers');

      if (editor && preview) {
        preview.scrollTop = editor.scrollTop;
        preview.scrollLeft = editor.scrollLeft;
      }

      if (editor && lineNumbers) {
        lineNumbers.scrollTop = editor.scrollTop;

        // Update line numbers height if needed
        if (lineNumbers.offsetHeight < editor.scrollHeight) {
          lineNumbers.style.height = `${editor.scrollHeight}px`;
        }
      }
    }, 10);
  }, 300); // Debounce for 300ms
};

const highlightCode = (code = codeContent.value) => {
  if (!code) {
    highlightedCode.value = '';
    return '';
  }

  // Ensure code is a string
  const codeStr = typeof code === 'string' ? code : String(code);

  try {
    // Try to highlight with the selected language
    const result = hljs.highlight(codeStr, { language: selectedLanguage.value }).value;
    highlightedCode.value = result;
    return result;
  } catch (error) {
    console.warn(`Falling back to autodetection for language: ${selectedLanguage.value}`, error);
    try {
      // If specific language fails, try auto-detection
      const result = hljs.highlightAuto(codeStr).value;
      highlightedCode.value = result;
      return result;
    } catch (fallbackError) {
      console.error('Error during code highlighting:', fallbackError);
      // If all highlighting fails, just escape HTML and return the original code
      const escapedCode = codeStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      highlightedCode.value = escapedCode;
      return escapedCode;
    }
  }
};

// Sync scroll between editor and preview
const syncScroll = () => {
  const editor = document.querySelector('.code-editor');
  const preview = document.querySelector('.code-preview');
  const lineNumbers = document.querySelector('.line-numbers');

  if (editor && preview) {
    editor.addEventListener('scroll', () => {
      if (preview) {
        preview.scrollTop = editor.scrollTop;
        preview.scrollLeft = editor.scrollLeft;
      }
      if (lineNumbers) {
        lineNumbers.scrollTop = editor.scrollTop;
      }
    });

    // Make sure initial positions are synced
    if (preview) {
      preview.scrollTop = editor.scrollTop;
      preview.scrollLeft = editor.scrollLeft;
    }
    if (lineNumbers) {
      lineNumbers.scrollTop = editor.scrollTop;
    }

    // Prevent duplicate scrollbars and events on preview
    if (preview) {
      preview.style.pointerEvents = 'none';
    }
  }
};

// Watch for code changes to update line numbers
watch(lineCount, () => {
  // Force a small delay to ensure DOM is updated
  setTimeout(() => {
    const lineNumbers = document.querySelector('.line-numbers');
    const editor = document.querySelector('.code-editor');
    if (lineNumbers && editor) {
      lineNumbers.style.height = `${editor.scrollHeight}px`;
    }
  }, 10);
});

// Function to apply the suggestion
const applySuggestion = index => {
  const suggestion = suggestions.value[index];

  // Get the lines of code
  const lines = codeContent.value.split('\n');
  let codeWithoutFunc, improvedCode;

  // Apply different fixes based on suggestion type
  if (suggestion.originalSnippet && suggestion.category) {
    switch (suggestion.category) {
      case 'Complexity':
        // For function complexity, we need to replace the entire function
        codeWithoutFunc = codeContent.value;
        if (suggestion.originalSnippet) {
          codeWithoutFunc = codeContent.value.replace(suggestion.originalSnippet, '');
        }

        // Extract the improved functions from the fixedCode
        improvedCode = suggestion.improvedSnippet
          .replace(/\/\/ .*/g, '')
          .replace(/\/\*.*\*\//g, '')
          .trim();

        codeContent.value = codeWithoutFunc + '\n\n' + improvedCode;
        break;

      case 'Production Code':
        // Replace console.log statements
        if (suggestion.originalSnippet && suggestion.originalSnippet.includes('console.log')) {
          codeContent.value = codeContent.value.replace(/console\.log\(/g, 'logger.debug(');

          // Add the import if not already present
          if (!codeContent.value.includes("import logger from './utils/logger'")) {
            const importLines = codeContent.value.split('\n');
            // Find the right place to add the import
            let importIndex = 0;
            for (let i = 0; i < importLines.length; i++) {
              if (importLines[i].trim().startsWith('import ')) {
                importIndex = i + 1;
              }
            }

            // Add the import
            importLines.splice(importIndex, 0, "import logger from './utils/logger';");
            codeContent.value = importLines.join('\n');
          }
        }
        break;

      case 'Style':
        // For missing documentation
        if (suggestion.lineNumber && suggestion.originalSnippet && suggestion.lineNumber <= lines.length) {
          const lineIndex = suggestion.lineNumber - 1;

          // Extract the documentation comment from the suggestion
          const docMatch = suggestion.improvedSnippet.match(/(\/\*\*[\s\S]*?\*\/)\n/);
          if (docMatch && docMatch[1]) {
            const docComment = docMatch[1];

            // Insert documentation before the function
            lines.splice(lineIndex, 0, docComment);
            codeContent.value = lines.join('\n');
          }
        }
        break;

      case 'Unused Code':
        // Remove unused variables
        if (suggestion.originalSnippet) {
          codeContent.value = codeContent.value.replace(
            suggestion.originalSnippet,
            '// ' + suggestion.originalSnippet.trim() + ' (removed)'
          );
        }
        break;

      case 'Accessibility':
        // Add alt attributes to images
        if (suggestion.originalSnippet && suggestion.originalSnippet.includes('<img')) {
          codeContent.value = codeContent.value.replace(/<img([^>]*)>/g, (match, attributes) => {
            if (!attributes.includes('alt=')) {
              return `<img${attributes} alt="Description">`;
            }
            return match;
          });
        }
        break;

      case 'CSS Best Practices':
        // Remove !important
        if (suggestion.originalSnippet && suggestion.originalSnippet.includes('!important')) {
          codeContent.value = codeContent.value.replace(/\s*!important/g, '');
        }
        break;

      case 'Vue Best Practices':
        // Add keys to v-for
        if (suggestion.originalSnippet && suggestion.originalSnippet.includes('v-for=')) {
          codeContent.value = codeContent.value.replace(
            /v-for="(\w+)(\s+in\s+\w+)"/g,
            'v-for="$1$2" :key="$1.id"'
          );
        }
        break;

      default:
        // For other types, just show a notification
        console.log(`Applied suggestion of type: ${suggestion.category}`);
        break;
    }
  } else {
    // Fallback to original behavior for legacy suggestions
    if (suggestion.category === 'Production Code' && suggestion.description.includes('console.log')) {
      codeContent.value = codeContent.value.replace(/console\.log\(/g, 'logger.debug(');
    } else if (suggestion.category === 'Style') {
      // Add documentation comment to the beginning of the code
      const docComment =
        '/**\n * This function does something important\n * @param {string} input - The input parameter\n * @returns {boolean} - Returns true on success\n */\n';
      codeContent.value = docComment + codeContent.value;
    }
  }

  // After applying the suggestion, show it temporarily
  if (suggestion.improvedSnippet) {
    // Show a temporary message that change was applied
    const tempElement = document.createElement('div');
    tempElement.className = 'temp-applied-message';
    tempElement.innerHTML = `<div class="temp-header">${t(
      'widgets.types.codeViewer.tempAppliedMessage'
    )}</div>`;
    document.body.appendChild(tempElement);

    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(tempElement);
    }, 2000);
  }

  // Remove the applied suggestion
  suggestions.value.splice(index, 1);

  // Re-highlight code
  highlightCode();
};

// Initialize with sample code
const initSampleCode = () => {
  if (codeContent.value === '') {
    if (selectedLanguage.value === 'vue') {
      // For Vue, use HTML as fallback
      codeContent.value = sampleCode.html;
    } else if (selectedLanguage.value in sampleCode) {
      codeContent.value = sampleCode[selectedLanguage.value];
    } else {
      codeContent.value = sampleCode.javascript;
    }
    highlightCode();
  }
};

// Watch for language changes to update highlighting and sample code
watch(selectedLanguage, newLang => {
  if (codeContent.value === '' || Object.values(sampleCode).includes(codeContent.value)) {
    // If empty or using a sample, replace with new sample
    if (newLang === 'vue') {
      // For Vue, use HTML as fallback
      codeContent.value = sampleCode.html;
    } else if (newLang in sampleCode) {
      codeContent.value = sampleCode[newLang];
    } else {
      codeContent.value = sampleCode.javascript;
    }
  }
  highlightCode();
});

// For demo only - preload with sample code if empty
watch(
  codeContent,
  newVal => {
    if (newVal === '' && !highlightedCode.value) {
      initSampleCode();
    } else {
      highlightCode(newVal);
    }
  },
  { immediate: true }
);

// Initialize with sample code on component mount
initSampleCode();

// Call syncScroll after component is mounted
onMounted(() => {
  initSampleCode();

  // Use a slightly longer delay for DOM to be fully ready
  setTimeout(() => {
    syncScroll();

    // Adjust line numbers after render
    const lineNumbers = document.querySelector('.line-numbers');
    const editor = document.querySelector('.code-editor');
    if (lineNumbers && editor) {
      lineNumbers.style.height = `${editor.scrollHeight}px`;
    }
  }, 100);
});
</script>

<style scoped>
.code-viewer-widget {
  padding: 20px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header {
  margin-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.header-subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 4px;
}

.code-panel {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid #edf2f7;
  transition: box-shadow 0.3s ease;
}

.code-panel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.code-controls {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  align-items: center;
}

.file-name-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #4a5568;
}

.file-name-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  outline: none;
}

.language-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  min-width: 140px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a5568'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 35px;
}

.language-select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  outline: none;
}

.code-editor-container {
  position: relative;
  height: 350px;
  transition: height 0.3s ease;
  overflow: hidden;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf2f7;
  isolation: isolate; /* Tạo một stacking context riêng */
}

.code-editor,
.code-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 18px;
  padding-left: 48px;
  margin: 0;
  border: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  box-sizing: border-box;
}

.code-editor {
  z-index: 2;
  color: #4a5568;
  background-color: transparent;
  caret-color: #4a5568;
  resize: none;
  white-space: pre;
  position: relative;
  opacity: 1 !important; /* Đảm bảo luôn hiển thị */
}

.code-preview {
  z-index: 1;
  pointer-events: none;
  background-color: #fafafa;
  white-space: pre;
  position: relative;
}

.refactor-suggestions {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  transition: box-shadow 0.3s ease;
  clear: both;
  margin-top: 20px;
}

.refactor-suggestions:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.analyze-btn {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analyze-btn:hover {
  background-color: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.analyze-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.analyzing {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  justify-content: center;
  color: #4a5568;
  background-color: #f8fafc;
  border-radius: 8px;
  margin: 10px 0;
}

.spinner {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3182ce;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-suggestions {
  padding: 24px;
  text-align: center;
  color: #718096;
  font-style: italic;
  background-color: #f8fafc;
  border-radius: 8px;
  margin: 10px 0;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 4px;
}

.suggestions-list::-webkit-scrollbar {
  width: 8px;
}

.suggestions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.suggestions-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.suggestions-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.suggestion-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8fafc;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.suggestion-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.suggestion-type {
  font-weight: 600;
  color: #3182ce;
  display: inline-block;
  padding: 4px 10px;
  background-color: rgba(49, 130, 206, 0.1);
  border-radius: 4px;
  font-size: 13px;
}

.suggestion-line {
  color: #718096;
  font-size: 13px;
  background-color: #edf2f7;
  padding: 2px 8px;
  border-radius: 4px;
}

.suggestion-content {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #4a5568;
}

.suggestion-original-code {
  margin-bottom: 12px;
  background-color: #f7fafc;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #718096;
  overflow: auto;
  position: relative;
}

.suggestion-original-code::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.03) 10px,
    rgba(0, 0, 0, 0.03) 20px
  );
  pointer-events: none;
}

.suggestion-original-code pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #4a5568;
  position: relative;
  z-index: 1;
}

.suggestion-fixed-code {
  margin-bottom: 12px;
  background-color: #f0fff4;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #38a169;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.suggestion-fixed-code pre,
.suggestion-fixed-code div {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-label {
  font-weight: 600;
  margin-bottom: 4px;
}

.apply-btn {
  background-color: #38a169;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin-left: auto;
}

.apply-btn:hover {
  background-color: #2f855a;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.apply-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.temp-applied-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #48bb78;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

.temp-header {
  font-weight: 600;
  display: flex;
  align-items: center;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .code-viewer-widget {
    padding: 16px;
    border-radius: 8px;
  }

  .code-controls {
    flex-direction: column;
    padding: 10px;
  }

  .code-editor-container {
    height: 250px;
  }

  .language-select {
    width: 100%;
    min-width: unset;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .section-header h3 {
    margin-bottom: 8px;
  }

  .analyze-btn {
    width: 100%;
    justify-content: center;
  }

  .suggestion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .code-viewer-widget {
    padding: 16px;
  }

  .code-editor-container {
    height: 300px;
  }
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  vertical-align: middle;
}

.icon-sm {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.icon-xs {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 4px;
}

.action-button {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background-color: #f8fafc;
  color: #3182ce;
  border-color: #3182ce;
}

.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: #fff;
}

.line-numbers {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 100%;
  padding: 18px 0;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  text-align: right;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
  z-index: 2;
}

.line-number {
  padding: 0 8px;
  color: #6b7280;
  min-height: 1.6em;
}

.code-editor::-webkit-scrollbar,
.code-preview::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-editor::-webkit-scrollbar-track,
.code-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.code-editor::-webkit-scrollbar-thumb,
.code-preview::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.code-editor::-webkit-scrollbar-thumb:hover,
.code-preview::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.not-applied-note {
  color: #e53e3e;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(229, 62, 62, 0.1);
  margin-left: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(56, 161, 105, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
  }
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}
</style> 