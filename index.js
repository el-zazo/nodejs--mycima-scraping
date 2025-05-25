/**
 * MyCima Scraping
 * Entry point for the package
 *
 * This file re-exports the MyCima class from the src directory
 * for backward compatibility
 */

const { MyCima } = require("./src/MyCima");

module.exports = { MyCima };
