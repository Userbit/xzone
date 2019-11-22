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

  it("util() should return object with thisFile property contained this test file 'util.test.js' at the end", () => {
    expect(util().thisFile).toEndWith(thisFileName);
  });

  it("getNamespace should return correct string", () => {
    const filename = `/home/user/${packageName}/handyGrabber/src/cli.js`;
    const moduleMock = { filename };

    expect(util().getNamespace(moduleMock, `/${packageName}/`)).toBe("handyGrabber/src/cli.js");
  });

  it("debug() should be called after util() called", () => {
    util();

    expect(debug).toHaveBeenCalledWith(`${thisFileName}:`);
  });

  it("util.sleep(seconds) should run childProcess.execSync('sleep seconds')", () => {
    util().sleep(0.1);

    expect(childProcess.execSync).toHaveBeenCalledWith("sleep 0.1");
  });

  it("util.getObjectForKeys(keys, from) should return new object with keys for existing keys in passed object", () => {
    const keys = ["a", "k", "z"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util().getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });

  it("util.getObjectForKeys(keys, from) should return new object with only existing keys in passed object", () => {
    const keys = ["a", "AA", "k", "z", "BB"];
    const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 };
    const expected = { a: 1, k: 3, z: 5 };

    const result = util().getObjectForKeys(keys, fromObject);

    expect(result).toStrictEqual(expected);
  });

  it(`util.getPackageName() should return '${packageName}' of package name from main package.json`, () => {
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

  describe("util.getStackFrameInfo", () => {
    it("with arg (1) should return object with filename key is equal to this test file name 'util.test.js'", () => {
      const thisModule = util().getStackFrameInfo(1);

      expect(thisModule.filename).toEndWith(thisFileName);
    });

    it("without arg () by default as (0) should return object with filename key contained 'util.js' file", () => {
      const thisModule = util().getStackFrameInfo();

      expect(thisModule.filename).toEndWith("util.js");
    });

    it("should return object with all specifying keys", () => {
      const thisModule = util().getStackFrameInfo();

      expect(thisModule).toContainAllKeys(["function", "filename", "line", "column"]);
    });
  });
});
