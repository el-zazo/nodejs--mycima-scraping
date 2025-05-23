const { default: axios } = require("axios");
const { load } = require("cheerio");
const { ConsoleMessages } = require("@elzazo/console-messages");

// Data
const { selectors } = require("./Data/selectors");

/**
 * ### MyCima Helper
 * Get Data From MyCima WebSite
 */
class MyCima {
  /**
   * @param {boolean} [display_info=true]
   * @param {ConsoleMessages} CM
   */
  constructor(display_info = true, CM = null) {
    this.display_info = display_info;
    this.CM = CM || new ConsoleMessages();
  }

  /**
   * ### Fetch Data By Axios And Select Selectors
   *
   * _return `$` and `elements` selected in `[$, elt1, elt2, ...]`_
   * @param {string} url
   * @param {...string} selectors
   */
  async #select(url, ...selectors) {
    if (this.display_info) this.CM.normal("Select Info From :", url);

    try {
      // Fetch Data
      const { data } = await axios.get(url);

      // Select Selectors
      const $ = load(data);

      // Display
      if (this.display_info) this.CM.succes("\tInfo Selected");

      return [$, ...selectors.map((s) => $(s))];
    } catch (error) {
      // Display
      if (this.display_info) this.CM.error("\tFailed Select Info :", error.message);

      return [];
    }
  }

  /**
   * ### Get Serie Data
   *
   * _return `serie title`, `serie link`, and list of `seasons`_\
   * _every `season` has `season title` and `season link`_
   * @param {string} serie_url
   */
  async getSerie(serie_url) {
    serie_url = decodeURIComponent(serie_url);
    const { title, seasons } = selectors.serie;

    // Select Elts
    const [$, serie_title, seasons_elts] = await this.#select(serie_url, title, seasons);

    if (serie_title && seasons_elts) {
      return {
        SerieTitle: serie_title.length > 0 ? serie_title.text() : "no serie title",
        SerieLink: serie_url,
        Seasons: seasons_elts.map((i, e) => ({ SeasonTitle: $(e).text(), SeasonLink: decodeURIComponent(e.attribs["href"]) })).toArray(),
      };
    }

    return null;
  }

  /**
   * ### Get Season Data
   *
   * _return `season title`, `season link`, `last episode`, and list of `episodes`_\
   * _every `episode` has `episode title` and `episode link`_
   * @param {string} season_url
   */
  async getSeason(season_url) {
    season_url = decodeURIComponent(season_url);
    const { title, episodes } = selectors.seasons;

    // Select Elts
    const [$, season_title, episodes_elts] = await this.#select(season_url, title, episodes);

    if (season_title && episodes_elts) {
      const Episodes = episodes_elts.map((i, e) => ({ EpisodeTitle: $(e).text(), EpisodeLink: decodeURIComponent(e.attribs["href"]) })).toArray();

      return {
        SeasonTitle: season_title.length > 0 ? season_title.text() : "no season title",
        SeasonLink: season_url,
        LastEpisode: Episodes.length > 0 ? Episodes[0] : null,
        Episodes,
      };
    }

    return null;
  }

  /**
   * ### Get Episode Data
   *
   * _return `episode title`, `episode link`, `previous episode link`, list of `downloads`_\
   * _every `download` has `download label` and `download link`_
   * @param {string} episode_url
   */
  async getEpisode(episode_url) {
    episode_url = decodeURIComponent(episode_url);
    const { title, previews_episode_link, episode_buttons, downloads } = selectors.episode;

    // Select Elts
    const select_res = await this.#select(episode_url, title, previews_episode_link, episode_buttons, downloads);
    const [$, episode_title, previews_episode_link_elt, episode_buttons_elts, downloads_elts] = select_res;

    if (episode_title && previews_episode_link_elt && episode_buttons_elts && downloads_elts) {
      // Get Current Episode Button Index
      let CEB_idx = null;
      episode_buttons_elts.map((idx, btn) => {
        if (btn && btn.attribs && decodeURIComponent(btn.attribs["href"]) === episode_url) {
          CEB_idx = idx;
        }
      });

      // Get Previews Episode Button Link
      const link = CEB_idx && episode_buttons_elts[CEB_idx + 1] && episode_buttons_elts[CEB_idx + 1].attribs ? decodeURIComponent(episode_buttons_elts[CEB_idx + 1].attribs["href"]) : null;

      return {
        EpisodeTitle: episode_title.length > 0 ? episode_title.text() : "no episode title",
        EpisodeLink: episode_url,
        PreviewsEpisodeLink: previews_episode_link_elt.length > 0 ? decodeURIComponent(previews_episode_link_elt.attr()["href"]) : null,
        PreviewsEpisodeButtonLink: link,
        Downloads: downloads_elts.map((i, d) => ({ DownloadLabel: $(d).text(), DownloadLink: decodeURIComponent(d.attribs["href"].replace(/.mp4.html/gi, ".mp4")) })).toArray(),
      };
    }

    return null;
  }

  /**
   * ### Get Season Data Using Previews Method
   * Complete Data Season With Episodes
   *
   * _return `season title`, `season link`, list of `episodes`, and list of `episode download links`_
   * @param {string} season_url
   */
  async get_season_by_previews(season_url, episode_url_start = null, episode_url_end = null) {
    // Get Season Data
    const season_data = await this.getSeason(season_url);

    // Info
    const season_title = season_data ? season_data.SeasonTitle : "no season title";
    let episode_link = episode_url_start ? episode_url_start : season_data ? season_data.LastEpisode.EpisodeLink : null;

    if (episode_link != null) {
      // Episodes Container
      const Episodes = [];

      // Start by last episode and go back
      while (episode_link) {
        // Get Current Episode Data
        const episode_data = await this.getEpisode(episode_link);

        if (episode_data) {
          // Add Current Episode
          Episodes.push(episode_data);

          // Stop If Current Episode is Last Episode
          if (episode_data.EpisodeLink === episode_url_end) break;

          // Update Episode Link by Previews Episode Link
          episode_link = episode_data.PreviewsEpisodeLink || episode_data.PreviewsEpisodeButtonLink;
        } else {
          // Stop If Episode Data Not Exist
          break;
        }
      }

      // Reverse Episodes because is it from last to first
      Episodes.reverse();

      // Episode Download Links
      const EpisodeDownloadLinks = Episodes.map((e) => (e.Downloads.length > 0 ? e.Downloads[0].DownloadLink : null));

      return { SeasonTitle: season_title, SeasonLink: season_url, Episodes, EpisodeDownloadLinks };
    }

    return null;
  }

  /**
   * ### Get Serie Data Using Previews Method
   * Complete Data Serie With Seasons and Season With Episodes
   *
   * _return `serie title`, `serie link`, list of `seasons` with method `get_season_by_previews`_
   * @param {string} serie_url
   */
  async get_serie_by_previews(serie_url) {
    // Get Serie Data
    const Serie = await this.getSerie(serie_url);

    if (Serie != null) {
      // For Each Season in Serie
      for (let SeasonInd in Serie.Seasons) {
        const { SeasonLink } = Serie.Seasons[+SeasonInd];

        // Get Season Data By Previews Method & Update Season in Serie Data
        Serie.Seasons[+SeasonInd] = await this.get_season_by_previews(SeasonLink);
      }

      return Serie;
    }

    return null;
  }
}

const a = new MyCima();
// a.getSerie("https://wecima.film/series/مسلسل-المؤسس-عثمان-1/").then((rep) => {
//   console.log(rep);
// });
// a.getSeason("https://wecima.film/series/موسم-1-مسلسل-المؤسس-عثمان-1/").then((rep) => {
//   console.log(rep);
// });
// a.getEpisode("https://wecima.film/watch/مسلسل-المؤسس-عثمان-موسم-1-حلقة-1-مترجمة-1/").then((rep) => {
//   console.log(rep);
// });
// a.get_serie_by_previews("https://wecima.film/series/مسلسل-المؤسس-عثمان-1/").then((rep) => {
//   console.log(rep);
// });
// a.get_season_by_previews("https://wecima.film/series/موسم-1-مسلسل-المؤسس-عثمان-1/").then((rep) => {
//   console.log(rep);
// });

module.exports = { MyCima };
