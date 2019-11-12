const { MongoClient } = require('mongodb');
const { debug } = require('./util')(module);

exports.DbConn = class {
  constructor(url = 'mongodb://localhost:27017', dbName = 'handyData') {
    this.url = `${url}/${dbName}`;
    this.client = new MongoClient(this.url, { useNewUrlParser: true });
  }

  async getDb() {
    if (this.db) return this.db;

    try {
      await this.client.connect();
      debug('Connected successfully to MongoDb:', this.url);
      this.db = this.client.db();
      return this.db;
    } catch (e) {
      e.message = `Connection with MongoDb not has been established: ${e.message}`;
      throw e;
    }
  }

  async close() {
    try {
      await this.client.close();
      debug('Connection to MongoDb was closed.');
    } catch (e) {
      e.message = `Error occurred when closing connection: ${e.message}`;
      throw e;
    }
  }
};
