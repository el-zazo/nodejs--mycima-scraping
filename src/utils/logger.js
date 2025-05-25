/**
 * Logger Utility
 * Provides standardized logging functionality for the application
 */

const { ConsoleMessages } = require("@elzazo/console-messages");

class Logger {
  /**
   * @param {boolean} [displayInfo=true] - Whether to display info messages
   */
  constructor(displayInfo = true) {
    this.displayInfo = displayInfo;
    this.consoleMessages = new ConsoleMessages();
  }

  /**
   * Logs a normal message if display info is enabled
   *
   * @param {string} message - The message to log
   * @param {...any} args - Additional arguments to log
   */
  info(message, ...args) {
    if (this.displayInfo) {
      this.consoleMessages.normal(message, ...args);
    }
  }

  /**
   * Logs a success message if display info is enabled
   *
   * @param {string} message - The message to log
   * @param {...any} args - Additional arguments to log
   */
  success(message, ...args) {
    if (this.displayInfo) {
      this.consoleMessages.succes(message, ...args);
    }
  }

  /**
   * Logs an error message if display info is enabled
   *
   * @param {string} message - The message to log
   * @param {...any} args - Additional arguments to log
   */
  error(message, ...args) {
    if (this.displayInfo) {
      this.consoleMessages.error(message, ...args);
    }
  }

  /**
   * Logs a warning message if display info is enabled
   *
   * @param {string} message - The message to log
   * @param {...any} args - Additional arguments to log
   */
  warning(message, ...args) {
    if (this.displayInfo) {
      this.consoleMessages.warning(message, ...args);
    }
  }
}

module.exports = Logger;
