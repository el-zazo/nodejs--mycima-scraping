/**
 * Advanced Usage Example
 * Demonstrates more complex features of the MyCima library
 */

const { MyCima } = require("../");
const fs = require("fs");
const path = require("path");

// Create a new instance with logging enabled
const mycima = new MyCima(true);

// Example URLs (replace with actual URLs)
const SERIE_URL = "https://wecima.film/series/example-series";
const SEASON_URL = "https://wecima.film/series/example-series/season-1";

// Example 1: Get complete serie information (all seasons and episodes)
async function getCompleteSerieExample() {
  console.log("\n--- Getting Complete Serie Information ---");
  console.log("This may take some time as it fetches all seasons and episodes...");

  try {
    const completeSerieData = await mycima.get_serie_by_previews(SERIE_URL);

    console.log("Serie Title:", completeSerieData.SerieTitle);
    console.log("Number of Seasons:", completeSerieData.Seasons.length);

    // Count total episodes across all seasons
    let totalEpisodes = 0;
    completeSerieData.Seasons.forEach((season) => {
      totalEpisodes += season.Episodes.length;
    });

    console.log("Total Episodes:", totalEpisodes);

    // Save the data to a JSON file
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "complete-serie.json");
    fs.writeFileSync(outputPath, JSON.stringify(completeSerieData, null, 2));
    console.log(`Complete serie data saved to ${outputPath}`);

    return completeSerieData;
  } catch (error) {
    console.error("Error getting complete serie:", error.message);
    return null;
  }
}

// Example 2: Get season with episode range
async function getSeasonWithRangeExample() {
  console.log("\n--- Getting Season with Episode Range ---");

  try {
    // First get the season to find episode URLs
    const seasonData = await mycima.getSeason(SEASON_URL);

    if (!seasonData || !seasonData.Episodes || seasonData.Episodes.length < 5) {
      console.log("Not enough episodes to demonstrate range functionality");
      return null;
    }

    // Get episodes 2 through 4 (if available)
    const startEpisodeUrl = seasonData.Episodes[1].EpisodeLink; // Episode 2
    const endEpisodeUrl = seasonData.Episodes[3].EpisodeLink; // Episode 4

    console.log(`Fetching episodes from ${startEpisodeUrl} to ${endEpisodeUrl}`);

    const rangeSeasonData = await mycima.get_season_by_previews(SEASON_URL, startEpisodeUrl, endEpisodeUrl);

    console.log("Season Title:", rangeSeasonData.SeasonTitle);
    console.log("Episodes in Range:", rangeSeasonData.Episodes.length);
    console.log("Episode Titles:");
    rangeSeasonData.Episodes.forEach((episode, index) => {
      console.log(`  ${index + 1}. ${episode.EpisodeTitle}`);
    });

    return rangeSeasonData;
  } catch (error) {
    console.error("Error getting season with range:", error.message);
    return null;
  }
}

// Example 3: Extract all download links from a season
async function extractDownloadLinksExample() {
  console.log("\n--- Extracting Download Links ---");

  try {
    const seasonData = await mycima.get_season_by_previews(SEASON_URL);

    if (!seasonData || !seasonData.Episodes) {
      console.log("No episodes found");
      return null;
    }

    console.log(`Found ${seasonData.Episodes.length} episodes`);

    // Create a map of episode titles to download links
    const downloadLinks = seasonData.Episodes.map((episode) => {
      const bestQualityLink = episode.Downloads && episode.Downloads.length > 0 ? episode.Downloads[0].DownloadLink : null;

      return {
        title: episode.EpisodeTitle,
        link: bestQualityLink,
      };
    });

    console.log("Download Links:");
    downloadLinks.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title}: ${item.link || "No link available"}`);
    });

    // Save the links to a text file
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "download-links.txt");
    const content = downloadLinks
      .filter((item) => item.link) // Filter out items without links
      .map((item) => `${item.title}\n${item.link}\n`)
      .join("\n");

    fs.writeFileSync(outputPath, content);
    console.log(`Download links saved to ${outputPath}`);

    return downloadLinks;
  } catch (error) {
    console.error("Error extracting download links:", error.message);
    return null;
  }
}

// Run examples
async function runExamples() {
  // Replace these URLs with actual URLs from MyCima
  console.log("NOTE: Replace the example URLs in this file with actual MyCima URLs");

  await getCompleteSerieExample();
  await getSeasonWithRangeExample();
  await extractDownloadLinksExample();
}

runExamples().catch((error) => {
  console.error("Error running examples:", error.message);
});
