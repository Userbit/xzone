const { debug, sleep } = require('../util')(module)
const dbModel = require('./dbModel')

module.exports = {

    async init(cli) {
        debug('Start forData/process.js')

        const db = await dbModel.init(cli.argv.entity)
        await db.createIndex()

        sleep(10)
        await this.run(cli, db)

    },

    async run(cli, db) {
        debug('Running...')

    },

    async end(cli, db) {
        db.close()
    },
}
