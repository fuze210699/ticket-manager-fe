<template>
  <EditModeWidget v-if="isEditMode" :icon="CloudSun" @remove="$emit('remove')" />
  <div v-else class="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800">
    <div class="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ $t('widgets.types.weather.title') }}</h3>
        <div class="flex items-center gap-2">
          <button class="text-gray-500 hover:text-gray-700" @click="toggleSettings">
            <Settings class="w-5 h-5" />
          </button>
          <button class="text-gray-500 hover:text-gray-700" @click="toggleMinimize">
            <ChevronUp class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="!isMinimized" class="flex-1 flex flex-col">
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="error" class="flex-1 flex items-center justify-center text-red-500">
          <p>{{ error }}</p>
        </div>
        <div v-else class="flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-lg font-medium">{{ currentWeather.location }}</h4>
              <p class="text-sm text-gray-500">{{ formatDate(currentWeather.date) }}</p>
            </div>
            <button class="text-gray-500 hover:text-gray-700" @click="refreshWeather">
              <RotateCcw class="w-5 h-5" />
            </button>
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="text-4xl font-bold">{{ currentWeather.temperature }}°{{ unit }}</div>
              <div>
                <p class="text-lg font-medium">{{ currentWeather.condition }}</p>
                <p class="text-sm text-gray-500">
                  Feels like {{ currentWeather.feelsLike }}°{{ unit }}
                </p>
              </div>
            </div>
            <div class="text-6xl">
              <component :is="getWeatherIcon(currentWeather.icon)"></component>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('common.humidity') }}</p>
              <p class="text-lg font-medium">{{ currentWeather.humidity }}%</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('common.wind') }}</p>
              <p class="text-lg font-medium">{{ currentWeather.windSpeed }} {{ windUnit }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('common.precipitation') }}</p>
              <p class="text-lg font-medium">{{ currentWeather.precipitation }}%</p>
            </div>
          </div>

          <div class="flex-1 overflow-x-auto">
            <div class="flex gap-4">
              <div
                v-for="forecast in hourlyForecast"
                :key="forecast.time"
                class="flex flex-col items-center p-3 rounded-lg"
                :class="{ 'bg-blue-50': isCurrentHour(forecast.time) }"
              >
                <p class="text-sm font-medium">{{ formatTime(forecast.time) }}</p>
                <div class="text-2xl my-2">
                  <component :is="getWeatherIcon(forecast.icon)"></component>
                </div>
                <p class="text-lg font-medium">{{ forecast.temperature }}°{{ unit }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h5 class="text-sm font-medium mb-2">{{ $t('common.dailyForecast') }}</h5>
            <div class="space-y-2">
              <div
                v-for="day in dailyForecast"
                :key="day.date"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center gap-4">
                  <p class="w-24 text-sm font-medium">{{ formatDay(day.date) }}</p>
                  <div class="text-xl">
                    <component :is="getWeatherIcon(day.icon)"></component>
                  </div>
                  <p class="text-sm">{{ day.condition }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <p class="text-sm">{{ day.precipitation }}%</p>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ day.maxTemp }}°{{ unit }}</span>
                    <span class="text-sm text-gray-500">{{ day.minTemp }}°{{ unit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showSettings"
        class="absolute top-0 left-0 right-0 bottom-0 bg-white p-4 rounded-lg shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ $t('dashboard.widgets.settings') }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="toggleSettings">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              $t('common.location')
            }}</label>
            <input
              v-model="location"
              type="text"
              class="w-full rounded-md border border-gray-300 px-3 py-2"
              @keydown.enter="updateLocation"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              $t('common.unit')
            }}</label>
            <select v-model="unit" class="w-full rounded-md border border-gray-300 px-3 py-2">
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              $t('common.theme')
            }}</label>
            <select v-model="theme" class="w-full rounded-md border border-gray-300 px-3 py-2">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              $t('common.updateInterval')
            }}</label>
            <select
              v-model="updateInterval"
              class="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  CloudSun,
  Settings,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  ChevronUp,
  X,
  RotateCcw,
} from 'lucide-vue-next';
import EditModeWidget from './EditModeWidget.vue';

defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['move-up', 'move-down', 'remove']);

const isMinimized = ref(false);
const showSettings = ref(false);
const loading = ref(false);
const error = ref(null);
const location = ref('Hanoi, VN');
const unit = ref('C');
const theme = ref('light');
const updateInterval = ref('30');

const currentWeather = ref({
  location: 'Hanoi, VN',
  date: new Date(),
  temperature: 25,
  feelsLike: 27,
  condition: 'Partly Cloudy',
  icon: 'partly-cloudy-day',
  humidity: 65,
  windSpeed: 12,
  precipitation: 20,
});

const hourlyForecast = ref([
  { time: new Date(), temperature: 25, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
  { time: new Date(Date.now() + 3600000), temperature: 24, condition: 'Cloudy', icon: 'cloudy' },
  { time: new Date(Date.now() + 7200000), temperature: 23, condition: 'Rain', icon: 'rain' },
  { time: new Date(Date.now() + 10800000), temperature: 22, condition: 'Rain', icon: 'rain' },
  { time: new Date(Date.now() + 14400000), temperature: 21, condition: 'Rain', icon: 'rain' },
]);

const dailyForecast = ref([
  {
    date: new Date(),
    maxTemp: 25,
    minTemp: 20,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy-day',
    precipitation: 20,
  },
  {
    date: new Date(Date.now() + 86400000),
    maxTemp: 24,
    minTemp: 19,
    condition: 'Rain',
    icon: 'rain',
    precipitation: 60,
  },
  {
    date: new Date(Date.now() + 172800000),
    maxTemp: 23,
    minTemp: 18,
    condition: 'Rain',
    icon: 'rain',
    precipitation: 80,
  },
  {
    date: new Date(Date.now() + 259200000),
    maxTemp: 24,
    minTemp: 19,
    condition: 'Cloudy',
    icon: 'cloudy',
    precipitation: 40,
  },
  {
    date: new Date(Date.now() + 345600000),
    maxTemp: 26,
    minTemp: 20,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 10,
  },
]);

const windUnit = computed(() => {
  return unit.value === 'C' ? 'km/h' : 'mph';
});

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = date => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

const formatDay = date => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
  });
};

const isCurrentHour = date => {
  const now = new Date();
  const forecastDate = new Date(date);
  return now.getHours() === forecastDate.getHours();
};

const getWeatherIcon = icon => {
  const icons = {
    sunny: Sun,
    'partly-cloudy-day': CloudSun,
    cloudy: Cloud,
    rain: CloudRain,
    snow: CloudSnow,
    thunderstorm: CloudLightning,
    fog: CloudFog,
  };
  return icons[icon] || Cloud;
};

const refreshWeather = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update weather data
    currentWeather.value.date = new Date();
  } catch (err) {
    error.value = 'Failed to fetch weather data';
  } finally {
    loading.value = false;
  }
};

const updateLocation = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update location
    currentWeather.value.location = location.value;
  } catch (err) {
    error.value = 'Failed to update location';
  } finally {
    loading.value = false;
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

onMounted(() => {
  refreshWeather();
});
</script>
