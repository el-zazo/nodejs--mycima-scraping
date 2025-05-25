/**
 * Basic Usage Example
 * Demonstrates how to use the MyCima library
 */

const { MyCima } = require("../");

// Create a new instance with logging enabled
const mycima = new MyCima(true);

// Example URLs (replace with actual URLs)
const SERIE_URL = "https://wecima.film/series/example-series";
const SEASON_URL = "https://wecima.film/series/example-series/season-1";
const EPISODE_URL = "https://wecima.film/watch/example-series/season-1/episode-1";

// Example 1: Get basic serie information
async function getSerieExample() {
  console.log("\n--- Getting Serie Information ---");
  try {
    const serieData = await mycima.getSerie(SERIE_URL);
    console.log("Serie Title:", serieData.SerieTitle);
    console.log("Number of Seasons:", serieData.Seasons.length);
  } catch (error) {
    console.error("Error getting serie:", error.message);
  }
}

// Example 2: Get basic season information
async function getSeasonExample() {
  console.log("\n--- Getting Season Information ---");
  try {
    const seasonData = await mycima.getSeason(SEASON_URL);
    console.log("Season Title:", seasonData.SeasonTitle);
    console.log("Number of Episodes:", seasonData.Episodes.length);
    console.log("Last Episode:", seasonData.LastEpisode.EpisodeTitle);
  } catch (error) {
    console.error("Error getting season:", error.message);
  }
}

// Example 3: Get episode information
async function getEpisodeExample() {
  console.log("\n--- Getting Episode Information ---");
  try {
    const episodeData = await mycima.getEpisode(EPISODE_URL);
    console.log("Episode Title:", episodeData.EpisodeTitle);
    console.log("Number of Download Links:", episodeData.Downloads.length);

    if (episodeData.Downloads.length > 0) {
      console.log("First Download Link:", episodeData.Downloads[0].DownloadLink);
    }
  } catch (error) {
    console.error("Error getting episode:", error.message);
  }
}

// Run examples
async function runExamples() {
  // Replace these URLs with actual URLs from MyCima
  console.log("NOTE: Replace the example URLs in this file with actual MyCima URLs");

  await getSerieExample();
  await getSeasonExample();
  await getEpisodeExample();
}

runExamples().catch((error) => {
  console.error("Error running examples:", error.message);
});
