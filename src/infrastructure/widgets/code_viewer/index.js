import CodeViewerWidget from './CodeViewerWidget.vue';

export default {
  component: CodeViewerWidget,
  title: 'Code Viewer',
  icon: 'fa-solid fa-code',
  description: 'A code viewer with syntax highlighting and analysis',
  category: 'Development',
  defaultOptions: {
    language: 'javascript',
    showLineNumbers: true,
    theme: 'light'
  }
}; 