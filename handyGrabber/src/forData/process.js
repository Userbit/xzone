const { debug, sleep, ...util } = require("../util")(module);
const dbModel = require("./dbModel");
const log = require("./log");
const req = require("./request");

module.exports = {
  async init(cli) {
    debug("Start forData/process.js");

    this.db = await dbModel.init(cli.argv.entity);
    await this.db.createIndex();

    sleep(10);
    await this.run(cli);
  },

  async run(cli) {
    debug("Running...");

    // Get cleaned state from cli.argv out of specified keys for the sake of clarity
    const state = util.getObjectForKeys(["stage", "entity", "log"], cli.argv);

    await this[`runEntity:${state.entity}`](state);
    await this.end();
  },

  async end() {
    debug("Ending...");
    await this.db.close();
  },

  "runEntity:movie": async function movie(state) {
    debug("runEntity:movie(%o)...", state);
    await this.runStage(state);
  },

  "runEntity:torrent": async function torrent(state) {
    debug("runEntity:torrent(%o)...", state);

    let newState = { ...state, deleted: true };
    await this.runStage(newState);

    newState = { ...newState, deleted: false };
    await this.runStage(newState);
  },

  async runStage(state) {
    debug("runStage(%o)...", state);

    await this.initSubModules(state);
    await this[`runStage:${state.stage}`](state);
  },

  async initSubModules(state) {
    debug("initSubModules(%o)...", state);

    log.init(state);
    req.init(state);
  },

  "runStage:first": async function first(state) {
    debug("runStage:first(%o)...", state);
  },

  "runStage:upsert": async function upsert(state) {
    debug("runStage:upsert(%o)...", state);
  },

  "runStage:check": async function check(state) {
    debug("runStage:check(%o)...", state);
  },
};
