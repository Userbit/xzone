
const proc = require('../../src/forData/process')
const dbModelPath = '../../src/forData/dbModel';
const dbModel = require(dbModelPath)

const stages = ['first', 'upsert', 'check']

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
        expect(proc.run).toBeCalledWith(cliMock)
    })

    test('end() should call this.db.close', async () => {
        const dbReal = proc.db
        proc.db = { close: jest.fn().mockResolvedValue({}) }

        await proc.end()

        expect(proc.db.close).toBeCalledTimes(1)

        proc.db = dbReal
    })

    test('run() should call runStage:first|upsert|check method one time when entity==movie', async () => {
        for (let stage of stages) {
            const runStage = 'runStage:' + stage
            const state = { stage, entity: 'movie', log: 1 }
            const cliMock = { argv: { ...state, trash: 'trash' } }
            jest.spyOn(proc, runStage).mockResolvedValue({})
            jest.spyOn(proc, 'end').mockResolvedValue({})

            await proc.run(cliMock)

            expect(proc[runStage])
                .toBeCalledTimes(1)
                .toBeCalledWith(state)
            expect(proc.end).toBeCalledTimes(1)

            jest.restoreAllMocks()
        }
    })

    test('run() should call runStage:first|upsert|check method Two times when entity==torrent', async () => {
        for (let stage of stages) {
            const runStage = 'runStage:' + stage
            const state = { stage, entity: 'torrent', log: 0 }
            const cliMock = { argv: { ...state, trash: 'trash' } }
            jest.spyOn(proc, runStage).mockResolvedValue({})
            jest.spyOn(proc, 'end').mockResolvedValue({})

            await proc.run(cliMock)

            expect(proc[runStage])
                .toBeCalledTimes(2)
                .nthCalledWith(1, { ...state, deleted: true })
                .nthCalledWith(2, { ...state, deleted: false })
            expect(proc.end).toBeCalledTimes(1)

            jest.restoreAllMocks()
        }
    })
})