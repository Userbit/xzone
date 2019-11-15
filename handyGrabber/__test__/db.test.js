jest.mock("mongodb");

const { MongoClient } = require("mongodb");
const { DbConn } = require("../src/db");

const opts = { useNewUrlParser: true };
const keysOfClient = ["close", "connect", "db"];
const dbName = "handyData";

describe("testing db.js", () => {
  it("db.js should be required", () => {
    expect(DbConn).toBeFunction();
  });

  it("new DbConn() without args", () => {
    const url = `mongodb://localhost:27017/${dbName}`;

    const dbConn = new DbConn();

    expect(MongoClient).toHaveBeenCalledWith(url, opts);
    expect(dbConn.url).toBe(url);
    expect(dbConn.client).toContainKeys(keysOfClient);
  });

  it("new DbConn() with args", () => {
    let url = "mongodb://localhost:27018";
    const dbn = `${dbName}2`;
    const dbConn = new DbConn(url, dbn);
    url = `${url}/${dbn}`;

    expect(MongoClient).toHaveBeenCalledWith(url, opts);
    expect(dbConn.url).toBe(url);
    expect(dbConn.client).toContainKeys(keysOfClient);
  });

  it("dbConn.close() without error", async () => {
    const dbConn = new DbConn();
    await dbConn.close();

    expect(dbConn.client.close).toHaveBeenCalledTimes(1);
  });

  it("dbConn.close() with error", async () => {
    const mErr = Error("MongoDb error");
    const dbConn = new DbConn();
    jest.spyOn(dbConn.client, "close").mockImplementation(() => {
      throw mErr;
    });

    await expect(dbConn.close()).rejects.toThrow(
      "Error occurred when closing connection: MongoDb error"
    );

    expect(dbConn.client.close)
      .toHaveBeenCalledTimes(1)
      .toThrow(mErr);
  });

  it("first & second calls to dbConn.getDb() without error", async () => {
    const dbConn = new DbConn();
    const dbInstance = { databaseName: "someDb" };
    jest.spyOn(dbConn.client, "db").mockImplementation(() => dbInstance);

    const db1 = await dbConn.getDb();
    const db2 = await dbConn.getDb();

    expect(db1)
      .toBe(db2)
      .toBe(dbInstance);
    expect(dbConn.client.connect).toHaveBeenCalledTimes(1);
    expect(dbConn.client.db).toHaveBeenCalledTimes(1);
  });

  it("first calls to dbConn.getDb() with error", async () => {
    expect.assertions(5);

    const mErr = Error("MongoDb error");
    const dbConn = new DbConn();
    jest.spyOn(dbConn.client, "connect").mockImplementation(() => {
      throw mErr;
    });

    let db1;

    try {
      db1 = await dbConn.getDb();
    } catch (e) {
      // eslint-disable-next-line jest/no-try-expect
      expect(e.message).toBe(
        "Connection with MongoDb not has been established: MongoDb error"
      );
    }

    expect(db1).not.toBeDefined();
    expect(dbConn.client.connect)
      .toHaveBeenCalledTimes(1)
      .toThrow(mErr);
    expect(dbConn.client.db).toHaveBeenCalledTimes(0);
  });
});
