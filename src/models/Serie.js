/**
 * Serie Model
 * Represents a TV series with its seasons and episodes
 */

class Serie {
  /**
   * @param {Object} data - The serie data
   * @param {string} data.title - The serie title
   * @param {string} data.link - The serie link
   * @param {Array} [data.seasons=[]] - The serie seasons
   */
  constructor(data) {
    this.title = data.title || "Unknown Title";
    this.link = data.link || "";
    this.seasons = data.seasons || [];
  }

  /**
   * Creates a Serie instance from raw data
   *
   * @param {string} title - The serie title
   * @param {string} link - The serie link
   * @param {Array} seasonsData - Raw seasons data
   * @returns {Serie} - A new Serie instance
   */
  static fromRawData(title, link, seasonsData = []) {
    return new Serie({
      title,
      link,
      seasons: seasonsData,
    });
  }

  /**
   * Adds a season to the serie
   *
   * @param {Object} season - The season to add
   */
  addSeason(season) {
    this.seasons.push(season);
  }

  /**
   * Updates a season at a specific index
   *
   * @param {number} index - The index of the season to update
   * @param {Object} season - The new season data
   */
  updateSeason(index, season) {
    if (index >= 0 && index < this.seasons.length) {
      this.seasons[index] = season;
    }
  }

  /**
   * Gets the season count
   *
   * @returns {number} - The number of seasons
   */
  getSeasonCount() {
    return this.seasons.length;
  }

  /**
   * Converts the Serie to a plain object
   *
   * @returns {Object} - Plain object representation of the Serie
   */
  toObject() {
    return {
      SerieTitle: this.title,
      SerieLink: this.link,
      Seasons: this.seasons,
    };
  }
}

module.exports = Serie;
