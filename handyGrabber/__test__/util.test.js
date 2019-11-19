import debug from "debug";
import childProcess from "child_process";
import util from "../src/util";

jest.mock("debug");
jest.mock("child_process");

describe("testing util.js", () => {
  it("util.js should be required", () => {
    expect(util).toBeFunction();
  });

  it("require('path/to/util')(module) should throw error without Module object", () => {
    const errMsg = "require('path/to/util')(module) should be passed Module object of caller";

    expect(() => util()).toThrow(errMsg);
    expect(() => util({})).toThrow(errMsg);
  });

  it('require("path/to/util")(module) should not throw error whith Module object', () => {
    expect(() => util(module)).not.toThrow();
  });

  it("getNamespace should return correct string", () => {
    const filename = "/home/userbit/c/Learn/Javascript/practice/xzone/handyGrabber/src/cli.js";
    const moduleMock = { filename };

    expect(util(module).getNamespace(moduleMock, "xzone")).toBe("xzone/handyGrabber/src/cli.js:");
  });

  it("debug should be called", () => {
    expect(debug).toHaveBeenCalledWith("xzone/handyGrabber/__test__/util.test.js:");
  });

  it("util.sleep should run correctly", () => {
    util(module).sleep(0.1);

    expect(childProcess.execSync).toHaveBeenCalledWith("sleep 0.1");
  });

  it("util.getObjectForKeys() should run correctly for existing keys", () => {
    const keys = ["a", "k", "z"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util(module).getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });

  it("util.getObjectForKeys() should run correctly for not existing keys", () => {
    const keys = ["a", "AA", "k", "z", "BB"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util(module).getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });
});
