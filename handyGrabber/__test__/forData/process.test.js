
const proc = require('../../src/forData/process')
const dbModelPath = '../../src/forData/dbModel';
const dbModel = require(dbModelPath)

const stages = ['first', 'upsert', 'check']
const entities = ['movie', 'torrent']

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

    test('run() should call runEntity:movie|torrent(), end() methods', async () => {
        for (let entity of entities) {
            const runEntity = 'runEntity:' + entity
            const state = { entity, stage: 'some stage', log: 1 }
            const cliMock = { argv: { ...state, trash: 'trash' } }
            jest.spyOn(proc, runEntity).mockResolvedValue({})
            jest.spyOn(proc, 'end').mockResolvedValue({})

            await proc.run(cliMock)

            expect(proc[runEntity])
                .toBeCalledTimes(1)
                .toBeCalledWith(state)
            expect(proc.end).toBeCalledTimes(1)

            jest.restoreAllMocks()
        }
    })

    test('runEntity:movie() should call runStage() method one time', async () => {
        const state = { stage: 'some stage', entity: 'movie', log: 1 }
        jest.spyOn(proc, 'runStage').mockResolvedValue({})

        await proc['runEntity:movie'](state)

        expect(proc.runStage)
            .toBeCalledTimes(1)
            .toBeCalledWith(state)

        jest.restoreAllMocks()
    })

    test('runEntity:torrent() should call runStage() method TWO times', async () => {
        const state = { stage: 'some stage', entity: 'movie', log: 1 }
        jest.spyOn(proc, 'runStage').mockResolvedValue({})

        await proc['runEntity:torrent'](state)

        expect(proc.runStage)
            .toBeCalledTimes(2)
            .nthCalledWith(1, { ...state, deleted: true })
            .nthCalledWith(2, { ...state, deleted: false })

        jest.restoreAllMocks()
    })

    test('runStage() should call runStage:first|upsert|check method ', async () => {
        for (let stage of stages) {
            const runStage_stage = 'runStage:' + stage
            const state = { stage, entity: 'some entity', log: 1 }
            jest.spyOn(proc, runStage_stage).mockResolvedValue({})

            await proc.runStage(state)

            expect(proc[runStage_stage])
                .toBeCalledTimes(1)
                .toBeCalledWith(state)

            jest.restoreAllMocks()
        }
    })

})