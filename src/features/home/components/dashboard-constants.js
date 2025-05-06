import { markRaw } from 'vue';
import NotesVue from '@infrastructure/widgets/note/Notes.vue';
import WorkSpaceVue from '@infrastructure/widgets/ticket_manager/views/WorkSpace.vue';
import YouTubePlayerVue from '@infrastructure/widgets/music/YouTubePlayer.vue';
import ReportGeneratorVue from '@infrastructure/widgets/report_generator/ReportGenerator.vue';
import {
  StickyNote,
  LayoutGrid,
  Ticket,
  MusicIcon,
  Gamepad2,
  FileText,
} from 'lucide-vue-next';

export const AVAILABLE_WIDGETS = [
  {
    name: 'notes',
    component: markRaw(NotesVue),
    icon: StickyNote,
  },
  {
    name: 'workspace',
    component: markRaw(WorkSpaceVue),
    icon: Ticket,
  },
  {
    name: 'music',
    component: markRaw(YouTubePlayerVue),
    icon: MusicIcon,
  },
  {
    name: 'reportGenerator',
    component: markRaw(ReportGeneratorVue),
    icon: FileText,
  },
];

export const PRESET_LAYOUTS = [
  {
    name: 'default',
    icon: LayoutGrid,
    description: 'Basic layout with one main content area and two side panels',
    zones: [
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-12' },
    ],
  },
  {
    name: 'entertainment',
    icon: Gamepad2,
    description: 'Perfect for entertainment with main content and side panel',
    zones: [
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-9' },
      { widget: null, minimized: false, size: 'col-12' },
    ],
  },
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
    buttonHover: 'hover:bg-white/25',
    iconColor: 'text-white',
    description: 'text-white text-opacity-80',
  },
};

export const SIZES = ['col-12', 'col-9', 'col-6', 'col-4', 'col-3'];
