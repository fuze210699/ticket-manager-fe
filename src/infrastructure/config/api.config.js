export const API_CONFIG = {
  YOUTUBE: {
    API_KEY: process.env.VITE_YOUTUBE_API_KEY || '',
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
  },
  TIKTOK: {
    API_KEY: process.env.VITE_TIKTOK_API_KEY || '',
    BASE_URL: 'https://open-api.tiktok.com/api',
    CLIENT_KEY: process.env.VITE_TIKTOK_CLIENT_KEY || '',
    CLIENT_SECRET: process.env.VITE_TIKTOK_CLIENT_SECRET || '',
  }
}

export const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed'
export const TIKTOK_EMBED_URL = 'https://www.tiktok.com/embed'
