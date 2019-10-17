
jest.mock('debug')

const debug = require('debug')
const util = require('../src/util')(module)

describe('testing util.js', () => {
    test('util.js should be required', () => {
        expect(util).toBeTruthy()
    })

    test('require("path/to/util")(module) should throw error without Module object', () => {
       expect(() => require('../src/util')()).toThrow()
       expect(() => require('../src/util')({})).toThrow()
    })

    test('require("path/to/util")(module) should not throw error whith Module object', () => {
       expect(() => require('../src/util')(module)).not.toThrow()
    })

    xtest('util object should contain necessarily some keys', () => {
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

    test('util.getObjectForKeys() should run correctly', () => {
        const keys = ['a', 'k', 'z']
        const fromObject = { a: 1, b: 2, k: 3, c: 4, z: 5, m: 6 }
        const expected = { a: 1, k: 3, z: 5 }
        expect(util.getObjectForKeys(keys, fromObject))
            .toStrictEqual(expected)
    })
})