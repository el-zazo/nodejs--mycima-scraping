# MyCima Scraping

A Node.js library for scraping TV series, seasons, and episode information from the MyCima website.

## Features

- Scrape series information including title and available seasons
- Scrape season information including title and available episodes
- Scrape episode information including title and download links
- Comprehensive error handling
- Well-documented code
- Object-oriented architecture

## Installation

```bash
npm install @elzazo/mycima-scraping
```

## Usage

### Basic Usage

```js
const { MyCima } = require("@elzazo/mycima-scraping");

// Create a new instance (true enables logging)
const mycima = new MyCima(true);

// Get series information
mycima.getSerie("https://wecima.film/series/example-series").then((serieData) => {
  console.log(serieData);
});

// Get season information
mycima.getSeason("https://wecima.film/series/example-series/season-1").then((seasonData) => {
  console.log(seasonData);
});

// Get episode information
mycima.getEpisode("https://wecima.film/watch/example-series/season-1/episode-1").then((episodeData) => {
  console.log(episodeData);
});
```

### Advanced Usage

```js
// Get complete series information (including all seasons and episodes)
mycima.get_serie_by_previews("https://wecima.film/series/example-series").then((completeSerieData) => {
  console.log(completeSerieData);
});

// Get complete season information (including all episodes)
mycima.get_season_by_previews("https://wecima.film/series/example-series/season-1").then((completeSeasonData) => {
  console.log(completeSeasonData);
});

// Get season information with specific episode range
const seasonUrl = "https://wecima.film/series/example-series/season-1";
const startEpisodeUrl = "https://wecima.film/watch/example-series/season-1/episode-5";
const endEpisodeUrl = "https://wecima.film/watch/example-series/season-1/episode-1";

mycima.get_season_by_previews(seasonUrl, startEpisodeUrl, endEpisodeUrl).then((rangeSeasonData) => {
  console.log(rangeSeasonData);
});
```

## API Reference

### MyCima Class

#### Constructor

```js
const mycima = new MyCima(displayInfo);
```

- `displayInfo` (boolean, optional): Whether to display log messages. Default: `true`

#### Methods

- `getSerie(serieUrl)`: Get basic series information
- `getSeason(seasonUrl)`: Get basic season information
- `getEpisode(episodeUrl)`: Get episode information with download links
- `get_season_by_previews(seasonUrl, episodeUrlStart, episodeUrlEnd)`: Get complete season information
- `get_serie_by_previews(serieUrl)`: Get complete series information

## License

ISC

## Author

elzazo
