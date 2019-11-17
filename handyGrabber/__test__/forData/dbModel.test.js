const dbModule = require("../../src/forData/dbModel");

let entity = "movie";

describe("testing init(), close(), checkEntity() methods", () => {
  it("forData/dbModel.js should be required", () => {
    expect(dbModule).toBeObject();
  });

  it("dbModule.init() should work correctly", async () => {
    const spy = jest.spyOn(dbModule, "checkEntity");

    const db = await dbModule.init(entity);

    expect(spy).toHaveBeenCalledWith(entity);
    expect(db).toContainKeys(["db", "dbConn", "docs", "log"]);

    await db.close();
  });

  it("dbModule.init() should return the same object when called once more", async () => {
    const db = await dbModule.init(entity);
    const db2 = await dbModule.init(entity);

    expect(db2).toBe(db);

    await db.close();
  });

  it("dbModule.checkEntity() should throw error without arg", async () => {
    expect(() => {
      dbModule.checkEntity();
    }).toThrow("'entity' argurment should be 'movie' or 'torrent'.");
  });

  it("dbModule.checkEntity() should throw error with incorrect arg", async () => {
    expect(() => {
      dbModule.checkEntity("some");
    }).toThrow("'entity' argurment should be 'movie' or 'torrent'.");
  });

  it("dbModule.close() should work correctly", async () => {
    const db = await dbModule.init(entity);
    const spy = jest.spyOn(db.dbConn, "close");

    await db.close();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("testing createIndex()", () => {
  it('dbModule.createIndex("torrent") should work correctly', async () => {
    entity = "torrent";
    const expectedIndexes = [
      expect.objectContaining({ key: { _id: 1 } }),
      expect.objectContaining({ background: true, key: { deleted: -1 } }),
    ];

    const db = await dbModule.init(entity);
    db.createIndex();
    const indexes = await db.docs.indexes();

    expect(indexes).toMatchObject(expect.arrayContaining(expectedIndexes));

    await db.close();
  });

  it('dbModule.createIndex("movie") should work correctly', async () => {
    entity = "movie";
    const expectedIndexes = [expect.objectContaining({ key: { _id: 1 } })];

    const db = await dbModule.init(entity);
    db.createIndex();
    const indexes = await db.docs.indexes();

    expect(indexes).toMatchObject(expect.arrayContaining(expectedIndexes));

    await db.close();
  });

  it('dbModule.createIndex("movie") should throw error when something occur', async () => {
    entity = "movie";
    const db = await dbModule.init(entity);
    jest
      .spyOn(db.docs, "createIndex")
      .mockImplementation()
      .mockRejectedValue(Error("some error occur"));

    await expect(db.createIndex()).rejects.toThrow("some error occur");

    await db.close();
  });
});
