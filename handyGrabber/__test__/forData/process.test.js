
const proc = require('../../src/forData/process')
const dbModelPath = '../../src/forData/dbModel';
const dbModel = require(dbModelPath)

afterEach(() => {
    jest.restoreAllMocks()
})

describe('testing forData/process.js', () => {
    test('.../process.js should be required', () => {
        expect(proc).toBeObject()
    })

    test('init() method should run correctly', async () => {
        const cliMock = { argv: { entity: 'movie' } }
        const dbMock = {
            createIndex: jest.fn().mockResolvedValue({})
        }
        jest.spyOn(dbModel, 'init').mockResolvedValue(dbMock)
        jest.spyOn(proc, 'run').mockResolvedValue({})

        await proc.init(cliMock)

        expect(dbModel.init).toBeCalledWith(cliMock.argv.entity)
        expect(dbMock.createIndex).toBeCalledTimes(1)
        expect(proc.run).toBeCalledWith(cliMock, dbMock)
    })

    test('run() method should ...', async () => {
        expect(true).toBe(true)
    })
})