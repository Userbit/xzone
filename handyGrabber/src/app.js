import config from "../../config.js";
import cli from "./cli.js";
import util from "./util.js";
import processImg from "./forImg/process.js";
import processData from "./forData/process.js";

// Perform validation
config.validate({ allowed: "strict" });

const initCli = () => {
  cli.argv = cli.argv
    // provide a minimum demand and a minimum demand message
    .demandCommand(1, "You need at least one command before moving on")
    .help().argv;

  return cli;
};

const start = async (initedCli) => {
  if (initedCli.isData(initedCli.argv._[0])) {
    // Start processing of data
    await processData.init(initedCli);
  }

  if (initedCli.isImg(initedCli.argv._[0])) {
    // Start processing of images
    await processImg.init(initedCli);
  }
};

export default {
  start,
  initCli,
};

if (process.argv[1] === util().thisFile) {
  // Only run in real CLI invoking, not in tests.
  const initedCli = initCli();
  start(initedCli);
}
