<template>
  <div class="youtube-player">
    <!-- Hidden YouTube player -->
    <div id="youtube-player"></div>

    <!-- Player UI -->
    <div class="player-container">
      <!-- Search Column -->
      <div class="search-column" :class="{ collapsed: isSearchCollapsed }">
        <div class="search-content">
          <div class="search-header">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm bài hát..."
              @keyup.enter="searchTracks"
            />
            <button @click="searchTracks">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div v-if="!isSearchCollapsed" class="search-history">
            <div class="history-header">
              <h3>Lịch sử tìm kiếm</h3>
              <button class="clear-history" @click="clearHistory">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="history-list">
              <div
                v-for="(query, index) in searchHistory"
                :key="index"
                class="history-item"
                @click="useHistoryQuery(query)"
              >
                <i class="fas fa-history"></i>
                <span>{{ query }}</span>
              </div>
            </div>
          </div>
          <div v-if="!isSearchCollapsed && searchResults.length > 0" class="search-results">
            <div
              v-for="track in searchResults"
              :key="track.id"
              class="track-item"
              @click="playTrack(track)"
            >
              <img :src="track.thumbnail" :alt="track.name" />
              <div class="track-info">
                <div class="track-name">{{ track.name }}</div>
                <div class="track-artist">{{ track.artist }}</div>
              </div>
              <div v-if="currentTrack && currentTrack.id === track.id" class="track-duration">{{ formatTime(duration) }}</div>
            </div>
          </div>
        </div>
        <button class="collapse-btn" @click="toggleSearchCollapse">
          <i :class="isSearchCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-up'"></i>
        </button>
      </div>

      <!-- Player Column -->
      <div class="player-column">
        <!-- Current Track -->
        <div v-if="currentTrack" class="current-track">
          <div class="vinyl-disc" :class="{ 'is-playing': isPlaying }">
            <img :src="currentTrack.thumbnail" :alt="currentTrack.name" />
          </div>
          <div class="track-info">
            <div class="track-name">{{ currentTrack.name }}</div>
            <div class="track-artist">{{ currentTrack.artist }}</div>
            <div class="track-progress">
              <div class="progress-bar" @click="seekTo">
                <div class="progress" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="time-info">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <div class="control-buttons">
            <button class="control-btn" :class="{ active: isShuffled }" @click="shuffle">
              <i class="fas fa-random"></i>
            </button>
            <button class="control-btn" @click="previousTrack">
              <i class="fas fa-step-backward"></i>
            </button>
            <button class="main-control" :disabled="!currentTrack" @click="togglePlay">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
            <button class="control-btn" @click="nextTrack">
              <i class="fas fa-step-forward"></i>
            </button>
            <button
              class="control-btn"
              :class="{ active: repeatMode !== 'none' }"
              @click="toggleRepeat"
            >
              <i
                :class="[
                  'fas',
                  repeatMode === 'none'
                    ? 'fa-redo'
                    : repeatMode === 'all'
                    ? 'fa-redo-alt'
                    : 'fa-redo-alt',
                ]"
              ></i>
            </button>
          </div>

          <div class="volume-control">
            <i class="fas fa-volume-up"></i>
            <input v-model="volume" type="range" min="0" max="100" @input="updateVolume" />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { youtubeService } from './youtubeService';

const searchQuery = ref('');
const searchResults = ref([]);
const currentTrack = ref(null);
const isPlaying = ref(false);
const volume = ref(50);
const error = ref('');
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const repeatMode = ref('none');
const searchHistory = ref([]);
const isShuffled = ref(false);
const playlist = ref([]);
const isSearchCollapsed = ref(false);

// Load search history from localStorage
onMounted(() => {
  const savedHistory = localStorage.getItem('youtubeSearchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }
});

// Save search history to localStorage
const saveHistory = () => {
  localStorage.setItem('youtubeSearchHistory', JSON.stringify(searchHistory.value));
};

// Add query to history
const addToHistory = query => {
  if (!query.trim()) return;

  // Remove if already exists
  const index = searchHistory.value.indexOf(query);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
  }

  // Add to beginning
  searchHistory.value.unshift(query);

  // Keep only last 20 items
  if (searchHistory.value.length > 20) {
    searchHistory.value = searchHistory.value.slice(0, 20);
  }

  saveHistory();
};

// Clear search history
const clearHistory = () => {
  searchHistory.value = [];
  saveHistory();
};

// Use history query
const useHistoryQuery = query => {
  searchQuery.value = query;
  searchTracks();
};

// Search tracks
const searchTracks = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    error.value = '';
    searchResults.value = await youtubeService.searchTracks(searchQuery.value);
    addToHistory(searchQuery.value);
  } catch (err) {
    console.error('Error searching tracks:', err);
    error.value = err.message;
  }
};

// Play track
const playTrack = async track => {
  try {
    error.value = '';
    await youtubeService.play(track.id);
    currentTrack.value = track;
    isPlaying.value = true;
    searchResults.value = [];
  } catch (err) {
    console.error('Error playing track:', err);
    error.value = err.message;
    isPlaying.value = false;
  }
};

// Toggle play/pause
const togglePlay = () => {
  if (isPlaying.value) {
    youtubeService.pause();
  } else {
    youtubeService.resume();
  }
};

// Update volume
const updateVolume = () => {
  youtubeService.setVolume(volume.value);
};

// Format time
const formatTime = time => {
  if (!time || isNaN(time) || time < 0) {
    return '0:00';
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Control functions
const shuffle = async () => {
  try {
    isShuffled.value = !isShuffled.value;
    if (isShuffled.value) {
      playlist.value = [...searchResults.value];
      for (let i = playlist.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist.value[i], playlist.value[j]] = [playlist.value[j], playlist.value[i]];
      }
    }
  } catch (err) {
    console.error('Error shuffling:', err);
    error.value = 'Không thể xáo trộn danh sách phát';
  }
};

const previousTrack = async () => {
  try {
    if (!currentTrack.value || !searchResults.value.length) return;
    const currentIndex = searchResults.value.findIndex(track => track.id === currentTrack.value.id);
    if (currentIndex > 0) {
      const prevTrack = searchResults.value[currentIndex - 1];
      await playTrack(prevTrack);
    }
  } catch (err) {
    console.error('Error playing previous track:', err);
    error.value = 'Không thể phát bài trước';
  }
};

const nextTrack = async () => {
  try {
    if (!currentTrack.value || !searchResults.value.length) return;
    const currentIndex = searchResults.value.findIndex(track => track.id === currentTrack.value.id);
    if (currentIndex < searchResults.value.length - 1) {
      const nextTrack = searchResults.value[currentIndex + 1];
      await playTrack(nextTrack);
    }
  } catch (err) {
    console.error('Error playing next track:', err);
    error.value = 'Không thể phát bài tiếp theo';
  }
};

const toggleRepeat = () => {
  const modes = ['none', 'all', 'one'];
  const currentIndex = modes.indexOf(repeatMode.value);
  repeatMode.value = modes[(currentIndex + 1) % modes.length];

  if (repeatMode.value === 'one') {
    youtubeService.setLoop(true);
  } else if (repeatMode.value === 'all') {
    youtubeService.setLoop(true);
    youtubeService.setShuffle(false);
  } else {
    youtubeService.setLoop(false);
  }
};

// Watch for player state changes
const checkPlayerState = setInterval(() => {
  try {
    const newPlayingState = youtubeService.isTrackPlaying();
    if (newPlayingState !== isPlaying.value) {
      isPlaying.value = newPlayingState;
    }

    const newTrack = youtubeService.getCurrentTrack();
    if (newTrack && (!currentTrack.value || currentTrack.value.id !== newTrack.id)) {
      currentTrack.value = newTrack;
    }

    const newVolume = youtubeService.getVolume();
    if (newVolume !== volume.value) {
      volume.value = newVolume;
    }

    // Update progress
    const currentTimeValue = youtubeService.getCurrentTime();
    const durationValue = youtubeService.getDuration();
    if (currentTimeValue && durationValue) {
      progress.value = (currentTimeValue / durationValue) * 100;
      currentTime.value = currentTimeValue;
      duration.value = durationValue;
    }
  } catch (err) {
    console.error('Error checking player state:', err);
  }
}, 1000);

onUnmounted(() => {
  clearInterval(checkPlayerState);
});

const toggleSearchCollapse = () => {
  isSearchCollapsed.value = !isSearchCollapsed.value;
};
</script>

<style scoped>
.youtube-player {
  width: 100%;
  min-width: 320px;
  padding: clamp(16px, 5%, 32px);
  background: linear-gradient(145deg, #121212, #282828);
  border-radius: clamp(16px, 3%, 24px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  container-type: inline-size;
  container-name: player;
}

.youtube-player::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1db954, #1ed760);
  opacity: 0.8;
}

#youtube-player {
  display: none;
}

.player-container {
  position: relative;
  z-index: 1;
  display: flex;
  gap: clamp(16px, 3%, 32px);
  height: 100%;
  min-width: 450px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.search-column {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 450px;
  flex: 0 0 450px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: clamp(12px, 2%, 16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: clamp(16px, 3%, 24px);
  transform-origin: top;
  max-height: 1000px;
}

.search-column.collapsed {
  padding-bottom: clamp(16px, 3%, 24px);
  max-height: 120px;
}

.search-content {
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transform-origin: top;
}

.search-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-column.collapsed .search-header {
  margin-bottom: 0;
}

.search-history,
.search-results {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
}

.search-column.collapsed .search-history,
.search-column.collapsed .search-results {
  opacity: 0;
  transform: translateY(-100%);
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.search-header input {
  flex: 1;
  padding: clamp(12px, 1.5%, 16px) clamp(16px, 2.5%, 24px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  font-size: clamp(14px, 1.5%, 16px);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  backdrop-filter: blur(5px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-header input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.search-header input:focus {
  outline: none;
  border-color: #1db954;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.2);
  transform: translateY(-1px);
}

.search-header button {
  padding: 14px 28px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.2);
  min-width: 100px;
}

.search-header button:hover {
  transform: translateY(-2px) scale(1.02);
  background: #1ed760;
  box-shadow: 0 6px 20px rgba(29, 185, 84, 0.3);
}

.search-header button:active {
  transform: translateY(0) scale(0.98);
}

.search-history {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.clear-history {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-history:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #1db954;
}

.history-item i {
  font-size: 14px;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 24px;
  padding-right: 8px;
  scroll-behavior: smooth;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #1db954;
  border-radius: 3px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.track-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #1db954;
  opacity: 0;
  transition: all 0.3s ease;
}

.track-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.track-item:hover::before {
  opacity: 1;
}

.track-item img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.track-item:hover img {
  transform: scale(1.05);
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-weight: 600;
  margin-bottom: 6px;
  color: #ffffff;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.track-artist {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.track-item:hover .track-name {
  color: #1db954;
}

.current-track {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2.5%, 32px);
  padding: clamp(16px, 3%, 32px);
  background: linear-gradient(145deg, #282828, #404040);
  border-radius: clamp(12px, 2%, 16px);
  margin-bottom: clamp(16px, 3%, 24px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 320px;
  width: 100%;
}

.current-track::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(29, 185, 84, 0.1), transparent);
  opacity: 0;
  transition: all 0.3s ease;
}

.current-track:hover::before {
  opacity: 1;
}

.current-track img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.current-track:hover img {
  transform: scale(1.05);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 3%, 32px);
  padding: clamp(16px, 3%, 32px);
  background: rgba(255, 255, 255, 0.05);
  border-radius: clamp(12px, 2%, 16px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  flex-wrap: wrap;
  min-width: 320px;
  width: 100%;
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  color: #1db954;
  transform: scale(1.1);
}

.main-control {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1db954;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.2);
}

.main-control:hover {
  transform: scale(1.1);
  background: #1ed760;
  box-shadow: 0 6px 20px rgba(29, 185, 84, 0.3);
}

.main-control:active {
  transform: scale(0.95);
}

.main-control:disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  box-shadow: none;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.volume-control i {
  color: #1db954;
  font-size: 20px;
  transition: all 0.3s ease;
}

.volume-control:hover i {
  transform: scale(1.1);
}

.volume-control input[type='range'] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  transition: all 0.3s ease;
}

.volume-control input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #1db954;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.2);
}

.volume-control input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.error-message {
  margin-top: 16px;
  padding: 16px 20px;
  background: rgba(198, 40, 40, 0.1);
  color: #ff6b6b;
  border-radius: 12px;
  font-size: 14px;
  animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(198, 40, 40, 0.2);
  backdrop-filter: blur(5px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.vinyl-disc {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #000;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.vinyl-disc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 50%;
}

.vinyl-disc img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.vinyl-disc.is-playing {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.track-progress {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #1db954;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.time-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.track-duration {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 16px;
}

.collapse-btn {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(29, 185, 84, 0.1);
  color: #1db954;
  border: 2px solid rgba(29, 185, 84, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
  z-index: 10;
}

.collapse-btn:hover {
  transform: translateX(-50%) scale(1.1);
  background: rgba(29, 185, 84, 0.15);
  border-color: rgba(29, 185, 84, 0.3);
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.1);
}

.collapse-btn:active {
  transform: translateX(-50%) scale(0.95);
}

.collapse-btn i {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.search-column.collapsed .collapse-btn i {
  transform: rotate(180deg);
}

/* Container Queries */
@container player (max-width: 400px) {
  .player-container {
    flex-direction: column;
    min-width: 100%;
  }

  .search-column {
    min-width: 100%;
    flex: 1 1 100%;
    position: relative;
    max-width: 100%;
  }

  .search-content {
    width: 100%;
  }

  .collapse-btn {
    bottom: -16px;
  }

  .player-column {
    min-width: 100%;
  }
}

@container player (min-width: 401px) and (max-width: 600px) {
  .player-container {
    flex-direction: column;
    min-width: 450px;
  }

  .search-column {
    min-width: 100%;
    flex: 1 1 100%;
    position: relative;
    max-width: 100%;
  }

  .search-content {
    width: 100%;
  }

  .collapse-btn {
    bottom: -16px;
  }

  .player-column {
    min-width: 100%;
    flex: 2 2 100%;
  }
}

@container player (min-width: 601px) and (max-width: 800px) {
  .player-container {
    gap: 20px;
    min-width: 450px;
  }

  .search-column {
    min-width: 450px;
    flex: 1 1 450px;
  }

  .collapse-btn {
    bottom: -20px;
  }

  .player-column {
    min-width: 450px;
    flex: 2 2 450px;
  }
}

@container player (min-width: 801px) {
  .player-container {
    gap: 32px;
    min-width: 450px;
  }

  .search-column {
    min-width: 450px;
    flex: 0 0 450px;
  }

  .collapse-btn {
    bottom: -20px;
  }

  .player-column {
    min-width: 450px;
    flex: 2 2 450px;
  }
}

/* Add horizontal scroll for small containers */
@container player (max-width: 400px) {
  .youtube-player {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .player-column {
    min-width: 100% !important;
  }
}

@container player (max-width: 600px) {
  .youtube-player {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .player-column {
    width: 100%;
  }

  .player-container {
    max-width: 100%;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .youtube-player {
    background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
  }

  .current-track {
    background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .youtube-player {
    border: 2px solid CanvasText;
  }

  .search-header input,
  .controls button,
  .volume-control input[type='range'] {
    border: 2px solid CanvasText;
  }
}

.player-column {
  flex: 2;
  min-width: 450px;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3%, 24px);
}

.control-btn.active {
  color: #1db954;
  background: rgba(29, 185, 84, 0.1);
  border: 1px solid rgba(29, 185, 84, 0.2);
}
</style>
