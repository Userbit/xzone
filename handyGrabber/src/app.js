const cli = require("./cli");
const processData = require("./forData/process");
const processImg = require("./forImg/process");

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

module.exports = {
  start,
  initCli,
};

if (!module.parent) {
  // Only run in real CLI invoking, not in tests.
  const initedCli = initCli();
  start(initedCli);
}
