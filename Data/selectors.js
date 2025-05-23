const selectors = {
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

module.exports = { selectors };
