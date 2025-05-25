/**
 * Error Handler Utility
 * Provides standardized error handling for the application
 */

class ErrorHandler {
  /**
   * Creates a standardized error object with additional context
   *
   * @param {string} message - The error message
   * @param {string} source - The source of the error (e.g., method name)
   * @param {Error} originalError - The original error object if available
   * @returns {Object} Standardized error object
   */
  static createError(message, source, originalError = null) {
    return {
      message,
      source,
      timestamp: new Date().toISOString(),
      originalError: originalError
        ? {
            message: originalError.message,
            stack: originalError.stack,
          }
        : null,
    };
  }

  /**
   * Handles HTTP request errors
   *
   * @param {Error} error - The error object from the HTTP request
   * @param {string} url - The URL that was being requested
   * @param {string} source - The source of the request (e.g., method name)
   * @returns {Object} Standardized error object
   */
  static handleRequestError(error, url, source) {
    let errorMessage = "Failed to fetch data";

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = "No response received from server";
    }

    return this.createError(`${errorMessage} from ${url}`, source, error);
  }

  /**
   * Handles parsing errors
   *
   * @param {Error} error - The error object from the parsing operation
   * @param {string} source - The source of the parsing operation
   * @returns {Object} Standardized error object
   */
  static handleParsingError(error, source) {
    return this.createError(`Failed to parse data: ${error.message}`, source, error);
  }
}

module.exports = ErrorHandler;
