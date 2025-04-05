<template>
  <div class="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">{{ $t('widgets.types.video.title') }}</h3>
      <div class="flex items-center gap-2">
        <button class="text-gray-500 hover:text-gray-700" @click="toggleSettings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            ></path>
          </svg>
        </button>
        <button class="text-gray-500 hover:text-gray-700" @click="toggleMinimize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="!isMinimized" class="flex-1 flex flex-col">
      <div class="flex-1 bg-black rounded-lg overflow-hidden mb-4">
        <div v-if="!currentVideo" class="h-full flex items-center justify-center text-white">
          <div class="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mx-auto mb-4"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <p>{{ $t('widgets.types.video.description') }}</p>
          </div>
        </div>
        <div v-else class="relative h-full">
          <video
            ref="videoPlayer"
            class="w-full h-full object-contain"
            :src="currentVideo.url"
            @timeupdate="updateTime"
            @loadedmetadata="updateDuration"
          ></video>
          <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-white">{{ formatTime(currentTime) }}</span>
              <div class="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white" :style="{ width: `${progress}%` }"></div>
              </div>
              <span class="text-sm text-white">{{ formatTime(duration) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button class="text-white hover:text-gray-200" @click="togglePlay">
                  <svg
                    v-if="!isPlaying"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
                <button class="text-white hover:text-gray-200" @click="toggleMute">
                  <svg
                    v-if="!isMuted"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                </button>
                <div class="flex items-center gap-2">
                  <input
                    v-model="volume"
                    type="range"
                    min="0"
                    max="100"
                    class="w-20"
                    @input="updateVolume"
                  />
                </div>
              </div>
              <button class="text-white hover:text-gray-200" @click="toggleFullscreen">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h4 class="text-lg font-medium">{{ currentVideo?.title || 'No video selected' }}</h4>
        <p class="text-sm text-gray-500">
          {{ currentVideo?.description || 'Select a video to play' }}
        </p>
      </div>
    </div>

    <div
      v-if="showSettings"
      class="absolute top-0 left-0 right-0 bottom-0 bg-white p-4 rounded-lg shadow-lg"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ $t('dashboard.widgets.settings') }}</h3>
        <button class="text-gray-500 hover:text-gray-700" @click="toggleSettings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            $t('common.settings')
          }}</label>
          <select
            v-model="selectedSource"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="vimeo">Vimeo</option>
            <option value="local">Local Files</option>
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
            $t('common.quality')
          }}</label>
          <select v-model="quality" class="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="auto">Auto</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="360p">360p</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const videoPlayer = ref(null);
const isPlaying = ref(false);
const isMinimized = ref(false);
const showSettings = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(100);
const selectedSource = ref('youtube');
const theme = ref('light');
const quality = ref('auto');

const currentVideo = ref({
  title: 'Sample Video',
  description: 'This is a sample video description',
  url: 'https://example.com/sample-video.mp4',
  thumbnail: 'https://via.placeholder.com/150',
});

const progress = computed(() => {
  return (currentTime.value / duration.value) * 100;
});

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const togglePlay = () => {
  if (videoPlayer.value) {
    if (isPlaying.value) {
      videoPlayer.value.pause();
    } else {
      videoPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const toggleMute = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted;
    isMuted.value = !isMuted.value;
  }
};

const updateVolume = () => {
  if (videoPlayer.value) {
    videoPlayer.value.volume = volume.value / 100;
  }
};

const updateTime = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
  }
};

const updateDuration = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration;
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const toggleFullscreen = () => {
  if (videoPlayer.value) {
    if (!document.fullscreenElement) {
      videoPlayer.value.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
};
</script>
