import request from "request";
import url from "url";
import config from "../../../config.js";

const baseUrl = config.get("baseUrl");

const defaultOptions = {
  baseUrl,
  json: true,
  method: "GET",
  gzip: true,
  headers: {
    Host: new url.Url(baseUrl).host,
    "User-Agent": "Java/1.8.0_212",
    "Accept-Encoding": "gzip, deflate",
    Accept: "text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2",
    Connection: "keep-alive",
  },
};

const queryOptions = {
  uri: "/{movie|torrent}/select/",
  qs: {
    q: "(*:*)",
    sort: "",
    // sort: 'id asc',
    // sort: 'add_date desc',
    fl: "*",
    fq: "",
    start: 0,
    rows: 0,
    version: "2.2",
    wt: "json1",
  },
};

export default {
  baseRequest: {},

  init(state) {
    const entityOptions = this[`getOptsFor:${state.entity}`](state);
    this.baseRequest = request
      .defaults(defaultOptions)
      .defaults(queryOptions)
      .defaults(entityOptions);
  },

  "getOptsFor:movie": function movie(state) {
    return {
      uri: this.getUri(state.entity),
    };
  },

  "getOptsFor:torrent": function torrent(state) {
    return {
      uri: this.getUri(state.entity),
      qs: {
        fq: `deleted:${state.deleted}`,
      },
    };
  },

  getUri(entity) {
    return `/${entity}/select/`;
  },
};
