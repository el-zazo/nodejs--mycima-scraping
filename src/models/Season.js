/**
 * Season Model
 * Represents a TV season with its episodes
 */

class Season {
  /**
   * @param {Object} data - The season data
   * @param {string} data.title - The season title
   * @param {string} data.link - The season link
   * @param {Object} [data.lastEpisode=null] - The last episode
   * @param {Array} [data.episodes=[]] - The season episodes
   * @param {Array} [data.downloadLinks=[]] - The episode download links
   */
  constructor(data) {
    this.title = data.title || "Unknown Season";
    this.link = data.link || "";
    this.lastEpisode = data.lastEpisode || null;
    this.episodes = data.episodes || [];
    this.downloadLinks = data.downloadLinks || [];
  }

  /**
   * Creates a Season instance from raw data
   *
   * @param {string} title - The season title
   * @param {string} link - The season link
   * @param {Object} lastEpisode - The last episode
   * @param {Array} episodesData - Raw episodes data
   * @returns {Season} - A new Season instance
   */
  static fromRawData(title, link, lastEpisode = null, episodesData = []) {
    return new Season({
      title,
      link,
      lastEpisode,
      episodes: episodesData,
    });
  }

  /**
   * Adds an episode to the season
   *
   * @param {Object} episode - The episode to add
   */
  addEpisode(episode) {
    this.episodes.push(episode);
  }

  /**
   * Gets the episode count
   *
   * @returns {number} - The number of episodes
   */
  getEpisodeCount() {
    return this.episodes.length;
  }

  /**
   * Updates the download links based on episodes
   */
  updateDownloadLinks() {
    this.downloadLinks = this.episodes.map((episode) => {
      return episode.downloads && episode.downloads.length > 0 ? episode.downloads[0].link : null;
    });
  }

  /**
   * Converts the Season to a plain object
   *
   * @returns {Object} - Plain object representation of the Season
   */
  toObject() {
    return {
      SeasonTitle: this.title,
      SeasonLink: this.link,
      LastEpisode: this.lastEpisode,
      Episodes: this.episodes,
      EpisodeDownloadLinks: this.downloadLinks,
    };
  }
}

module.exports = Season;
