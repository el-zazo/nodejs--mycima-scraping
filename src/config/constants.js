/**
 * Application Constants
 * Centralizes all configuration values and constants used throughout the application
 */

// Default quality settings for video downloads
const DEFAULT_QUALITIES = {
  "144p": false,
  "240p": false,
  "360p": false,
  "480p": false,
  "720p": false,
  "1080p": false,
  "1440p": false,
  "2160p": false,
  "4320p": false,
};

// CSS selectors for scraping different page types
const SELECTORS = {
  serie: {
    title: ".Title--Content--Single-begin",
    seasons: ".List--Seasons--Episodes a",
  },

  seasons: {
    title: ".Title--Content--Single-begin",
    episodes: ".Episodes--Seasons--Episodes a",
  },

  episode: {
    title: ".Title--Content--Single-begin",
    previews_episode_link: ".PrevEpisode",
    episode_buttons: ".Episodes--Seasons--Episodes a",
    downloads: ".List--Download--Wecima--Single a",
  },
};

// Regular expressions for URL validation and cleaning
const URL_PATTERNS = {
  serieUrlPattern: /^https?:\/\/wecima\.film\/series\/.+/i,
  episodeUrlPattern: /^https?:\/\/wecima\.film\/watch\/.+/i,
  mp4Extension: /.mp4.html/gi,
};

module.exports = {
  DEFAULT_QUALITIES,
  SELECTORS,
  URL_PATTERNS,
};
