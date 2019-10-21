const log = require('../../src/forData/log')


afterEach(() => {
    jest.restoreAllMocks()
})

describe('testing forData/log.js', () => {
    it('log.js should be required', () => {
        expect(log).toBeObject()
    })
    
    it('init() should setup log.state and call switchFuncsOnce()', () => {
        for (let obj of [{ entity: 'movie' }, { entity: 'torrent', deleted: true }]) {
            const state = { stage: 'some stage', ...obj, log: 0 }
            jest.spyOn(log, 'switchFuncsOnce').mockImplementationOnce(() => { })

            log.init(state)

            expect(log.state).toStrictEqual({
                stage: state.stage,
                ...obj,
                logStart: expect.toBeDate()
            })
            expect(log.switchFuncsOnce)
                .toBeCalledTimes(1)
                .toBeCalledWith(state)

            jest.restoreAllMocks()
        }
    })

    it(`switchFuncsOnce() should (A/De)ctivate a few funcs 
            depending on state.log and become emptyFunc()`, () => {
        for (const flag of [0, 1]) {
            const state = { log: flag }
            const realFunc = log.switchFuncsOnce

            log.switchFuncsOnce(state)

            expect(log.switchFuncsOnce).toBeFunction().toBe(log.emptyFunc)
            for (const [funcName, func] of Object.entries(log.switchedFuncs)) {
                expect(log[funcName]).toBeFunction().toBe(
                    state.log ? func : log.emptyAsyncFunc
                )

                delete log[funcName]
            }

            log.switchFuncsOnce = realFunc
        }
    })

    it(`switchFuncsOnce() should throw error 
            when already exist any method name from log.switchedFuncs on main object`, () => {
        const state = { log: 1 }
        log.switchedFuncs.init = function() {}

        expect(() => log.switchFuncsOnce(state)).toThrow()
        
        delete log.switchedFuncs.init
    })

})