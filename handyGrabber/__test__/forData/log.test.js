const log = require("../../src/forData/log");

describe("testing forData/log.js", () => {
  it("log.js should be required", () => {
    expect(log).toBeObject();
  });

  it.each([{ entity: "movie" }, { entity: "torrent", deleted: true }])(
    "init(%o) should setup log.state property and call switchFuncsOnce()",
    (obj) => {
      const state = { stage: "some stage", ...obj, log: 0 };
      jest.spyOn(log, "switchFuncsOnce").mockImplementationOnce(() => {});

      log.init(state);

      expect(log.state).toStrictEqual({
        stage: state.stage,
        ...obj,
        logStart: expect.toBeDate(),
      });
      expect(log.switchFuncsOnce)
        .toHaveBeenCalledTimes(1)
        .toBeCalledWith(state);
    }
  );

  it.each([1, 0])(
    `switchFuncsOnce() should [A/De][%i]ctivate a few funcs 
            depending on state.log and become log.emptyFunc()`,
    (flag) => {
      const state = { log: flag };
      const realFunc = log.switchFuncsOnce;

      log.switchFuncsOnce(state);

      expect(log.switchFuncsOnce)
        .toBeFunction()
        .toBe(log.emptyFunc);

      Object.entries(log.switchedFuncs).forEach(([funcName, func]) => {
        expect(log[funcName])
          .toBeFunction()
          .toBe(state.log ? func : log.emptyAsyncFunc);

        delete log[funcName];
      });

      log.switchFuncsOnce = realFunc;
    }
  );

  it(`switchFuncsOnce() should throw error 
            when already exist any method name from log.switchedFuncs on main object`, () => {
    const state = { log: 1 };
    log.switchedFuncs.init = function emptyFunc() {};

    expect(() => log.switchFuncsOnce(state)).toThrow(
      "'init' property already exist on main object."
    );

    delete log.switchedFuncs.init;
  });
});
