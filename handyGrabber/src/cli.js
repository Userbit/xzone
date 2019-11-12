const yargs = require('yargs');
const { debug } = require('./util')(module);

const STAGES = {
  first: 'first',
  upsert: 'upsert',
  check: 'check',
};

const dataAliases = ['getdata', 'data', 'd'];
const imgAliases = ['getimage', 'getimg', 'image', 'img', 'i'];

const dataCommand = {
  command: dataAliases[0],
  aliases: dataAliases,
  desc: 'Get data for "movie" or "torrent"',
  builder: (yargs_) => yargs_.options({
    entity: {
      alias: 'e',
      describe: `Entitiy for processing:
                'movie' - Process movies
                'torrent' - Process torrents
                `,
      choices: ['movie', 'torrent'],
      demandOption: true,
    },
    stage: {
      alias: 's',
      describe: `Stage of the run:
                'first' - First insert into Db
                'upsert' - Update and insert new docs in a while
                'check' - Check likely missing any docs
                `,
      choices: [...Object.values(STAGES)],
      demandOption: true,
    },
    log: {
      alias: 'l',
      describe: `Log into Db:
                '1' - Yes
                '0' - No
                `,
      choices: [0, 1],
      demandOption: true,
    },
  }),
  /*
    handler: (argv) => {
      //console.log(`setting ${argv.key} to ${argv.value}`)
    }
    */
};

const imgCommand = {
  command: imgAliases[0],
  aliases: imgAliases,
  desc: 'Get images for movies',
  builder: (yargs_) => yargs_.options({
    stage: {
      alias: 's',
      describe: `Stage of the run:
                'first' - First insert into Db
                'upsert' - Update and insert new docs in a while
                'check' - Check likely missing any docs
                `,
      choices: [...Object.values(STAGES)],
      demandOption: true,
    },
    log: {
      alias: 'l',
      describe: `Log into Db:
                '1' - Yes
                '0' - No
                `,
      choices: [0, 1],
      demandOption: true,
    },
  }),
  /*
    handler: (argv) => {
      console.log(`setting ${argv.key} to ${argv.value}`)
    }
    // */
};


const argv = yargs
  .command(dataCommand)
  .command(imgCommand);
// provide a minimum demand and a minimum demand message
// .demandCommand(1, 'You need at least one command before moving on')
// .help()
// .argv


module.exports = {
  argv,
  dataAliases,
  imgAliases,
  dataCommand,
  imgCommand,
  STAGES,
  isData(cmd) {
    return dataAliases.includes(cmd);
  },
  isImg(cmd) {
    return imgAliases.includes(cmd);
  },
};

debug('argv = %o', argv.argv);
