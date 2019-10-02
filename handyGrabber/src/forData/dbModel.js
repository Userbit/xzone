

const { debug, sleep } = require('../util')(module)
const { DbConn } = require('../db')

let objDb = null

module.exports = {
    async init(entity) {
        this.checkEntity(entity)
        this.entity = entity

        if (objDb) return objDb
        objDb = this

        this.dbConn = new DbConn()
        this.db = await this.dbConn.getDb()
        this.docs = this.db.collection(entity)
        this.log = this.db.collection('log')
        debug("Connected successfully to MongoDb.");

        return this
    },

    checkEntity(entity) {
        if (!['movie', 'torrent'].includes(entity))
            throw Error('"entity" argurment should be `movie` or `torrent`.')
    },

    async close() {
        await this.dbConn.close();
        objDb = null;
        debug("Connection to MongoDb successfully closed.");
    },

    async createIndex() {
        let indexSpecs, options = { background: true, }

        switch (this.entity) {
            case 'torrent':
                indexSpecs = [
                    { 'deleted': -1 },
                    { "_id": 1 },
                ]
                break
            case 'movie':
                indexSpecs = [
                    { "_id": 1 }, 
                ]
                break
        }

        // if (!indexSpecs) return null

        try {
            for (let indexSpec of indexSpecs) {
                const opts = indexSpec._id ? {} : options;
                const res = await this.docs.createIndex(indexSpec, opts)
                debug('Result of creating index:', res)
            }
        } catch (err) {
            throw err
        }
    },
}