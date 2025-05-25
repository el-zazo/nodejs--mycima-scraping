/**
 * MyCima Class
 * Main class for scraping MyCima website
 */

const ScraperService = require("./services/scraperService");
const { Serie, Season, Episode, Download } = require("./models");
const { SELECTORS } = require("./config/constants");
const ErrorHandler = require("./utils/errorHandler");
const Logger = require("./utils/logger");

class MyCima {
  /**
   * @param {boolean} [displayInfo=true] - Whether to display info messages
   */
  constructor(displayInfo = true) {
    this.scraperService = new ScraperService(displayInfo);
    this.logger = new Logger(displayInfo);
  }

  /**
   * Gets serie data from a URL
   *
   * @param {string} serieUrl - The serie URL
   * @returns {Promise<Object|null>} - Serie data or null if failed
   */
  async getSerie(serieUrl) {
    try {
      // Clean URL
      const cleanUrl = this.scraperService.cleanUrl(serieUrl);
      const { title, seasons } = SELECTORS.serie;

      // Select elements
      const elements = await this.scraperService.selectElements(cleanUrl, {
        title,
        seasons,
      });

      if (!elements) {
        return null;
      }

      const { $, title: serieTitle, seasons: seasonsElts } = elements;

      if (serieTitle && seasonsElts) {
        // Create seasons array
        const seasonsArray = seasonsElts
          .map((i, e) => ({
            SeasonTitle: $(e).text(),
            SeasonLink: this.scraperService.cleanUrl(e.attribs["href"]),
          }))
          .toArray();

        // Create serie object
        return {
          SerieTitle: serieTitle.length > 0 ? serieTitle.text() : "no serie title",
          SerieLink: cleanUrl,
          Seasons: seasonsArray,
        };
      }

      return null;
    } catch (error) {
      const errorObj = ErrorHandler.createError("Failed to get serie data", "getSerie", error);
      this.logger.error(errorObj.message, error.message);
      return null;
    }
  }

  /**
   * Gets season data from a URL
   *
   * @param {string} seasonUrl - The season URL
   * @returns {Promise<Object|null>} - Season data or null if failed
   */
  async getSeason(seasonUrl) {
    try {
      // Clean URL
      const cleanUrl = this.scraperService.cleanUrl(seasonUrl);
      const { title, episodes } = SELECTORS.seasons;

      // Select elements
      const elements = await this.scraperService.selectElements(cleanUrl, {
        title,
        episodes,
      });

      if (!elements) {
        return null;
      }

      const { $, title: seasonTitle, episodes: episodesElts } = elements;

      if (seasonTitle && episodesElts) {
        // Create episodes array
        const episodesArray = episodesElts
          .map((i, e) => ({
            EpisodeTitle: $(e).text(),
            EpisodeLink: this.scraperService.cleanUrl(e.attribs["href"]),
          }))
          .toArray();

        // Create season object
        return {
          SeasonTitle: seasonTitle.length > 0 ? seasonTitle.text() : "no season title",
          SeasonLink: cleanUrl,
          LastEpisode: episodesArray.length > 0 ? episodesArray[0] : null,
          Episodes: episodesArray,
        };
      }

      return null;
    } catch (error) {
      const errorObj = ErrorHandler.createError("Failed to get season data", "getSeason", error);
      this.logger.error(errorObj.message, error.message);
      return null;
    }
  }

  /**
   * Gets episode data from a URL
   *
   * @param {string} episodeUrl - The episode URL
   * @returns {Promise<Object|null>} - Episode data or null if failed
   */
  async getEpisode(episodeUrl) {
    try {
      // Clean URL
      const cleanUrl = this.scraperService.cleanUrl(episodeUrl);
      const { title, previews_episode_link, episode_buttons, downloads } = SELECTORS.episode;

      // Select elements
      const elements = await this.scraperService.selectElements(cleanUrl, {
        title,
        previews_episode_link,
        episode_buttons,
        downloads,
      });

      if (!elements) {
        return null;
      }

      const { $, title: episodeTitle, previews_episode_link: previewsEpisodeLinkElt, episode_buttons: episodeButtonsElts, downloads: downloadsElts } = elements;

      if (episodeTitle && previewsEpisodeLinkElt && episodeButtonsElts && downloadsElts) {
        // Get current episode button index
        let currentEpisodeButtonIndex = null;
        episodeButtonsElts.map((idx, btn) => {
          if (btn && btn.attribs && this.scraperService.cleanUrl(btn.attribs["href"]) === cleanUrl) {
            currentEpisodeButtonIndex = idx;
          }
        });

        // Get previous episode button link
        const previousButtonLink =
          currentEpisodeButtonIndex !== null && episodeButtonsElts[currentEpisodeButtonIndex + 1] && episodeButtonsElts[currentEpisodeButtonIndex + 1].attribs
            ? this.scraperService.cleanUrl(episodeButtonsElts[currentEpisodeButtonIndex + 1].attribs["href"])
            : null;

        // Create downloads array
        const downloadsArray = downloadsElts
          .map((i, d) => ({
            DownloadLabel: $(d).text(),
            DownloadLink: this.scraperService.cleanDownloadUrl(d.attribs["href"]),
          }))
          .toArray();

        // Create episode object
        return {
          EpisodeTitle: episodeTitle.length > 0 ? episodeTitle.text() : "no episode title",
          EpisodeLink: cleanUrl,
          PreviewsEpisodeLink: previewsEpisodeLinkElt.length > 0 ? this.scraperService.cleanUrl(previewsEpisodeLinkElt.attr()["href"]) : null,
          PreviewsEpisodeButtonLink: previousButtonLink,
          Downloads: downloadsArray,
        };
      }

      return null;
    } catch (error) {
      const errorObj = ErrorHandler.createError("Failed to get episode data", "getEpisode", error);
      this.logger.error(errorObj.message, error.message);
      return null;
    }
  }

  /**
   * Gets season data using previous episode links
   *
   * @param {string} seasonUrl - The season URL
   * @param {string} [episodeUrlStart=null] - The starting episode URL
   * @param {string} [episodeUrlEnd=null] - The ending episode URL
   * @returns {Promise<Object|null>} - Complete season data or null if failed
   */
  async get_season_by_previews(seasonUrl, episodeUrlStart = null, episodeUrlEnd = null) {
    try {
      // Get season data
      const seasonData = await this.getSeason(seasonUrl);

      // Info
      const seasonTitle = seasonData ? seasonData.SeasonTitle : "no season title";
      let episodeLink = episodeUrlStart ? episodeUrlStart : seasonData && seasonData.LastEpisode ? seasonData.LastEpisode.EpisodeLink : null;

      if (episodeLink) {
        // Episodes container
        const episodes = [];

        // Start by last episode and go back
        while (episodeLink) {
          // Get current episode data
          const episodeData = await this.getEpisode(episodeLink);

          if (episodeData) {
            // Add current episode
            episodes.push(episodeData);

            // Stop if current episode is last episode
            if (episodeData.EpisodeLink === episodeUrlEnd) {
              break;
            }

            // Update episode link by previous episode link
            episodeLink = episodeData.PreviewsEpisodeLink || episodeData.PreviewsEpisodeButtonLink;
          } else {
            // Stop if episode data not exist
            break;
          }
        }

        // Reverse episodes because it's from last to first
        episodes.reverse();

        // Episode download links
        const episodeDownloadLinks = episodes.map((e) => (e.Downloads && e.Downloads.length > 0 ? e.Downloads[0].DownloadLink : null));

        return {
          SeasonTitle: seasonTitle,
          SeasonLink: seasonUrl,
          Episodes: episodes,
          EpisodeDownloadLinks: episodeDownloadLinks,
        };
      }

      return null;
    } catch (error) {
      const errorObj = ErrorHandler.createError("Failed to get season data by previews", "get_season_by_previews", error);
      this.logger.error(errorObj.message, error.message);
      return null;
    }
  }

  /**
   * Gets serie data using previous episode links
   *
   * @param {string} serieUrl - The serie URL
   * @returns {Promise<Object|null>} - Complete serie data or null if failed
   */
  async get_serie_by_previews(serieUrl) {
    try {
      // Get serie data
      const serie = await this.getSerie(serieUrl);

      if (serie) {
        // For each season in serie
        for (let seasonIndex in serie.Seasons) {
          const { SeasonLink } = serie.Seasons[+seasonIndex];

          // Get season data by previews method & update season in serie data
          serie.Seasons[+seasonIndex] = await this.get_season_by_previews(SeasonLink);
        }

        return serie;
      }

      return null;
    } catch (error) {
      const errorObj = ErrorHandler.createError("Failed to get serie data by previews", "get_serie_by_previews", error);
      this.logger.error(errorObj.message, error.message);
      return null;
    }
  }
}

module.exports = { MyCima };
