/**
 * Episode Model
 * Represents a TV episode with its download links
 */

class Episode {
  /**
   * @param {Object} data - The episode data
   * @param {string} data.title - The episode title
   * @param {string} data.link - The episode link
   * @param {string} [data.previousLink=null] - The previous episode link
   * @param {string} [data.previousButtonLink=null] - The previous episode button link
   * @param {Array} [data.downloads=[]] - The episode downloads
   */
  constructor(data) {
    this.title = data.title || "Unknown Episode";
    this.link = data.link || "";
    this.previousLink = data.previousLink || null;
    this.previousButtonLink = data.previousButtonLink || null;
    this.downloads = data.downloads || [];
  }

  /**
   * Creates an Episode instance from raw data
   *
   * @param {string} title - The episode title
   * @param {string} link - The episode link
   * @param {string} previousLink - The previous episode link
   * @param {string} previousButtonLink - The previous episode button link
   * @param {Array} downloadsData - Raw downloads data
   * @returns {Episode} - A new Episode instance
   */
  static fromRawData(title, link, previousLink = null, previousButtonLink = null, downloadsData = []) {
    return new Episode({
      title,
      link,
      previousLink,
      previousButtonLink,
      downloads: downloadsData,
    });
  }

  /**
   * Adds a download to the episode
   *
   * @param {Object} download - The download to add
   */
  addDownload(download) {
    this.downloads.push(download);
  }

  /**
   * Gets the best quality download link
   *
   * @returns {string|null} - The best quality download link or null if none
   */
  getBestDownloadLink() {
    return this.downloads.length > 0 ? this.downloads[0].link : null;
  }

  /**
   * Converts the Episode to a plain object
   *
   * @returns {Object} - Plain object representation of the Episode
   */
  toObject() {
    return {
      EpisodeTitle: this.title,
      EpisodeLink: this.link,
      PreviewsEpisodeLink: this.previousLink,
      PreviewsEpisodeButtonLink: this.previousButtonLink,
      Downloads: this.downloads,
    };
  }
}

module.exports = Episode;
