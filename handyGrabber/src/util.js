const childProcess = require("child_process");
const debugModule = require("debug");

const rootdir = "xzone";

function getNamespace(externalModule, rootDir) {
  const { filename } = externalModule;
  const namespace = filename.slice(filename.indexOf(rootDir));
  return `${namespace}:`;
}

function getDebug(externalModule) {
  return debugModule(getNamespace(externalModule, rootdir));
}

function sleep(externalModule) {
  const debug = getDebug(externalModule);
  return (delayInSec) => {
    // eslint-disable-next-line no-unused-expressions
    debug && debug(`Sleep on ${delayInSec} sec...`);
    childProcess.execSync(`sleep ${delayInSec}`);
  };
}

function getObjectForKeys(keys, fromObject) {
  return keys.reduce((obj, key) => {
    if (fromObject[key]) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = fromObject[key];
    }

    return obj;
  }, {});
}

module.exports = (externalModule) => {
  if (!(externalModule instanceof module.constructor)) {
    const errMsg =
      "require('path/to/util')(module) should be passed Module object of caller";
    throw Error(errMsg);
  }

  return {
    debug: getDebug(externalModule),
    sleep: sleep(externalModule),
    getNamespace,
    getObjectForKeys,
  };
};
