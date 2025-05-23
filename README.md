# MyCima Scraping

Get `Serie`, `Season` and `Episode` Infos from MyCima Web Site by URL

## Methods

- getSerie
- getSeason
- getEpisode
- get_season_by_previews
- get_serie_by_previews

## Example Code

```js
const mycima = new MyCima();
mycima.getSerie("https://wecima.film/series/.......").then((rep) => {
  console.log(rep);
});
mycima.getSeason("https://wecima.film/series/.......").then((rep) => {
  console.log(rep);
});
mycima.getEpisode("https://wecima.film/watch/.......").then((rep) => {
  console.log(rep);
});
mycima.get_serie_by_previews("https://wecima.film/series/.......").then((rep) => {
  console.log(rep);
});
mycima.get_season_by_previews("https://wecima.film/series/.......").then((rep) => {
  console.log(rep);
});
```
