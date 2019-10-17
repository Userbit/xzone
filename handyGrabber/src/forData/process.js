const { debug, sleep, getObjectForKeys } = require('../util')(module)
const dbModel = require('./dbModel')

module.exports = {

    async init(cli) {
        debug('Start forData/process.js')

        this.db = await dbModel.init(cli.argv.entity)
        await this.db.createIndex()

        sleep(10)
        await this.run(cli)

    },

    async run(cli) {
        debug('Running...')

        // Get cleaned state from cli.argv out of specified keys for the sake of clarity
        let state = getObjectForKeys(['stage', 'entity', 'log'], cli.argv)
        const runStage = 'runStage:' + state.stage

        switch(state.entity) {
            case 'movie':
                await this[runStage](state)
                break

            case 'torrent':
                state = { ...state, deleted: true }
                await this[runStage](state)

                state = { ...state, deleted: false }
                await this[runStage](state)

                break
        }

        await this.end()
    },

    async end() {
        debug('Ending...')
        await this.db.close()
    },

    'runStage:first': async function(state) {
        debug('runStage:first(%o)...', state)
    }, 

    'runStage:upsert': async function(state) {
        debug('runStage:upsert(%o)...', state)
    }, 

    'runStage:check': async function(state) {
        debug('runStage:check(%o)...', state)
    }, 
}
