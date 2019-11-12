const cli = require('./cli');

const initCli = () => {
  cli.argv = cli.argv
    // provide a minimum demand and a minimum demand message
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;

  return cli;
};

// eslint-disable-next-line consistent-return
const start = async (initedCli) => {
  if (initedCli.isData(initedCli.argv._[0])) {
    // Start processing of data
    // eslint-disable-next-line global-require
    return require('./forData/process').init(initedCli);
  }

  if (initedCli.isImg(initedCli.argv._[0])) {
    // Start processing of images
    // eslint-disable-next-line global-require
    return require('./forImg/process').init(initedCli);
  }
};

module.exports = {
  start,
  initCli,
};


if (!module.parent) {
  start(initCli());
}
