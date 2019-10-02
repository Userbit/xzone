
// jest.mock('../../src/db.js')

const {MongoClient} = require('mongodb');
const dbModule = require('../../src/forData/dbModel')

let entity = 'movie'
let db = null


describe('testing init(), close(), checkEntity() methods', () => {

    beforeEach(async () => {
        db = await dbModule.init(entity)
    })

    afterEach(async () => {
        await db.close()
        db = null
    })

    test('forData/dbModel.js should be required', () => {
        expect(dbModule).toBeObject()
    })

    test('dbModule.init() should work correctly', async () => {
        const spy = jest.spyOn(dbModule, 'checkEntity')
        db = await dbModule.init(entity)

        expect(spy).toBeCalledWith(entity)
        expect(db).toContainKeys(['db', 'dbConn', 'docs', 'log'])
    })

    test('dbModule.init() should return the same object when called once more', async () => {
        let db2 = await dbModule.init(entity)
        expect(db2).toBe(db)
    })

    test('dbModule.checkEntity() should throw error without arg', async () => {
        try {
            await dbModule.checkEntity()
        } catch(e) {
            expect(e.message).toBe('"entity" argurment should be `movie` or `torrent`.')
        }
    })

    test('dbModule.checkEntity() should throw error with incorrect arg', async () => {
        try {
            await dbModule.checkEntity('some')
        } catch(e) {
            expect(e.message).toBe('"entity" argurment should be `movie` or `torrent`.')
        }
    })

    test('dbModule.close() should work correctly', async () => {
        const spy = jest.spyOn(db.dbConn, 'close')
        db.close()

        expect(spy).toBeCalled()
    })

})

describe('testing createIndex()', () => {

    afterEach(async () => {
        await db.close()
        db = null
    })

    test('dbModule.createIndex("torrent") should work correctly', async () => {
        entity = 'torrent'
        db = await dbModule.init(entity)
        db.createIndex()
        const indexes = await db.docs.indexes()
        const expectedIndexes = [
            expect.objectContaining({ "key": { "_id": 1 } }),
            expect.objectContaining({ "background": true, "key": { "deleted": -1 } }),
        ]

        expect(indexes)
            .toMatchObject(expect.arrayContaining(expectedIndexes))
    })

    test('dbModule.createIndex("movie") should work correctly', async () => {
        entity = 'movie'
        db = await dbModule.init(entity)
        db.createIndex()
        const indexes = await db.docs.indexes()
        const expectedIndexes = [
            expect.objectContaining({ "key": { "_id": 1 } }),
        ]

        expect(indexes)
            .toMatchObject(expect.arrayContaining(expectedIndexes))
    })

    test('dbModule.createIndex("movie") should throw error when something occur', async () => {
        entity = 'movie'
        db = await dbModule.init(entity)
        db.docs.createIndex = jest.fn().mockRejectedValue(Error('some error occur'))

        expect(db.createIndex()).rejects.toThrow('some error occur')
    })
})