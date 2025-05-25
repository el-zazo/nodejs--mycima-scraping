/**
 * Download Model
 * Represents a download link with its quality label
 */

class Download {
  /**
   * @param {Object} data - The download data
   * @param {string} data.label - The download quality label
   * @param {string} data.link - The download link
   */
  constructor(data) {
    this.label = data.label || "Unknown Quality";
    this.link = data.link || "";
  }

  /**
   * Creates a Download instance from raw data
   *
   * @param {string} label - The download quality label
   * @param {string} link - The download link
   * @returns {Download} - A new Download instance
   */
  static fromRawData(label, link) {
    return new Download({
      label,
      link,
    });
  }

  /**
   * Extracts the quality from the label
   *
   * @returns {string|null} - The quality (e.g., "720p") or null if not found
   */
  getQuality() {
    const qualityMatch = this.label.match(/\d+p/);
    return qualityMatch ? qualityMatch[0] : null;
  }

  /**
   * Converts the Download to a plain object
   *
   * @returns {Object} - Plain object representation of the Download
   */
  toObject() {
    return {
      DownloadLabel: this.label,
      DownloadLink: this.link,
    };
  }
}

module.exports = Download;
