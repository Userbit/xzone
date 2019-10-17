
const rootdir = 'xzone'

function getDebug(externalModule) {
    return require('debug')(getNamespace(externalModule, rootdir))
} 

function getNamespace(externalModule, rootdir) {
    const filename = externalModule.filename
    const namespace = filename.slice(filename.indexOf(rootdir))
    return namespace + ':'
}

function sleep(externalModule) {
    let debug = getDebug(externalModule)
    return (delayInSec) => {
        const child_process = require("child_process");
        debug && debug(`Sleep on ${delayInSec} sec...`)
        child_process.execSync("sleep " + delayInSec)
    }
}

function getObjectForKeys(keys, fromObject) {
    return keys.reduce((obj, key) => {
        obj[key] = fromObject[key]
        return obj
    }, {})
}


module.exports = (externalModule) => {
    if (!(externalModule instanceof module.constructor)) {
        const errMsg = "require('path/to/util')(module) should be passed Module object of caller"
        throw Error(errMsg)
    }

    return {
        debug: getDebug(externalModule),
        sleep: sleep(externalModule),
        getNamespace,
        getObjectForKeys,
    }
}
