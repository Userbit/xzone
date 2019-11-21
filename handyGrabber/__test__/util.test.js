import debug from "debug";
import childProcess from "child_process";
import path from "path";
import util from "../src/util.js";

jest.mock("debug");
jest.mock("child_process");

const packageName = "xzone";
const thisFileName = "handyGrabber/__test__/util.test.js";

describe("testing util.js", () => {
  it("util.js should be required", () => {
    expect(util).toBeFunction();
  });

  it("util() should return object", () => {
    expect(util()).toBeObject();
  });

  it("getNamespace should return correct string", () => {
    const filename = `/home/user/${packageName}/handyGrabber/src/cli.js`;
    const moduleMock = { filename };

    expect(util().getNamespace(moduleMock, `/${packageName}/`)).toBe("handyGrabber/src/cli.js");
  });

  it("debug should be called", () => {
    expect(debug).toHaveBeenCalledWith(`${thisFileName}:`);
  });

  it("util.sleep should run correctly", () => {
    util().sleep(0.1);

    expect(childProcess.execSync).toHaveBeenCalledWith("sleep 0.1");
  });

  it("util.getObjectForKeys() should run correctly for existing keys", () => {
    const keys = ["a", "k", "z"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util().getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });

  it("util.getObjectForKeys() should run correctly for not existing keys", () => {
    const keys = ["a", "AA", "k", "z", "BB"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util().getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });

  it("util.getStackFrameInfo(1) should return object.filename is equal to this test file name", () => {
    const thisModule = util().getStackFrameInfo(1);
    const realFileName = util().getNamespace(thisModule, `/${packageName}/`);

    expect(realFileName).toBe(thisFileName);
  });

  it(`util.getPackageName() should return '${packageName}'`, () => {
    const realPackageName = util().getPackageName();

    expect(realPackageName).toBe(packageName);
  });

  it(`util.getRootDir() should return '/${packageName}/'`, () => {
    const rootDir = util().getRootDir();

    expect(rootDir).toBe(`/${packageName}/`);
  });

  it("util.getPath(url) should return absolute path if Url was passed", () => {
    const expectedPath = "/home/path/to/file.js";
    const realPath = util().getPath(`file://${expectedPath}`);

    expect(path.isAbsolute(realPath)).toBeTrue();
    expect(realPath).toBe(expectedPath);
  });

  it("util.getPath(path) should return the same absolute path if Path was passed", () => {
    const expectedPath = "/home/path/to/file.js";
    const realPath = util().getPath(expectedPath);

    expect(path.isAbsolute(realPath)).toBeTrue();
    expect(realPath).toBe(expectedPath);
  });
});
