const cli = require('../src/cli')

// Initialize parser using the command module
let parser = cli.argv.help();

describe('testing cli.js:', () => {
    test('cli.js should be required', () => {
        expect(cli).toBeTruthy()
    })

    test('cli.js --help', (done) => {
        // Run the command module with --help as argument
        parser.parse("--help", (err, argv, output) => {
            // Verify the output is correct
            expect(output)
                .toMatch('[aliases: getdata, data, d]')
                .toMatch('[aliases: getimage, getimg, image, img, i]')
            done()
        })
    })

    test.each(cli.dataAliases)('cli.js %s --help', async (alias) => {
        // Run the command module with --help as argument
        await new Promise((resolve) => {
            parser.parse(`${alias} --help`, (err, argv, output) => {
                // Verify the output is correct
                expect(output)
                    .toMatch('--entity, -e')
                    .toMatch('[required] [choices: "movie", "torrent"]')
                    .toMatch('--stage, -s')
                    .toMatch('[required] [choices: "first", "upsert", "check"]')
                    .toMatch('--log, -l')
                    .toMatch('[required] [choices: 0, 1]')
                resolve()
            })
        })
    })

    test.each(cli.imgAliases)('cli.js %s --help', async (alias) => {
        // Run the command module with --help as argument
        await new Promise((resolve) => {
            parser.parse(`${alias} --help`, (err, argv, output) => {
                // Verify the output is correct
                expect(output)
                    .toMatch('--stage, -s')
                    .toMatch('[required] [choices: "first", "upsert", "check"]')
                    .toMatch('--log, -l')
                    .toMatch('[required] [choices: 0, 1]')
                resolve()
            })
        })
    })

    async function clijsMatcher(cmd, expectedArgv) {
        // Run the command module with --help as argument
        await new Promise((resolve) => {
            parser.parse(cmd, (err, argv, output) => {
                // Verify the output is correct
                expect(argv).toMatchObject(expectedArgv)
                resolve()
            })
        })        
    }

    // ~ 10 seconds for running this test
    xtest('cli.js getdata -e [] -s [] -l []', async () => {
        for (let command of cli.dataAliases) {
            for (let entity of ['--entity', '-e']) {
                for (let entityVal of ['movie', 'torrent']) {
                    for (let stage of ['--stage', '-s']) {
                        for (let stageVal of ['first', 'upsert', 'check']) {
                            for (let log of ['--log', '-l']) {
                                for (let logVal of [0, 1]) {
                                    let expectedArgv = {
                                        '_': [command],
                                        'entity': entityVal, 'e': entityVal,
                                        'stage': stageVal, 's': stageVal,
                                        'log': logVal, 'l': logVal,
                                    }
                                    let cmd = [command, entity, entityVal, stage, stageVal, log, logVal].join(' ')
                                    await clijsMatcher(cmd, expectedArgv)
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    // ~ 4 seconds for running this test
    xtest('cli.js getimage -s [] -l []', async () => {
        for (let command of cli.imgAliases) {
            for (let stage of ['--stage', '-s']) {
                for (let stageVal of ['first', 'upsert', 'check']) {
                    for (let log of ['--log', '-l']) {
                        for (let logVal of [0, 1]) {
                            let expectedArgv = {
                                '_': [command],
                                'stage': stageVal, 's': stageVal,
                                'log': logVal, 'l': logVal,
                            }

                            let cmd = [command, stage, stageVal, log, logVal].join(' ')
                            await clijsMatcher(cmd, expectedArgv)
                        }
                    }
                }
            }
        }
    })

    test('isData should return true', () => {
        let cmds = ['getdata', 'data', 'd']
        cmds.forEach(cmd => {
            expect(cli.isData(cmd)).toBe(true)
        })
    })

    test('isImg should return true', () => {
        let cmds = ['getimage', 'getimg', 'image', 'img', 'i']
        cmds.forEach(cmd => {
            expect(cli.isImg(cmd)).toBe(true)
        })
    })

})