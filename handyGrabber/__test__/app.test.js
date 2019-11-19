import cli from "../src/cli.js";
import app from "../src/app.js";
import processData from "../src/forData/process.js";
import processImg from "../src/forImg/process.js";

describe("testing app.js", () => {
  it("app.js should be imported", () => {
    expect(app).toBeObject();
  });

  it(`app.start() should call processData.init(cli) if isData() is true`, async () => {
    jest.spyOn(cli, "isData").mockImplementation(() => true);
    jest.spyOn(processData, "init").mockImplementation(() => 42);
    cli.argv = { _: ["data"] };

    await app.start(cli);

    expect(processData.init).toHaveBeenCalledWith(cli);
    expect(cli.isData).toHaveBeenCalledWith("data");
  });

  it(`app.start() should call processImg.init(cli) if isImg() is true`, async () => {
    jest.spyOn(cli, "isData").mockImplementation(() => false);
    jest.spyOn(cli, "isImg").mockImplementation(() => true);
    jest.spyOn(processImg, "init").mockImplementation(() => 42);
    cli.argv = { _: ["img"] };

    await app.start(cli);

    expect(cli.isData).toHaveBeenCalledWith("img");
    expect(cli.isImg).toHaveBeenCalledWith("img");
    expect(processImg.init).toHaveBeenCalledWith(cli);
  });
});
