const { debug } = require("../util")(module);
const { DbConn } = require("../db");

let objDb = null;

module.exports = {
  async init(entity) {
    this.checkEntity(entity);
    this.entity = entity;

    if (objDb) return objDb;
    objDb = this;

    this.dbConn = new DbConn();
    this.db = await this.dbConn.getDb();
    this.docs = this.db.collection(entity);
    this.log = this.db.collection("log");
    debug("Connected successfully to MongoDb.");

    return this;
  },

  checkEntity(entity) {
    if (!["movie", "torrent"].includes(entity)) {
      throw Error('"entity" argurment should be `movie` or `torrent`.');
    }
  },

  async close() {
    await this.dbConn.close();
    objDb = null;
    debug("Connection to MongoDb successfully closed.");
  },

  async createIndex() {
    let indexSpecs;
    const options = { background: true };

    switch (this.entity) {
      case "torrent":
        indexSpecs = [{ deleted: -1 }, { _id: 1 }];
        break;

      case "movie":
        indexSpecs = [{ _id: 1 }];
        break;

      default:
        break;
    }

    // if (!indexSpecs) return null

    // eslint-disable-next-line no-restricted-syntax
    for (const indexSpec of indexSpecs) {
      // eslint-disable-next-line no-underscore-dangle
      const opts = indexSpec._id ? {} : options;
      // eslint-disable-next-line no-await-in-loop
      const res = await this.docs.createIndex(indexSpec, opts);
      debug("Result of creating index:", res);
    }
  },
};
