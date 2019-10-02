
jest.mock('mongodb')

const { DbConn } = require('../src/db')
const MongoClient = require('mongodb').MongoClient

const opts = { useNewUrlParser: true }
const keysOfClient = ['close', 'connect', 'db']
let mErr, dbConn;
let dbName = 'handyData';

describe('testing db.js', () => {
    beforeEach(() => {
        dbConn = new DbConn()
        mErr = Error('MongoDb error')
    })

    test('db.js should be required', () => {
        expect(DbConn).toBeTruthy()
    })

    test('new DbConn() without args', () => {
        const url = 'mongodb://localhost:27017/' + dbName

        expect(MongoClient).toHaveBeenCalledWith(url, opts)
        expect(dbConn.url).toBe(url)
        expect(dbConn.client).toContainKeys(keysOfClient)
    })

    test('new DbConn() with args', () => {
        let url = 'mongodb://localhost:27018';
        let dbn = dbName + '2'
        dbConn = new DbConn(url, dbn)
        url = url + '/' + dbn

        expect(MongoClient).toHaveBeenCalledWith(url, opts)
        expect(dbConn.url).toBe(url)
        expect(dbConn.client).toContainKeys(keysOfClient)
    })

    test('dbConn.close() without error', async () => {
        await dbConn.close()
        
        expect(dbConn.client.close).toBeCalledTimes(1)
    })

    test('dbConn.close() with error', async () => {
        dbConn.client.close = jest.fn(() => { throw mErr })

        try {
            await dbConn.close()
        } catch(e) {
            expect(e.message).toBe('Error occurred when closing connection: MongoDb error')
            expect(dbConn.client.close)
                .toBeCalledTimes(1)
                .toThrow(mErr)
        }
    })

    test('first & second calls to dbConn.getDb() without error', async () => {
        const dbInstance = { databaseName: 'someDb'}
        dbConn.client.db = jest.fn(() => dbInstance)
        const db1 = await dbConn.getDb()
        const db2 = await dbConn.getDb()

        expect(db1).toBe(db2).toBe(dbInstance)
        expect(dbConn.client.connect).toBeCalledTimes(1)
        expect(dbConn.client.db).toBeCalledTimes(1)
    })

    test('first calls to dbConn.getDb() with error', async () => {
        dbConn.client.connect = jest.fn(() => { throw mErr })
        let db1

        try {
            db1 = await dbConn.getDb()
        } catch (e) {
            expect(e.message).toBe('Connection with MongoDb not has been established: MongoDb error')
            expect(db1).not.toBeDefined()
            expect(dbConn.client.connect)
                .toBeCalledTimes(1)
                .toThrow(mErr)
            expect(dbConn.client.db).toBeCalledTimes(0)
        }
    })
})