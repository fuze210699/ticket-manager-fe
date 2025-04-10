import { ref } from 'vue';

class YouTubeService {
  constructor() {
    this.isAuthenticated = ref(false);
    this.currentTrack = ref(null);
    this.isPlaying = ref(false);
    this.volume = ref(50);
    this.player = null;
    this.isReady = ref(false);
    this.initializationPromise = null;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise((resolve) => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        console.log('YouTube API already loaded');
        this.createPlayer(resolve);
        return;
      }

      // Load YouTube IFrame API
      console.log('Loading YouTube IFrame API...');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube IFrame API loaded');
        this.createPlayer(resolve);
      };
    });

    return this.initializationPromise;
  }

  createPlayer(resolve) {
    console.log('Creating YouTube player...');
    try {
      this.player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'disablekb': 0,
          'enablejsapi': 1,
          'origin': window.location.origin,
          'autoplay': 1,
          'mute': 0,
          'rel': 0
        },
        events: {
          'onReady': () => {
            console.log('YouTube player is ready');
            this.isReady.value = true;
            this.isAuthenticated.value = true;
            this.setVolume(this.volume.value);
            resolve();
          },
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': (event) => {
            console.error('YouTube player error:', event.data);
            this.isReady.value = false;
            this.isPlaying.value = false;
          }
        }
      });
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      this.isReady.value = false;
      resolve();
    }
  }

  onPlayerStateChange(event) {
    // Update playing state
    this.isPlaying.value = event.data === YT.PlayerState.PLAYING;
    
    // Update current track info when video starts
    if (event.data === YT.PlayerState.PLAYING) {
      this.updateCurrentTrack();
    }
  }

  async searchTracks(query) {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=10&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`);
      const data = await response.json();
      
      return data.items.map(item => ({
        id: item.id.videoId,
        name: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw new Error('Không thể tìm kiếm bài hát. Vui lòng thử lại.');
    }
  }

  async play(trackId) {
    try {
      if (!this.isReady.value) {
        console.log('Player not ready, initializing...');
        await this.initialize();
      }
      if (!this.player) {
        throw new Error('Player not initialized');
      }
      console.log('Playing track:', trackId);
      this.player.loadVideoById({
        videoId: trackId,
        suggestedQuality: 'default'
      });
      
      // Wait for video to be loaded before playing
      return new Promise((resolve, reject) => {
        const checkReady = setInterval(() => {
          if (this.player.getPlayerState() === YT.PlayerState.UNSTARTED) {
            clearInterval(checkReady);
            this.player.playVideo();
            this.isPlaying.value = true;
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkReady);
          reject(new Error('Video load timeout'));
        }, 10000);
      });
    } catch (error) {
      console.error('Error playing track:', error);
      this.isReady.value = false;
      throw new Error('Không thể phát bài hát. Vui lòng thử lại.');
    }
  }

  // Add new methods for player state
  getCurrentTime() {
    try {
      if (!this.player || !this.isReady.value) return 0;
      return this.player.getCurrentTime();
    } catch (error) {
      console.error('Error getting current time:', error);
      return 0;
    }
  }

  getDuration() {
    try {
      if (!this.player || !this.isReady.value) return 0;
      return this.player.getDuration();
    } catch (error) {
      console.error('Error getting duration:', error);
      return 0;
    }
  }

  getCurrentTrack() {
    try {
      if (!this.player || !this.isReady.value) return null;
      const videoId = this.player.getVideoData().video_id;
      return {
        id: videoId,
        name: this.player.getVideoData().title,
        artist: this.player.getVideoData().author,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: this.player.getDuration()
      };
    } catch (error) {
      console.error('Error getting current track:', error);
      return null;
    }
  }

  isTrackPlaying() {
    try {
      if (!this.player || !this.isReady.value) return false;
      return this.player.getPlayerState() === YT.PlayerState.PLAYING;
    } catch (error) {
      console.error('Error checking player state:', error);
      return false;
    }
  }

  getVolume() {
    try {
      if (!this.player || !this.isReady.value) return 50;
      return this.player.getVolume();
    } catch (error) {
      console.error('Error getting volume:', error);
      return 50;
    }
  }

  setVolume(volume) {
    try {
      if (!this.player || !this.isReady.value) return;
      this.player.setVolume(volume);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  pause() {
    try {
      if (!this.player || !this.isReady.value) return;
      this.player.pauseVideo();
      this.isPlaying.value = false;
    } catch (error) {
      console.error('Error pausing video:', error);
    }
  }

  resume() {
    try {
      if (!this.player || !this.isReady.value) return;
      this.player.playVideo();
      this.isPlaying.value = true;
    } catch (error) {
      console.error('Error resuming video:', error);
    }
  }

  seekTo(seconds) {
    try {
      if (!this.player || !this.isReady.value) return;
      this.player.seekTo(seconds, true);
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  }

  async updateCurrentTrack() {
    if (!this.player || !this.isReady.value) return;

    try {
      const videoData = await this.player.getVideoData();
      this.currentTrack.value = {
        name: videoData.title,
        artist: videoData.author,
        duration: videoData.duration,
        thumbnail: `https://img.youtube.com/vi/${videoData.video_id}/mqdefault.jpg`
      };
    } catch (error) {
      console.error('Error updating current track:', error);
    }
  }
}

// Create a single instance and export it
const youtubeService = new YouTubeService();
export { youtubeService }; 