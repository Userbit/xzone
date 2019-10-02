
const initCli = () => {
    const cli = require('./cli')
    cli.argv = cli.argv
        // provide a minimum demand and a minimum demand message
        .demandCommand(1, 'You need at least one command before moving on')
        .help()
        .argv

    return cli
}

const start = async (cli) => {
    if (cli.isData(cli.argv._[0])) {
        // Start processing of data
        return await require('./forData/process').init(cli)
    } else if (cli.isImg(cli.argv._[0])) {
        // Start processing of images
        return await require('./forImg/process').init(cli)
    }
}

module.exports = { 
    start, 
    initCli,
}


if (!module.parent)
    start(initCli())
