import cli from "../src/cli";

// Initialize parser using the command module
const parser = cli.argv.help();

describe("testing cli.js:", () => {
  it("cli.js should be required", () => {
    expect(cli).toBeObject();
  });

  it("output of 'cli.js --help' should be correct", async () => {
    await new Promise((resolve) => {
      // Run the command module with --help as argument
      parser.parse("--help", (err, argv, output) => {
        // Verify the output is correct
        expect(output)
          .toMatch("[aliases: getdata, data, d]")
          .toMatch("[aliases: getimage, getimg, image, img, i]");

        resolve();
      });
    });
  });

  it("output of 'cli.js data --help' for data command should be correct", async () => {
    cli.dataAliases.forEach(async (alias) => {
      // Run the command module with --help as argument
      await new Promise((resolve) => {
        parser.parse(`${alias} --help`, (err, argv, output) => {
          // Verify the output is correct
          expect(output)
            .toMatch("--entity, -e")
            .toMatch('[required] [choices: "movie", "torrent"]')
            .toMatch("--stage, -s")
            .toMatch('[required] [choices: "first", "upsert", "check"]')
            .toMatch("--log, -l")
            .toMatch("[required] [choices: 0, 1]");

          resolve();
        });
      });
    });
  });

  it("output of 'cli.js img --help' for img command should be correct", async () => {
    cli.imgAliases.forEach(async (alias) => {
      // Run the command module with --help as argument
      await new Promise((resolve) => {
        parser.parse(`${alias} --help`, (err, argv, output) => {
          // Verify the output is correct
          expect(output)
            .toMatch("--stage, -s")
            .toMatch('[required] [choices: "first", "upsert", "check"]')
            .toMatch("--log, -l")
            .toMatch("[required] [choices: 0, 1]");

          resolve();
        });
      });
    });
  });

  it("isData() should return true, when correct command", () => {
    const cmds = ["getdata", "data", "d"];
    cmds.forEach((cmd) => {
      expect(cli.isData(cmd)).toBe(true);
    });
  });

  it("isData() should return false, when incorrect command", () => {
    const cmds = ["fake", "", "f", null, undefined, 0];
    cmds.forEach((cmd) => {
      expect(cli.isData(cmd)).toBe(false);
    });
  });

  it("isImg() should return true, when correct command", () => {
    const cmds = ["getimage", "getimg", "image", "img", "i"];
    cmds.forEach((cmd) => {
      expect(cli.isImg(cmd)).toBe(true);
    });
  });

  it("isImg() should return false, when incorrect command", () => {
    const cmds = ["fake", "", "f", null, undefined, 0];
    cmds.forEach((cmd) => {
      expect(cli.isImg(cmd)).toBe(false);
    });
  });
});
