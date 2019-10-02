
jest.mock('debug')

const debug = require('debug')
const util = require('../src/util')(module)

describe('testing util.js', () => {
    test('util.js should be required', () => {
        expect(util).toBeTruthy()
    })

    test('util object should contain necessarily some keys', () => {
        expect(util).toContainAllKeys(
            [
                'getNamespace',
                'debug',
                'sleep',
            ]
        )
    })

    test('getNamespace should return correct string', () => {
        const filename = '/home/userbit/c/Learn/Javascript/practice/xzone/handyGrabber/src/cli.js'
        const moduleMock = { filename }

        expect(util.getNamespace(moduleMock, 'xzone')).toBe('xzone/handyGrabber/src/cli.js:')
    })

    test('debug should be called', () => {
        expect(debug).toHaveBeenCalledWith('xzone/handyGrabber/__test__/util.test.js:')
    })

    test('util.sleep should run correctly', () => {
        jest.mock('child_process')
        const child_process = require("child_process");
        util.sleep(0.1)
        expect(child_process.execSync).toBeCalledWith('sleep 0.1')

    })
})
