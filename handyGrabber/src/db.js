import mongodb from "mongodb";
import util from "./util.js";

const { debug } = util();

export default class DbConn {
  constructor(url = "mongodb://localhost:27017", dbName = "handyData") {
    this.url = `${url}/${dbName}`;
    this.client = new mongodb.MongoClient(this.url, { useNewUrlParser: true });
  }

  async getDb() {
    if (this.db) return this.db;

    try {
      await this.client.connect();
      debug("Connected successfully to MongoDb:", this.url);
      this.db = this.client.db();
      return this.db;
    } catch (e) {
      throw Error(`Connection with MongoDb not has been established: ${e.message}`);
    }
  }

  async close() {
    try {
      await this.client.close();
      debug("Connection to MongoDb was closed.");
    } catch (e) {
      throw Error(`Error occurred when closing connection: ${e.message}`);
    }
  }
}
