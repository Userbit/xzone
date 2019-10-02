
jest.mock('../src/cli', () => {
    return {
        argv: {
            help: jest.fn(() => {})
        }
    }
})

const cli = require('../src/cli')
const app = require('../src/app')

const forDataModule = '../src/forData/process'
const forImgModule = '../src/forImg/process'

describe('testing app.js', () => {
    test('app.js should be imported', () => {
        expect(app).toBeObject()
    })

    test(`start() should require "${forDataModule}"`, async () => {
        cli.isData = jest.fn(() => true)
        cli.argv = { _: ['data'] }
        jest.mock(forDataModule, () => {
            return {
                init: jest.fn().mockResolvedValue(42)
            }
        })
        const process = require(forDataModule) 

        expect(app.start(cli)).resolves.toBe(42)
        expect(cli.isData).toBeCalledWith('data')
    })

    test(`start() should require "${forImgModule}"`, () => {
        cli.isData = jest.fn(() => false)
        cli.isImg = jest.fn(() => true)
        cli.argv = { _: ['img'] }
        jest.mock(forImgModule, () => {
            return {
                init: jest.fn().mockResolvedValue(42)
            }
        })
        const process = require(forImgModule)

        expect(app.start(cli)).resolves.toBe(42)
        expect(cli.isData).toBeCalledWith('img')
        expect(cli.isImg).toBeCalledWith('img')
    })
})