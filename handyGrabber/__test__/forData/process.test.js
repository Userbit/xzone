import proc from "../../src/forData/process.js";
import log from "../../src/forData/log.js";
import req from "../../src/forData/request.js";
import dbModel from "../../src/forData/dbModel.js";

const stages = ["first", "upsert", "check"];
const entities = ["movie", "torrent"];

describe("testing forData/process.js", () => {
  it(".../process.js should be required", () => {
    expect(proc).toBeObject();
  });

  it("init() method should run correctly", async () => {
    const cliMock = { argv: { entity: "movie" } };
    const dbMock = {
      createIndex: jest.fn().mockResolvedValue({}),
    };
    jest.spyOn(dbModel, "init").mockResolvedValue(dbMock);
    jest.spyOn(proc, "run").mockResolvedValue({});

    await proc.init(cliMock);

    expect(dbModel.init).toHaveBeenCalledWith(cliMock.argv.entity);
    expect(dbMock.createIndex).toHaveBeenCalledTimes(1);
    expect(proc.run).toHaveBeenCalledWith(cliMock);
  });

  it("end() should call this.db.close", async () => {
    const dbReal = proc.db;
    proc.db = { close: jest.fn().mockResolvedValue({}) };

    await proc.end();

    expect(proc.db.close).toHaveBeenCalledTimes(1);

    proc.db = dbReal;
  });

  it.each(entities)("run() should call runEntity:%s() and end() methods", async (entity) => {
    const state = { entity, stage: "some stage", log: 1 };
    const cliMock = { argv: { ...state, trash: "trash" } };
    const runEntity = `runEntity:${entity}`;
    jest.spyOn(proc, runEntity).mockResolvedValue({});
    jest.spyOn(proc, "end").mockResolvedValue({});

    await proc.run(cliMock);

    expect(proc[runEntity])
      .toHaveBeenCalledTimes(1)
      .toBeCalledWith(state);
    expect(proc.end).toHaveBeenCalledTimes(1);
  });

  it("runEntity:movie() should call runStage() method one time", async () => {
    const state = { stage: "some stage", entity: "movie", log: 1 };
    jest.spyOn(proc, "runStage").mockResolvedValue({});

    await proc["runEntity:movie"](state);

    expect(proc.runStage)
      .toHaveBeenCalledTimes(1)
      .toBeCalledWith(state);
  });

  it("runEntity:torrent() should call runStage() method TWO times", async () => {
    const state = { stage: "some stage", entity: "movie", log: 1 };
    jest.spyOn(proc, "runStage").mockResolvedValue({});

    await proc["runEntity:torrent"](state);

    expect(proc.runStage)
      .toHaveBeenCalledTimes(2)
      .nthCalledWith(1, { ...state, deleted: true })
      .nthCalledWith(2, { ...state, deleted: false });

    jest.restoreAllMocks();
  });

  it.each(stages)(
    "runStage() should call initSubModules(), runStage:%s() methods",
    async (stage) => {
      const state = { stage, entity: "some entity", log: 1 };
      const runStageForStage = `runStage:${stage}`;
      jest.spyOn(proc, runStageForStage).mockResolvedValue({});
      jest.spyOn(proc, "initSubModules").mockResolvedValue({});

      await proc.runStage(state);

      expect(proc[runStageForStage])
        .toHaveBeenCalledTimes(1)
        .toBeCalledWith(state);
      expect(proc.initSubModules)
        .toHaveBeenCalledTimes(1)
        .toBeCalledWith(state);
    }
  );

  it("initSubModules() should call log.init(), req.init() methods", async () => {
    const state = {
      stage: "some stage",
      entity: "some entity",
      log: 1,
      deleted: true,
    };
    jest.spyOn(req, "init").mockResolvedValue({});
    jest.spyOn(log, "init").mockResolvedValue({});

    await proc.initSubModules(state);

    expect(log.init)
      .toHaveBeenCalledTimes(1)
      .toBeCalledWith(state);
    expect(req.init)
      .toHaveBeenCalledTimes(1)
      .toBeCalledWith(state);
  });
});
