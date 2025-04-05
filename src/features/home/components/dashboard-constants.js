import { markRaw } from 'vue';
import Calendar from '@/shared/components/widgets/Calendar.vue';
import Notes from '@/shared/components/widgets/Notes.vue';
import Weather from '@/shared/components/widgets/Weather.vue';
import Todo from '@/shared/components/widgets/Todo.vue';
import {
  Calendar as CalendarIcon,
  StickyNote,
  CloudSun,
  ListTodo,
  LayoutGrid,
  LayoutTemplate,
  LayoutList,
  AlignJustify,
  Share2,
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
    name: 'dashboard',
    icon: LayoutTemplate,
    description: 'Perfect for monitoring with one large widget and multiple smaller ones',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
    ],
  },
  {
    name: 'grid',
    icon: LayoutList,
    description: 'Equal-sized widgets in a grid pattern',
    zones: [
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' },
      { widget: null, minimized: false, size: 'col-3' },
    ],
  },
  {
    name: 'contentFocus',
    icon: AlignJustify,
    description: 'Large main content area with sidebar widgets',
    zones: [
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-8' },
      { widget: null, minimized: false, size: 'col-4' },
    ],
  },
  {
    name: 'social',
    icon: Share2,
    description: 'Optimized for social media feeds and updates',
    zones: [
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-12' },
    ],
  },
  {
    name: 'productivity',
    icon: ListTodo,
    description: 'Balanced layout for task management and productivity tools',
    zones: [
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-6' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
      { widget: null, minimized: false, size: 'col-4' },
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
    buttonHover: 'hover:bg-white hover:bg-opacity-25',
    iconColor: 'text-white',
    description: 'text-white text-opacity-80',
  },
};

export const SIZES = ['col-12', 'col-6', 'col-4', 'col-3'];
