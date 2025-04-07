import { markRaw } from 'vue';
import Calendar from '@shared/widgets/calendar/Calendar.vue';
import Notes from '@shared/widgets/note/Notes.vue';
import Weather from '@shared/widgets/weather/Weather.vue';
import Todo from '@shared/widgets/todo/Todo.vue';
import WorkSpace from '@shared/widgets/ticket_manager/views/WorkSpace.vue';
import YouTubePlayerVue from '@shared/widgets/music/YouTubePlayer.vue';
import {
  Calendar as CalendarIcon,
  StickyNote,
  CloudSun,
  ListTodo,
  LayoutGrid,
  Ticket,
  GitCompare,
  Bug,
  Database,
  Activity,
  TestTube,
  Rocket,
  FileText,
  BarChart,
  Shield,
  MusicIcon,
} from 'lucide-vue-next';

export const AVAILABLE_WIDGETS = [
  {
    name: 'calendar',
    component: markRaw(Calendar),
    icon: CalendarIcon,
  },
  {
    name: 'notes',
    component: markRaw(Notes),
    icon: StickyNote,
  },
  {
    name: 'weather',
    component: markRaw(Weather),
    icon: CloudSun,
  },
  {
    name: 'todo',
    component: markRaw(Todo),
    icon: ListTodo,
  },
  {
    name: 'workspace',
    component: markRaw(WorkSpace),
    icon: Ticket,
  },
  {
    name: 'music',
    component: markRaw(YouTubePlayerVue),
    icon: MusicIcon,
  },
];

export const PRESET_LAYOUTS = [
  {
    name: 'default',
    icon: LayoutGrid,
    description: 'Basic layout with one main content area and two side panels',
    zones: [
      { widget: null, minimized: false, size: 'col-12' },
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-6' },
    ],
  },
  {
    name: 'codeReview',
    icon: GitCompare,
    description: 'Perfect for code review workflow with diff view and comments',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },  // Main code diff view
      { widget: null, minimized: false, size: 'col-4' },  // Comments & suggestions
      { widget: null, minimized: false, size: 'col-6' },  // File tree
      { widget: null, minimized: false, size: 'col-6' },  // Commit history
    ],
  },
  {
    name: 'debugging',
    icon: Bug,
    description: 'Debugging layout with console, network, and state inspection',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },  // Main application view
      { widget: null, minimized: false, size: 'col-4' },  // Console output
      { widget: null, minimized: false, size: 'col-6' },  // Network requests
      { widget: null, minimized: false, size: 'col-6' },  // State inspector
    ],
  },
  {
    name: 'database',
    icon: Database,
    description: 'Database management and query interface',
    zones: [
      { widget: null, minimized: false, size: 'col-4' },  // Database schema
      { widget: null, minimized: false, size: 'col-8' },  // Query editor
      { widget: null, minimized: false, size: 'col-12' }, // Results table
      { widget: null, minimized: false, size: 'col-6' },  // Query history
      { widget: null, minimized: false, size: 'col-6' },  // Query statistics
    ],
  },
  {
    name: 'monitoring',
    icon: Activity,
    description: 'System monitoring and performance metrics',
    zones: [
      { widget: null, minimized: false, size: 'col-6' },  // CPU/Memory usage
      { widget: null, minimized: false, size: 'col-6' },  // Network traffic
      { widget: null, minimized: false, size: 'col-4' },  // Error rates
      { widget: null, minimized: false, size: 'col-4' },  // Response times
      { widget: null, minimized: false, size: 'col-4' },  // Active users
    ],
  },
  {
    name: 'testing',
    icon: TestTube,
    description: 'Test execution and coverage analysis',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },  // Test results
      { widget: null, minimized: false, size: 'col-4' },  // Test coverage
      { widget: null, minimized: false, size: 'col-6' },  // Test logs
      { widget: null, minimized: false, size: 'col-6' },  // Performance metrics
    ],
  },
  {
    name: 'deployment',
    icon: Rocket,
    description: 'Deployment pipeline and release management',
    zones: [
      { widget: null, minimized: false, size: 'col-12' }, // Pipeline status
      { widget: null, minimized: false, size: 'col-6' },  // Build logs
      { widget: null, minimized: false, size: 'col-6' },  // Deployment history
      { widget: null, minimized: false, size: 'col-4' },  // Environment status
      { widget: null, minimized: false, size: 'col-4' },  // Release notes
      { widget: null, minimized: false, size: 'col-4' },  // Rollback options
    ],
  },
  {
    name: 'documentation',
    icon: FileText,
    description: 'API documentation and code reference',
    zones: [
      { widget: null, minimized: false, size: 'col-3' },  // Navigation
      { widget: null, minimized: false, size: 'col-6' },  // Content
      { widget: null, minimized: false, size: 'col-3' },  // Examples
      { widget: null, minimized: false, size: 'col-12' }, // Interactive playground
    ],
  },
  {
    name: 'analytics',
    icon: BarChart,
    description: 'User behavior and application analytics',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },  // Main chart
      { widget: null, minimized: false, size: 'col-4' },  // Key metrics
      { widget: null, minimized: false, size: 'col-6' },  // User segments
      { widget: null, minimized: false, size: 'col-6' },  // Conversion funnel
    ],
  },
  {
    name: 'security',
    icon: Shield,
    description: 'Security monitoring and audit logs',
    zones: [
      { widget: null, minimized: false, size: 'col-6' },  // Security alerts
      { widget: null, minimized: false, size: 'col-6' },  // Access logs
      { widget: null, minimized: false, size: 'col-4' },  // Vulnerability scan
      { widget: null, minimized: false, size: 'col-4' },  // Compliance status
      { widget: null, minimized: false, size: 'col-4' },  // Security score
    ],
  }
];

export const WIDGET_THEMES = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    buttonBg: 'bg-gray-50',
    buttonHover: 'hover:bg-gray-100',
    iconColor: 'text-blue-600',
    description: 'text-gray-600',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-800',
    buttonBg: 'bg-gray-800',
    buttonHover: 'hover:bg-gray-700',
    iconColor: 'text-blue-400',
    description: 'text-gray-400',
  },
  colorful: {
    bg: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    text: 'text-white',
    border: 'border-white border-opacity-20',
    hover: 'hover:opacity-90',
    buttonBg: 'bg-white/15',
    buttonHover: 'hover:bg-white hover:bg-opacity-25',
    iconColor: 'text-white',
    description: 'text-white text-opacity-80',
  },
};

export const SIZES = ['col-12', 'col-6', 'col-4', 'col-3'];
