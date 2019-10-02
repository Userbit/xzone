
const rootdir = 'xzone'

function getDebug(module) {
    return require('debug')(getNamespace(module, rootdir))
} 

function getNamespace(module, rootdir) {
    const filename = module.filename
    const namespace = filename.slice(filename.indexOf(rootdir))
    return namespace + ':'
}

function sleep(module) {
    let debug = getDebug(module)
    return (delayInSec) => {
        const child_process = require("child_process");
        debug && debug(`Sleep on ${delayInSec} sec...`)
        child_process.execSync("sleep " + delayInSec)
    }
}


module.exports = (module) => {
    return {
        debug: getDebug(module),
        sleep: sleep(module),
        getNamespace,
    }
}
