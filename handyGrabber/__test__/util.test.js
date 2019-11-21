import debug from "debug";
import childProcess from "child_process";
import util from "../src/util.js";

jest.mock("debug");
jest.mock("child_process");

const packageName = "xzone";
const thisFileName = "handyGrabber/__test__/util.test.js";

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
    const filename = `/home/user/${packageName}/handyGrabber/src/cli.js`;
    const moduleMock = { filename };

    expect(util(module).getNamespace(moduleMock, `/${packageName}/`)).toBe(
      "handyGrabber/src/cli.js"
    );
  });

  it("debug should be called", () => {
    expect(debug).toHaveBeenCalledWith(`${thisFileName}:`);
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

  it("util.getStackFrameInfo(1) should return object.filename is equal to this test file name", () => {
    const thisModule = util(module).getStackFrameInfo(1);
    const realFileName = util(module).getNamespace(thisModule, `/${packageName}/`);

    expect(realFileName).toBe(thisFileName);
  });

  it(`util.getPackageName() should return '${packageName}'`, () => {
    const realPackageName = util(module).getPackageName();

    expect(realPackageName).toBe(packageName);
  });

  it(`util.getRootDir() should return '/${packageName}/'`, () => {
    const rootDir = util(module).getRootDir();

    expect(rootDir).toBe(`/${packageName}/`);
  });
});
