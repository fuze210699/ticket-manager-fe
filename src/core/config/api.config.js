export const API_CONFIG = {
  YOUTUBE: {
    API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
  },
  TIKTOK: {
    API_KEY: import.meta.env.VITE_TIKTOK_API_KEY || '',
    BASE_URL: 'https://open-api.tiktok.com/api',
    CLIENT_KEY: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
    CLIENT_SECRET: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '',
  },
  DEEPSEEK: {
    API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    BASE_URL: 'http://localhost:3000/api/deepseek', // URL to your proxy server
  },
};

export const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed';
export const TIKTOK_EMBED_URL = 'https://www.tiktok.com/embed';
