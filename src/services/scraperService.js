/**
 * Scraper Service
 * Handles all web scraping operations for MyCima website
 */

const { default: axios } = require("axios");
const { load } = require("cheerio");
const ErrorHandler = require("../utils/errorHandler");
const Logger = require("../utils/logger");
const { URL_PATTERNS } = require("../config/constants");

class ScraperService {
  /**
   * @param {boolean} [displayInfo=true] - Whether to display info messages
   */
  constructor(displayInfo = true) {
    this.logger = new Logger(displayInfo);
  }

  /**
   * Fetches HTML content from a URL and loads it into Cheerio
   *
   * @param {string} url - The URL to fetch data from
   * @returns {Promise<Object|null>} - Cheerio object or null if failed
   */
  async fetchPage(url) {
    this.logger.info("Fetching page:", url);

    try {
      const { data } = await axios.get(url);
      const $ = load(data);

      this.logger.success("\tPage fetched successfully");
      return $;
    } catch (error) {
      const errorObj = ErrorHandler.handleRequestError(error, url, "fetchPage");
      this.logger.error("\tFailed to fetch page:", errorObj.message);
      return null;
    }
  }

  /**
   * Selects elements from a page using provided selectors
   *
   * @param {string} url - The URL to fetch data from
   * @param {Object} selectors - Object containing CSS selectors to use
   * @returns {Promise<Object|null>} - Object containing selected elements or null if failed
   */
  async selectElements(url, selectors) {
    try {
      const $ = await this.fetchPage(url);

      if (!$) {
        return null;
      }

      const result = {};

      // Process each selector and store the result
      for (const [key, selector] of Object.entries(selectors)) {
        result[key] = $(selector);
      }

      return { $, ...result };
    } catch (error) {
      const errorObj = ErrorHandler.handleParsingError(error, "selectElements");
      this.logger.error("\tFailed to select elements:", errorObj.message);
      return null;
    }
  }

  /**
   * Cleans a URL by decoding it
   *
   * @param {string} url - The URL to clean
   * @returns {string} - The cleaned URL
   */
  cleanUrl(url) {
    return decodeURIComponent(url);
  }

  /**
   * Cleans a download URL by replacing .mp4.html with .mp4
   *
   * @param {string} url - The download URL to clean
   * @returns {string} - The cleaned download URL
   */
  cleanDownloadUrl(url) {
    return decodeURIComponent(url.replace(URL_PATTERNS.mp4Extension, ".mp4"));
  }
}

module.exports = ScraperService;
